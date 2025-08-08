using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Editors;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Infrastructure.PublishedCache;
using Umbraco.Community.Hotspots.Converters;
using Umbraco.Community.Hotspots.Extensions;
using Umbraco.Extensions;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     The value editor for the hotspot property editor.
/// </summary>
internal class HotspotPropertyValueEditor : DataValueEditor
{
    private readonly IDataTypeService _dataTypeService;
    private readonly IMediaService _mediaService;
    private readonly IJsonSerializer _jsonSerializer;
    private readonly ILogger<HotspotPropertyValueEditor> _logger;

    public HotspotPropertyValueEditor(
        DataEditorAttribute attribute,
        ILogger<HotspotPropertyValueEditor> logger,
        ILocalizedTextService localizedTextService,
        IShortStringHelper shortStringHelper,
        IJsonSerializer jsonSerializer,
        IIOHelper ioHelper,
        IDataTypeService dataTypeService,
        IMediaService mediaService)
        : base(localizedTextService, shortStringHelper, jsonSerializer, ioHelper, attribute)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _dataTypeService = dataTypeService;
        _jsonSerializer = jsonSerializer;
        _mediaService = mediaService;
    }

    /// <summary>
    /// </summary>
    public override object? ToEditor(IProperty property, string? culture = null, string? segment = null)
    {
        var val = property.GetValue(culture, segment);
        if (val == null)
        {
            return null;
        }

        HotspotValue? value;
        try
        {
            value = JsonConvert.DeserializeObject<HotspotValue>(val.ToString()!);
        }
        catch
        {
            value = new HotspotValue { Src = val.ToString() };
        }

        IDataType? dataType = _dataTypeService.GetDataType(property.PropertyType.DataTypeId);
        if (dataType?.Configuration != null)
        {
            value?.ApplyConfiguration(dataType.ConfigurationAs<HotspotConfiguration>());
        }

        if (value?.MediaId is not null && value.MediaId is Guid mediaId)
        {
            IMedia? media = _mediaService.GetById(mediaId);

            if (media != null)
            {
                value.Src = media.GetValue<string>(Constants.Conventions.Media.File);
            }
            else
            {
                _logger.LogWarning("Media item with ID '{MediaId}' not found for hotspot value.", value.MediaId);
            }
        }

        return value;
    }

    /// <summary>
    ///     Converts the value received from the editor into the value can be stored in the database.
    /// </summary>
    /// <param name="editorValue">The value received from the editor.</param>
    /// <param name="currentValue">The current value of the property</param>
    /// <returns>The converted value.</returns>
    public override object? FromEditor(ContentPropertyData editorValue, object? currentValue)
    {
        HotspotValue? editorHotspotValue = null;

        try
        {
            if (editorValue.Value?.ToString() is string editorStringValue)
            {
                editorHotspotValue = _jsonSerializer.Deserialize<HotspotValue>(editorStringValue);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, $"Could not parse current editor value to an {nameof(HotspotValue)} object.");
        }

        // ensure we have the required guids
        Guid contentKey = editorValue.ContentKey;
        if (contentKey == Guid.Empty)
        {
            throw new Exception("Invalid content key.");
        }

        Guid propertyTypeKey = editorValue.PropertyTypeKey;
        if (propertyTypeKey == Guid.Empty)
        {
            throw new Exception("Invalid property type key.");
        }

        // update json and return
        if (editorHotspotValue == null)
        {
            return null;
        }

        return _jsonSerializer.Serialize(editorHotspotValue);
    }

    public override string ConvertDbToString(IPropertyType propertyType, object? value)
    {
        if (value == null || string.IsNullOrEmpty(value.ToString()))
        {
            return string.Empty;
        }

        // if we don't have a json structure, we will get it from the property type
        var val = value.ToString();
        if (val?.DetectIsJson() ?? false)
        {
            return val;
        }

        HotspotConfiguration? configuration = _dataTypeService.GetDataType(propertyType.DataTypeId)
            ?.ConfigurationAs<HotspotConfiguration>();
        HotspotConfiguration.SourceImage? source = configuration?.Source;

        return JsonConvert.SerializeObject(
            new { src = val, source },
            new JsonSerializerSettings { Formatting = Formatting.None, NullValueHandling = NullValueHandling.Ignore });
    }
}

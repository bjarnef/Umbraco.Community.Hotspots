using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
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
    private readonly ILogger<HotspotPropertyValueEditor> _logger;

    public HotspotPropertyValueEditor(
        DataEditorAttribute attribute,
        ILogger<HotspotPropertyValueEditor> logger,
        ILocalizedTextService localizedTextService,
        IShortStringHelper shortStringHelper,
        IJsonSerializer jsonSerializer,
        IIOHelper ioHelper,
        IDataTypeService dataTypeService)
        : base(localizedTextService, shortStringHelper, jsonSerializer, ioHelper, attribute)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _dataTypeService = dataTypeService;
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

        return value;
    }

    /// <summary>
    ///     Converts the value received from the editor into the value can be stored in the database.
    /// </summary>
    /// <param name="editorValue">The value received from the editor.</param>
    /// <param name="currentValue">The current value of the property</param>
    /// <returns>The converted value.</returns>
    /// <remarks>
    ///     <para>The <paramref name="currentValue" /> is used to re-use the folder, if possible.</para>
    ///     <para>
    ///         editorValue.Value is used to figure out editorFile and, if it has been cleared, remove the old file - but
    ///         it is editorValue.AdditionalData["files"] that is used to determine the actual file that has been uploaded.
    ///     </para>
    /// </remarks>
    //public override object? FromEditor(ContentPropertyData editorValue, object? currentValue)
    //{

    //}

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

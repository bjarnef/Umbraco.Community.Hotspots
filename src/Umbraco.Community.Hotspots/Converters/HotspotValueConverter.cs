using System.Globalization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.DeliveryApi;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Community.Hotspots.Extensions;
using Umbraco.Community.Hotspots.Models.DeliveryApi;
using Umbraco.Community.Hotspots.PropertyEditors;
using Umbraco.Extensions;

namespace Umbraco.Community.Hotspots.Converters;

/// <summary>
///     Represents a value converter for the hotspot value editor.
/// </summary>
[DefaultPropertyValueConverter(typeof(JsonValueConverter))]
public class HotspotValueConverter : PropertyValueConverterBase, IDeliveryApiPropertyValueConverter
{
    /*private static readonly JsonSerializerSettings _jsonSerializerSettings = new()
    {
        Culture = CultureInfo.InvariantCulture,
        FloatParseHandling = FloatParseHandling.Decimal,
    };*/

    private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;
    private readonly IJsonSerializer _jsonSerializer;
    private readonly ILogger<HotspotValueConverter> _logger;

    public HotspotValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IJsonSerializer jsonSerializer, ILogger<HotspotValueConverter> logger)
    {
        _publishedSnapshotAccessor = publishedSnapshotAccessor ??
                                     throw new ArgumentNullException(nameof(publishedSnapshotAccessor));
        
        _jsonSerializer = jsonSerializer;
        _logger = logger;
    }

    /// <inheritdoc />
    public override bool IsConverter(IPublishedPropertyType propertyType)
        => propertyType.EditorAlias.InvariantEquals(HotspotPropertyEditor.PropertyEditorAlias);

    /// <inheritdoc />
    public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        => typeof(HotspotValue);

    /// <inheritdoc />
    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        => PropertyCacheLevel.Element;

    /// <inheritdoc />
    public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
    {
        if (source == null)
        {
            return null;
        }

        var sourceString = source.ToString()!;

        IPublishedSnapshot publishedSnapshot = _publishedSnapshotAccessor.GetRequiredPublishedSnapshot();

        HotspotValue? value;
        try
        {
            value = _jsonSerializer.Deserialize<HotspotValue>(sourceString);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not deserialize string '{JsonString}' into an hotspot value.", sourceString);
            value = new HotspotValue { Src = sourceString };
        }

        value?.ApplyConfiguration(propertyType.DataType.ConfigurationAs<HotspotConfiguration>()!);

        if (value?.MediaId is not null && value.MediaId is Guid mediaId)
        {
            IPublishedContent? mediaItem = publishedSnapshot.Media?.GetById(preview, mediaId);

            if (mediaItem != null)
            {
                value.Src = mediaItem.Value<string>(Constants.Conventions.Media.File);
            }
            else
            {
                _logger.LogWarning("Media item with ID '{MediaId}' not found for hotspot value.", value.MediaId);
            }
        }

        return value;
    }

    public PropertyCacheLevel GetDeliveryApiPropertyCacheLevel(IPublishedPropertyType propertyType) => GetPropertyCacheLevel(propertyType);

    public Type GetDeliveryApiPropertyValueType(IPublishedPropertyType propertyType) => typeof(ApiHotspotValue);

    public object? ConvertIntermediateToDeliveryApiObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview, bool expanding)
        => inter is HotspotValue { Src: { } } hotspotValue
            ? new ApiHotspotValue(
                hotspotValue.Src,
                hotspotValue.MediaId,
                hotspotValue.GetImageFocalPoint())
            : null;
}

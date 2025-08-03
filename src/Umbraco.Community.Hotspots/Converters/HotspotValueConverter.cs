using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.DeliveryApi;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
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
    private readonly IJsonSerializer _jsonSerializer;

    private readonly ILogger<HotspotValueConverter> _logger;

    public HotspotValueConverter(ILogger<HotspotValueConverter> logger, IJsonSerializer jsonSerializer)
    {
        _logger = logger;
        _jsonSerializer = jsonSerializer;
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

        return value;
    }

    public PropertyCacheLevel GetDeliveryApiPropertyCacheLevel(IPublishedPropertyType propertyType) => GetPropertyCacheLevel(propertyType);

    public Type GetDeliveryApiPropertyValueType(IPublishedPropertyType propertyType) => typeof(ApiHotspotValue);

    public object? ConvertIntermediateToDeliveryApiObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview, bool expanding)
        => inter is HotspotValue { Src: { } } hotspotValue
            ? new ApiHotspotValue(
                hotspotValue.Src,
                hotspotValue.GetImageFocalPoint())
            : null;
}

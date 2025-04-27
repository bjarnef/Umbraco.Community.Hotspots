using Umbraco.Cms.Core.Models.DeliveryApi;
using Umbraco.Community.Hotspots.Converters;

namespace Umbraco.Community.Hotspots.Extensions;

public static class DeliveryApiImageExtensions
{
    public static ImageFocalPoint? GetImageFocalPoint(this HotspotValue hotspotValue)
        => hotspotValue.FocalPoint is not null
            ? new ImageFocalPoint(hotspotValue.FocalPoint.Left, hotspotValue.FocalPoint.Top)
            : null;
}

using Umbraco.Cms.Core.Models.DeliveryApi;

namespace Umbraco.Community.Hotspots.Models.DeliveryApi;

internal class ApiHotspotValue
{
    public ApiHotspotValue(string url, Guid? mediaId, ImageFocalPoint? focalPoint)
    {
        Url = url;
        MediaId = mediaId;
        FocalPoint = focalPoint;
    }

    public string Url { get; }

    public Guid? MediaId { get; }

    public ImageFocalPoint? FocalPoint { get; }
}

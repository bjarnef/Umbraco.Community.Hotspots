using Umbraco.Cms.Core.Models.DeliveryApi;

namespace Umbraco.Community.Hotspots.Models.DeliveryApi;

internal class ApiHotspotValue
{
    public ApiHotspotValue(string url, ImageFocalPoint? focalPoint)
    {
        Url = url;
        FocalPoint = focalPoint;
    }

    public string Url { get; }

    public ImageFocalPoint? FocalPoint { get; }
}

using Umbraco.Community.Hotspots.Converters;
using Umbraco.Community.Hotspots.PropertyEditors;

namespace Umbraco.Community.Hotspots.Extensions;

internal static class HotspotConfigurationExtensions
{
    /// <summary>
    ///     Applies the configuration to ensure selected media reference is applied.
    /// </summary>
    /// <param name="hotspotValue"></param>
    /// <param name="configuration">The configuration.</param>
    public static void ApplyConfiguration(this HotspotValue hotspotValue, HotspotConfiguration? configuration)
    {
        var source = configuration?.Source;

        hotspotValue.MediaId = source?.MediaKey;
    }
}

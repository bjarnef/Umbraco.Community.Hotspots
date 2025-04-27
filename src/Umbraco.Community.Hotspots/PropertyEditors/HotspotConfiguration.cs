using Umbraco.Cms.Core;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents the configuration for the hotspot value editor.
/// </summary>
public class HotspotConfiguration
{
    [ConfigurationField("mediaId", "Image", "mediapicker", Description = "Choose the image to select hotspots.")]
    public GuidUdi? MediaId { get; set; }
}

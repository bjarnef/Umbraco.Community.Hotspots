using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents the configuration for the hotspot value editor.
/// </summary>
public class HotspotConfiguration
{
    [ConfigurationField("source")]
    public SourceImage? Source { get; set; }

    [ConfigurationField("hideHotspot")]
    public bool HideHotspot { get; set; }

    public class SourceImage
    {
        public string Type { get; set; } = null!;

        public Guid? MediaKey { get; set; }

        public string? Src { get; set; }
    }
}

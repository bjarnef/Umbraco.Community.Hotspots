using System.Runtime.Serialization;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents the configuration for the hotspot value editor.
/// </summary>
public class HotspotConfiguration
{
    [ConfigurationField("source", "Image", "/App_Plugins/Umbraco.Community.Hotspots/source-image.html", Description = "Choose the source image to select hotspots.")]
    public SourceImage? Source { get; set; }

    [DataContract]
    public class SourceImage
    {
        [DataMember(Name = "type")]
        public string Type { get; set; } = null!;

        [DataMember(Name = "mediaKey")]
        public Guid? MediaKey { get; set; }

        [DataMember(Name = "src")]
        public string? Src { get; set; }
    }
}

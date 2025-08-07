using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents the configuration editor for the hotspot value editor.
/// </summary>
internal class HotspotConfigurationEditor : ConfigurationEditor<HotspotConfiguration>
{
    public HotspotConfigurationEditor(IIOHelper ioHelper, IEditorConfigurationParser editorConfigurationParser)
        : base(ioHelper, editorConfigurationParser)
    {
    }

    /// <inheritdoc />
    public override IDictionary<string, object> ToValueEditor(object? configuration)
    {
        IDictionary<string, object> config = base.ToValueEditor(configuration);

        bool hideHotspot = config.TryGetValue("hideHotspot", out object? hideHotspotValue) && hideHotspotValue is bool hide && hide;

        if (!config.ContainsKey("focalPoint"))
        {
            config["focalPoint"] = !hideHotspot ? new { left = 0.5, top = 0.5 } : null!;
        }

        if (!config.ContainsKey("src"))
        {
            config["src"] = string.Empty;
        }

        return config;
    }
}

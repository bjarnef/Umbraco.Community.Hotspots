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
        IDictionary<string, object> d = base.ToValueEditor(configuration);
        if (!d.ContainsKey("focalPoint"))
        {
            d["focalPoint"] = new { left = 0.5, top = 0.5 };
        }

        if (!d.ContainsKey("src"))
        {
            d["src"] = string.Empty;
        }

        return d;
    }
}

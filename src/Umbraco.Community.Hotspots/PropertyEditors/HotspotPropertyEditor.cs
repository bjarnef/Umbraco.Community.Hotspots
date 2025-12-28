using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents a hotspot property editor.
/// </summary>
[DataEditor(
    PropertyEditorAlias,
    ValueType = ValueTypes.Json,
    ValueEditorIsReusable = true)]
public class HotspotPropertyEditor : DataEditor
{
    public const string PropertyEditorAlias = "Umbraco.Community.Hotspot";

    private readonly IIOHelper _ioHelper;
    private readonly ILogger<HotspotPropertyEditor> _logger;

    /// <summary>
    ///     Initializes a new instance of the <see cref="HotspotPropertyEditor" /> class.
    /// </summary>
    public HotspotPropertyEditor(
        IDataValueEditorFactory dataValueEditorFactory,
        ILoggerFactory loggerFactory,
        IIOHelper ioHelper)
        : base(dataValueEditorFactory)
    {
        _ioHelper = ioHelper ?? throw new ArgumentNullException(nameof(ioHelper));
        _logger = loggerFactory.CreateLogger<HotspotPropertyEditor>();
        SupportsReadOnly = true;
    }

    public override IPropertyIndexValueFactory PropertyIndexValueFactory { get; } = new NoopPropertyIndexValueFactory();

    /// <summary>
    ///     Creates the corresponding property value editor.
    /// </summary>
    /// <returns>The corresponding property value editor.</returns>
    protected override IDataValueEditor CreateValueEditor() =>
        DataValueEditorFactory.Create<HotspotPropertyValueEditor>(Attribute!);

    /// <summary>
    ///     Creates the corresponding preValue editor.
    /// </summary>
    /// <returns>The corresponding preValue editor.</returns>
    protected override IConfigurationEditor CreateConfigurationEditor() =>
        new HotspotConfigurationEditor(_ioHelper);
}

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Media;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.Hotspots.PropertyEditors;

/// <summary>
///     Represents a hotspot property editor.
/// </summary>
[DataEditor(
    PropertyEditorAlias,
    "Hotspot",
    "/App_Plugins/Umbraco.Community.Hotspots/hotspot.html",
    ValueType = ValueTypes.Json,
    HideLabel = false,
    Group = Constants.PropertyEditors.Groups.Media,
    Icon = "icon-crosshair",
    ValueEditorIsReusable = true)]
public class HotspotPropertyEditor : DataEditor
{

    public const string PropertyEditorAlias = "Umbraco.Community.Hotspot";

    private readonly UploadAutoFillProperties _autoFillProperties;
    private readonly IContentService _contentService;
    private readonly IDataTypeService _dataTypeService;
    private readonly IEditorConfigurationParser _editorConfigurationParser;
    private readonly IIOHelper _ioHelper;
    private readonly ILogger<HotspotPropertyEditor> _logger;
    private readonly MediaFileManager _mediaFileManager;
    private ContentSettings _contentSettings;

    /// <summary>
    ///     Initializes a new instance of the <see cref="HotspotPropertyEditor" /> class.
    /// </summary>
    public HotspotPropertyEditor(
        IDataValueEditorFactory dataValueEditorFactory,
        ILoggerFactory loggerFactory,
        MediaFileManager mediaFileManager,
        IOptionsMonitor<ContentSettings> contentSettings,
        IDataTypeService dataTypeService,
        IIOHelper ioHelper,
        UploadAutoFillProperties uploadAutoFillProperties,
        IContentService contentService,
        IEditorConfigurationParser editorConfigurationParser)
        : base(dataValueEditorFactory)
    {
        _mediaFileManager = mediaFileManager ?? throw new ArgumentNullException(nameof(mediaFileManager));
        _contentSettings = contentSettings.CurrentValue ?? throw new ArgumentNullException(nameof(contentSettings));
        _dataTypeService = dataTypeService ?? throw new ArgumentNullException(nameof(dataTypeService));
        _ioHelper = ioHelper ?? throw new ArgumentNullException(nameof(ioHelper));
        _autoFillProperties =
            uploadAutoFillProperties ?? throw new ArgumentNullException(nameof(uploadAutoFillProperties));
        _contentService = contentService;
        _editorConfigurationParser = editorConfigurationParser;
        _logger = loggerFactory.CreateLogger<HotspotPropertyEditor>();

        contentSettings.OnChange(x => _contentSettings = x);
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
        new HotspotConfigurationEditor(_ioHelper, _editorConfigurationParser);
}

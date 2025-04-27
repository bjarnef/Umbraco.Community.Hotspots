using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Strings;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;

namespace Umbraco.Community.Hotspots.Converters;

/// <summary>
///     Represents a value of the hotspot value editor.
/// </summary>
public class HotspotValue : IHtmlEncodedString //, IEquatable<ImageCropperValue>
{
    /// <summary>
    ///     Gets or sets the value focal point.
    /// </summary>
    public ImageCropperFocalPoint? FocalPoint { get; set; }

    /// <summary>
    ///     Gets or sets the value source image.
    /// </summary>
    public string? Src { get; set; } = string.Empty;

    /// <inheritdoc />
    public string? ToHtmlString() => Src;

    public override string? ToString() => Src;

    /// <summary>
    ///     Determines whether the value has a source image.
    /// </summary>
    public bool HasImage()
        => !string.IsNullOrWhiteSpace(Src);
}

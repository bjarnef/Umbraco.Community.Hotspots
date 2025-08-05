using System.ComponentModel;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Infrastructure.Serialization;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;

namespace Umbraco.Community.Hotspots.Converters;

/// <summary>
///     Represents a value of the hotspot value editor.
/// </summary>
[JsonConverter(typeof(NoTypeConverterJsonConverter<HotspotValue>))]
[TypeConverter(typeof(HotspotValueConverter))]
public class HotspotValue : IHtmlEncodedString, IEquatable<HotspotValue>
{
    /// <summary>
    ///     Gets or sets the value source image.
    /// </summary>
    [DataMember(Name = "src")]
    public string? Src { get; set; } = string.Empty;

    /// <summary>
    ///     Gets or sets the value focal point.
    /// </summary>
    [DataMember(Name = "focalPoint")]
    public ImageCropperFocalPoint? FocalPoint { get; set; }

    /// <inheritdoc />
    public string? ToHtmlString() => Src;

    /// <inheritdoc />
    public override string? ToString()
        => HasFocalPoint() ? JsonConvert.SerializeObject(this, Formatting.None) : Src;

    /// <summary>
    ///     Determines whether the value has a focal point.
    /// </summary>
    /// <returns></returns>
    public bool HasFocalPoint()
        => FocalPoint is not null; // && (FocalPoint.Left != 0.5m || FocalPoint.Top != 0.5m);

    /// <summary>
    ///     Determines whether the value has a source image.
    /// </summary>
    public bool HasImage()
        => !string.IsNullOrWhiteSpace(Src);

    #region IEquatable

    /// <inheritdoc />
    public bool Equals(HotspotValue? other)
        => ReferenceEquals(this, other) || Equals(this, other);

    /// <inheritdoc />
    public override bool Equals(object? obj)
        => ReferenceEquals(this, obj) || (obj is HotspotValue other && Equals(this, other));

    public static bool operator ==(HotspotValue? left, HotspotValue? right)
        => Equals(left, right);

    public static bool operator !=(HotspotValue? left, HotspotValue? right)
        => !Equals(left, right);

    public override int GetHashCode()
    {
        unchecked
        {
            // properties are, practically, readonly
            // ReSharper disable NonReadonlyMemberInGetHashCode
            var hashCode = Src?.GetHashCode() ?? 0;
            hashCode = (hashCode * 397) ^ (FocalPoint?.GetHashCode() ?? 0);
            return hashCode;
            // ReSharper restore NonReadonlyMemberInGetHashCode
        }
    }

    #endregion
}

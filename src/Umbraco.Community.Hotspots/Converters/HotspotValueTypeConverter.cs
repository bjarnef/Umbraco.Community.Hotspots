using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;

namespace Umbraco.Community.Hotspots.Converters;

/// <summary>
///     Converts <see cref="HotspotValue" /> to string or JObject.
/// </summary>
public class HotspotValueTypeConverter : TypeConverter
{
    private static readonly Type[] _convertableTypes = { typeof(JObject) };

    public override bool CanConvertTo(ITypeDescriptorContext? context, Type? destinationType)
    {
        if (destinationType is null)
        {
            return false;
        }

        return _convertableTypes.Any(x => TypeHelper.IsTypeAssignableFrom(x, destinationType))
               || CanConvertFrom(context, destinationType);
    }

    public override object? ConvertTo(ITypeDescriptorContext? context, CultureInfo? culture, object? value, Type destinationType)
    {
        if (value is not HotspotValue cropperValue)
        {
            return null;
        }

        return TypeHelper.IsTypeAssignableFrom<JObject>(destinationType)
            ? JObject.FromObject(cropperValue)
            : base.ConvertTo(context, culture, value, destinationType);
    }
}

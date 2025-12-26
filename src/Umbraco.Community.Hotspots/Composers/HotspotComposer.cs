using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Umbraco.Community.Hotspots.Composers
{
    internal class HotspotComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder) => builder.Services.AddSingleton<IPackageManifestReader, HotspotManifestReader>();
    }
}

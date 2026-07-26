using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Infrastructure.Manifest;
using Umbraco.Community.Hotspots.Migrations;

namespace Umbraco.Community.Hotspots.Composers
{
    internal class HotspotComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<IPackageManifestReader, HotspotManifestReader>();
            builder.AddNotificationAsyncHandler<UmbracoApplicationStartingNotification, RunMigrationsHandler>();
        }
    }
}

using Umbraco.Cms.Core.Manifest;

namespace Umbraco.Community.Hotspots
{
    internal class HotspotsManifestFilter : IManifestFilter
    {
        public void Filter(List<PackageManifest> manifests)
        {
            var assembly = typeof(HotspotsManifestFilter).Assembly;

            manifests.Add(new PackageManifest
            {
                PackageName = "Umbraco Community Hotspots",
                Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
                AllowPackageTelemetry = true,
                Scripts =
                [
                    // List any Script files
                    // Urls should start '/App_Plugins/Umbraco.Community.Hotspots/' not '/wwwroot/Umbraco.Community.Hotspots/', e.g.
                    "/App_Plugins/Umbraco.Community.Hotspots/hotspot.controller.js"
                ],
                Stylesheets =
                [
                    // List any Stylesheet files
                    // Urls should start '/App_Plugins/Umbraco.Community.Hotspots/' not '/wwwroot/Umbraco.Community.Hotspots/', e.g.
                    //"/App_Plugins/Umbraco.Community.Hotspots/Styles/styles.css"
                ]
            });
        }
    }
}

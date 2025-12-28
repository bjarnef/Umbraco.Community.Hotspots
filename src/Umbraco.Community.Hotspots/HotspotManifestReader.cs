using System.Diagnostics;
using System.Reflection;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Umbraco.Community.Hotspots
{
    internal class HotspotManifestReader : IPackageManifestReader
    {
        /*public void Filter(List<PackageManifest> manifests)
        {
            var assembly = typeof(HotspotManifestReader).Assembly;

            manifests.Add(new PackageManifest
            {
                PackageName = "Umbraco Community Hotspots",
                Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
                AllowPackageTelemetry = true,
                Scripts =
                [
                    // List any Script files
                    // Urls should start '/App_Plugins/Umbraco.Community.Hotspots/' not '/wwwroot/Umbraco.Community.Hotspots/', e.g.
                    "/App_Plugins/Umbraco.Community.Hotspots/hotspot.controller.js",
                    "/App_Plugins/Umbraco.Community.Hotspots/source-image.controller.js"
                ],
                Stylesheets =
                [
                    // List any Stylesheet files
                    // Urls should start '/App_Plugins/Umbraco.Community.Hotspots/' not '/wwwroot/Umbraco.Community.Hotspots/', e.g.
                    "/App_Plugins/Umbraco.Community.Hotspots/styles.css"
                ]
            });
        }*/

        public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync()
        {
            var versionInfo = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location);
            var version = $"{versionInfo.FileMajorPart}.{versionInfo.FileMinorPart}.{versionInfo.FileBuildPart}";

            var manifest = (IEnumerable<PackageManifest>)
            [
                new PackageManifest()
                {
                    AllowTelemetry = true,
                    Version = version,
                    Name = versionInfo.ProductName ?? versionInfo.FileName,
                    Extensions =
                    [
                        new
                        {
                            Name = "Umbraco Community Hotspots Bundle",
                            Alias = "Umbraco.Community.Hotspots.Bundle",
                            Type = "bundle",
                            Js = "/App_Plugins/Umbraco.Community.Hotspots/umbraco-community-hotspots.js"
                        }
                    ]

                }
            ];

            return Task.FromResult(manifest);
        }
    }
}

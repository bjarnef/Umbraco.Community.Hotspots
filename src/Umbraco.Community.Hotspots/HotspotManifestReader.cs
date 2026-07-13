using System.Diagnostics;
using System.Reflection;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Umbraco.Community.Hotspots
{
    internal class HotspotManifestReader : IPackageManifestReader
    {
        public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync()
        {
            var versionInfo = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location);
            var version = $"{versionInfo.FileMajorPart}.{versionInfo.FileMinorPart}.{versionInfo.FileBuildPart}";

            // get info from assembly
            //Assembly assembly = typeof(UmbracoPackage).Assembly;
            //var version = assembly.GetName().Version?.ToString() ?? "0.0.0";

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

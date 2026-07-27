# Umbraco Community Hotspots

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.Hotspots?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.Hotspots/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.Hotspots?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.Hotspots)
[![GitHub license](https://img.shields.io/github/license/bjarnef/Umbraco.Community.Hotspots?color=8AB803)](../LICENSE)

Hotspot editor for Umbraco.

## Features

- Choose either media or a static asset as the source image
- Optionally set a hotspot for the image
- Configure whether the hotspot should be set initially
- Works with ModelsBuilder & Umbraco Delivery API

<img alt="Hotspot editor" src="https://github.com/bjarnef/Umbraco.Community.Hotspots/blob/main/docs/screenshots/hotspot-editor.png">

## Installation

> [!IMPORTANT]
> **v1.x** supports Umbraco v13.x  
> **v2.x** supports Umbraco v18.x
> 
> To understand more about which Umbraco CMS versions are actively supported by Umbraco HQ, please see [Umbraco's Long-term Support (LTS) and End-of-Life (EOL) policy](https://umbraco.com/products/knowledge-center/long-term-support-and-end-of-life/).

> [!NOTE]
> Although the focal point has been cleared, it is still displayed due to a bug in the CMS. This issue is expected to be fixed in Umbraco 18.2.0.
>
> When the focal point is cleared, its value is stored as `null`. Using reset button instead sets the focal point to the center coordinates.

This package is [available via NuGet](https://www.nuget.org/packages/Umbraco.Community.Hotspots).

To install the package, you can use either the .NET CLI:

```
dotnet add package Umbraco.Community.Hotspots
```

or the NuGet Package Manager:

```
Install-Package Umbraco.Community.Hotspots
```

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

## License

Licensed under the [MIT License](https://github.com/bjarnef/Umbraco.Community.Hotspots/blob/main/LICENSE).
import { ManifestLocalization } from "@umbraco-cms/backoffice/localization";

const localizations: Array<ManifestLocalization> = [
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localization.Da",
    name: "Hotspot Danish Localization",
    meta: {
      culture: "da"
    },
    js: () => import("./da-dk.js"),
  },
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localization.DaDk",
    name: "Hotspot Danish (Denmark) Localization",
    meta: {
      culture: "da-dk"
    },
    js: () => import("./da-dk.js"),
  },
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localization.EnUs",
    name: "Hotspot English (United States) Localization",
    meta: {
      culture: "en-us"
    },
    js: () => import("./en-us.js"),
  },
  {
    type: 'localization',
    alias: 'Umbraco.Community.Hotspots.Localization.NbNo',
    name: 'Hotspot Norwegian (Norway) Localization',
    meta: {
      culture: 'nb-no'
    },
    js: () => import('./nb-no.js'),
  },
  {
    type: 'localization',
    alias: 'Umbraco.Community.Hotspots.Localization.SvSe',
    name: 'Hotspot Swedish (Sweden) Localization',
    meta: {
      culture: 'sv-se'
    },
    js: () => import('./sv-se.js'),
  }
];

export const manifests = localizations;
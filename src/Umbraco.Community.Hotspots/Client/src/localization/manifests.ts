import { ManifestLocalization } from "@umbraco-cms/backoffice/localization";

const localizations: Array<ManifestLocalization> = [
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localize.DaDK",
    name: "Danish (Denmark)",
    meta: {
      culture: "da-dk"
    },
    js: () => import("./da-dk"),
  },
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localize.Da",
    name: "Danish",
    meta: {
      culture: "da"
    },
    js: () => import("./da-dk"),
  },
  {
    type: "localization",
    alias: "Umbraco.Community.Hotspots.Localize.EnUs",
    name: "English (United States)",
    meta: {
      culture: "en-us"
    },
    js: () => import("./en-us"),
  },
];

export const manifests = localizations;
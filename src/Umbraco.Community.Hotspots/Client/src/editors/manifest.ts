export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "Umbraco.Community.Hotspots.PropertyEditorUi.Hotspot",
    name: "Hotspot Property Editor UI",
    elementName: "hotspot",
    js: () => import("./hotspot.element.js"),
    meta: {
      group: "media",
      icon: "icon-crosshair",
      label: "Hotspot",
      supportsReadOnly: true,
      propertyEditorSchemaAlias: "Umbraco.Community.Hotspot", //"Umbraco.Plain.Json"
      settings: {
        properties: [
          {
            alias: "source",
            label: "Image",
            description: "Choose the source image to select a hotspot.",
            propertyEditorUiAlias: "Umbraco.Community.Hotspots.PropertyEditorUi.SourceImage"
          },
          {
            alias: "hideHotspot",
            label: "Hide hotspot",
            description: "Hide hotspot initially.",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
          }
        ],
        defaultData: [
          {
            alias: "source",
            value: "media"
          }
        ]
      }
    }
  },
  {
    type: "propertyEditorUi",
    alias: "Umbraco.Community.Hotspots.PropertyEditorUi.SourceImage",
    name: "Source Image Property Editor UI",
    js: () => import("./source-image.element.js"),
    meta: {
      label: "Hotspot Source Image",
      icon: "icon-picture",
      group: "common",
      propertyEditorSchemaAlias: "Umbraco.Plain.Json"
    }
  }
];

import { UMBRACO_COMMUNITY_HOTSPOTS_PROPERTY_EDITOR_UI_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: UMBRACO_COMMUNITY_HOTSPOTS_PROPERTY_EDITOR_UI_ALIAS,
    name: "Hotspot Property Editor UI",
    elementName: "hotspot-property-editor-ui",
    js: () => import("./hotspot.element.js"),
    meta: {
      group: "media",
      icon: "icon-crosshair",
      label: "Hotspot",
      supportsReadOnly: true,
      propertyEditorSchemaAlias: "Umbraco.Plain.Json", // "Umbraco.Community.Hotspot"
      settings: {
        properties: [
          {
            alias: "source",
            label: "Image",
            description: "Choose the source image to select a hotspot.",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
            //propertyEditorUiAlias: "Umbraco.Community.Hotspots.PropertyEditorUi.SourceImage"
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
  /*{
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
  }*/
];

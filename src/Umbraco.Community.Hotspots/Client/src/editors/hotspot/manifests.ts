import { UMBRACO_COMMUNITY_HOTSPOTS_PROPERTY_EDITOR_UI_ALIAS } from '../constants.js';
import { manifest as schemaManifest } from './editor-schema.js';

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
      propertyEditorSchemaAlias: "Umbraco.Community.Hotspot"
    }
  },
  schemaManifest,
];

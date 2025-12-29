import type { ManifestPropertyEditorSchema } from '@umbraco-cms/backoffice/property-editor';
import { UMBRACO_COMMUNITY_HOTSPOTS_PROPERTY_EDITOR_UI_ALIAS } from '../constants.js';

export const manifest: ManifestPropertyEditorSchema = {
  type: 'propertyEditorSchema',
  name: 'Hotspot Editor',
  alias: 'Umbraco.Community.Hotspot',
  meta: {
    defaultPropertyEditorUiAlias: UMBRACO_COMMUNITY_HOTSPOTS_PROPERTY_EDITOR_UI_ALIAS,
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
      ]
    },
  },
};

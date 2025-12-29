import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/property-editor';

export const manifest: ManifestPropertyEditorUi = {
  type: "propertyEditorUi",
  alias: "Umbraco.Community.Hotspots.PropertyEditorUi.SourceImage",
  name: "Source Image Property Editor UI",
  js: () => import("./source-image.element.js"),
  meta: {
    label: "Hotspot Source Image",
    icon: "icon-picture",
    group: "common"
  }
};

import { manifest as sourceImageEditor } from './source-image/manifest.js';
import { manifests as hotspotEditorManifests } from './hotspot/manifests.js';

export const manifests: Array<UmbExtensionManifest> = [
  ...hotspotEditorManifests,
  sourceImageEditor,
];

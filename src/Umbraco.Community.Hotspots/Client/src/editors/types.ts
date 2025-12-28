import type { UmbFocalPointModel } from '@umbraco-cms/backoffice/media';

export type HotspotPropertyEditorValue = {
  focalPoint: UmbFocalPointModel;
  src: string | null | undefined;
  mediaId?: string | null;
};

export type SourceImagePropertyEditorValue = {
  type: 'media' | 'staticAsset';
  src?: string | null;
  mediaId?: string | null;
};

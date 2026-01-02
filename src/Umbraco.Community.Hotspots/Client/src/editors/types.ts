import type { UmbFocalPointModel } from '@umbraco-cms/backoffice/media';

export type SourceImageType = 'media' | 'staticAsset';

export type HotspotPropertyEditorValue = {
  focalPoint: UmbFocalPointModel;
  src: string | null | undefined;
  mediaId?: string | null;
};

export type SourceImagePropertyEditorValue = {
  type: SourceImageType;
  src?: string | null;
  mediaKey?: string | null;
};

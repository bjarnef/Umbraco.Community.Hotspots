import { customElement, html, css, property, query, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbFocalPointChangeEvent } from '@umbraco-cms/backoffice/media';
import type { UmbImageCropperFocalPoint } from '@umbraco-cms/backoffice/media';
import type { UmbPropertyEditorConfigCollection, UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT, UmbDocumentWorkspaceContext } from "@umbraco-cms/backoffice/document";
import { ImageCropModeModel } from '@umbraco-cms/backoffice/external/backend-api';
import { UmbImagingRepository } from "@umbraco-cms/backoffice/imaging";
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UMB_SERVER_CONTEXT } from '@umbraco-cms/backoffice/server';
import type { HotspotPropertyEditorValue, SourceImagePropertyEditorValue, SourceImageType } from '../types.js';
import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";

@customElement("hotspot-property-editor-ui")
export class HotspotPropertyEditorUiElement
  extends UmbFormControlMixin<HotspotPropertyEditorValue, typeof UmbLitElement, undefined>(UmbLitElement, undefined)
  implements UmbPropertyEditorUiElement {

  @query('#focal-point') focalPointElement!: HTMLElement;

  @property({ attribute: false })
  public override set value(value) {
    if (!value) {
      this.focalPoint = null;
      this.src = '';
      this.mediaId = undefined;
      this.#value = undefined;
    } else {
      this.focalPoint = value.focalPoint || null;
      this.src = value.src || undefined;
      this.mediaId = value.mediaId || undefined;
      this.#value = value;
    }

    this.requestUpdate();
  }
  public override get value() {
    return this.#value;
  }
  #value?: HotspotPropertyEditorValue;

  @property({ type: Boolean })
  mandatory = false;

  @state()
  private _config?: UmbPropertyEditorConfigCollection;

  @state()
  private type?: SourceImageType;

  @state()
  private src?: string;

  @state()
  private mediaId?: string;

  @state()
  private _imgSrc?: string;

  @state()
  focalPoint: UmbImageCropperFocalPoint | null = { left: 0.5, top: 0.5 };

  @state()
  hideHotspot = false;

  @property({ attribute: false })
  public set config(config: UmbPropertyEditorConfigCollection) {
    this._config = config;
    this.#setConfig();
  };

  #documentWorkspaceContext?: UmbDocumentWorkspaceContext;
  #imagingRepository = new UmbImagingRepository(this);

  async #setConfig() {
    if (this._config && this.#documentWorkspaceContext) {
      this.hideHotspot = this._config?.getValueByAlias<boolean>('hideHotspot') ?? false;

      // Apply initial focal point only when there is no persisted value yet.
      if (!this.#value) {
        this.focalPoint = this.hideHotspot ? null : { left: 0.5, top: 0.5 };
      }

      const source = this._config?.getValueByAlias<SourceImagePropertyEditorValue>('source');
      if (source) {
        this.type = source.type === "staticAsset" ? "staticAsset" : "media";
        this.src = source.src?.replace(/^~/, '') || undefined;
        this.mediaId = source.mediaKey || undefined;
      }
    }
  }

  async #retrieveMedia() {

    const mediaUnique = this.mediaId || null;

    if (!mediaUnique) {
      return;
    }

    const maxImageSize = 2000;

    // Get the resized image URL 
    const { data } = await this.#imagingRepository.requestResizedItems([mediaUnique], {
      width: maxImageSize,
      height: maxImageSize,
      mode: ImageCropModeModel.MAX,
    });

    if (!data || data.length === 0) return;

    this._imgSrc = data[0].url;
  }

  connectedCallback() {
    super.connectedCallback();
    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentWorkspaceContext = context;
      this.#setConfig();

      if (this.type === "media") {
        this.#retrieveMedia();
      }
    });
  }

  @state()
  private _serverUrl = '';

  get source(): string {
    if (this.src) {
      // Test that URL is relative:
      if (this.src.startsWith('/')) {
        return `${this._serverUrl}${this.src}`;
      } else {
        return this.src;
      }
    }

    return '';
  }

  constructor() {
    super();

    this.consumeContext(UMB_SERVER_CONTEXT, (context) => {
      this._serverUrl = context?.getServerUrl() ?? '';
    });
  }

  protected firstUpdated(): void {
    this.addValidator(
			'valueMissing',
			() => 'Hotspot is required',
			() => this.mandatory && !this.value?.focalPoint,
		);
  }

  #onFocalPointChange = (event: UmbFocalPointChangeEvent) => {
    this.focalPoint = { top: event.focalPoint.top, left: event.focalPoint.left };
    this.#updateValue();
  };

  #updateValue() {
    this.#value = {
      ...(this.#value ?? {}),
      focalPoint: this.focalPoint,
      mediaId: this.mediaId,
      src: this.src,
    } as HotspotPropertyEditorValue;

    this.dispatchEvent(new UmbChangeEvent());
  }

  protected onClearFocalPoint = async () => {
    this.focalPoint = null;

    await this.updateComplete;
    this.#updateValue();
  };

  protected onResetFocalPoint = () => {
    this.focalPoint = { left: 0.5, top: 0.5 };
    this.#updateValue();
  };

  override render() {
    return html`
			<div id="main">${this.renderMain()}</div>
		`;
  }

  protected renderMain() {
    return html`
      <umb-image-cropper-focus-setter
				.focalPoint=${this.focalPoint}
				.src=${this._imgSrc ?? this.source}
				@focalpoint-change=${this.#onFocalPointChange}>
			</umb-image-cropper-focus-setter>
      <div id="actions">${this.renderActions()}</div>
     `;
  }

  protected renderActions() {
    return html`
      ${when(this.focalPoint != null,
        () => html`
          <uui-button compact label=${this.localize.term('hotspot_clearFocalPoint')} @click=${this.onClearFocalPoint}>
					  <uui-icon name="icon-remove"></uui-icon>
					  <umb-localize key="hotspot_clearFocalPoint">Clear focal point</umb-localize>
				  </uui-button>
				`,
      )}
			${when(this.focalPoint != null && this.focalPoint.left !== 0.5 && this.focalPoint.top !== 0.5,
      () => html`
					<uui-button compact label=${this.localize.term('content_resetFocalPoint')} @click=${this.onResetFocalPoint}>
						<uui-icon name="icon-axis-rotation"></uui-icon>
						<umb-localize key="content_resetFocalPoint">Reset focal point</umb-localize>
					</uui-button>
				`,
      )}
		`;
  }

  static styles = css`
    :host {
		  display: flex;
		  width: 100%;
		  box-sizing: border-box;
		  gap: var(--uui-size-space-3);
		  height: 400px;
	  }

    #main {
			max-width: 500px;
			min-width: 300px;
			width: 100%;
			height: 100%;
			display: flex;
			gap: var(--uui-size-space-1);
			flex-direction: column;
		}

		#actions {
			display: flex;
			justify-content: space-between;
			margin-top: 0.5rem;

			uui-icon {
				padding-right: var(--uui-size-1);
			}
		}

    umb-image-cropper-focus-setter {
			height: calc(100% - 33px - 0.5rem - var(--uui-size-space-1)); /* Temp solution to make room for actions */
		}

   `;
}

export default HotspotPropertyEditorUiElement;


declare global {
  interface HTMLElementTagNameMap {
    'hotspot-property-editor-ui': HotspotPropertyEditorUiElement;
  }
}

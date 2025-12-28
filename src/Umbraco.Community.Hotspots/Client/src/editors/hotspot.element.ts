import { customElement, html, css, property, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
//import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { UmbFocalPointChangeEvent } from '@umbraco-cms/backoffice/media';
import type { UmbImageCropperFocalPoint } from '@umbraco-cms/backoffice/media';
import type { UmbPropertyEditorConfigCollection, UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT, UmbDocumentWorkspaceContext } from "@umbraco-cms/backoffice/document";
//import { UmbDocumentDetailRepository } from "@umbraco-cms/backoffice/document";
//import { UmbDocumentItemRepository } from "@umbraco-cms/backoffice/document";
//import { UmbMediaDetailRepository } from "@umbraco-cms/backoffice/media";
//import { UmbEntityUnique } from "@umbraco-cms/backoffice/entity";
//import { UmbElementDetailModel } from "@umbraco-cms/backoffice/content";
//import { UmbImagingRepository } from "@umbraco-cms/backoffice/imaging";
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UMB_SERVER_CONTEXT } from '@umbraco-cms/backoffice/server';
import type { HotspotPropertyEditorValue } from './types.js';

@customElement("hotspot-property-editor-ui")
export class HotspotPropertyEditorUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  /*static properties = {
    value: { type: Object },
    config: { type: Object },
  }*/

  @property({ attribute: false })
  set value(value) {
    if (!value) {
      this.focalPoint = { left: 0.5, top: 0.5 };
      this.src = '';
      this.#value = undefined;
    } else {
      // TODO: This is a temporary solution to make sure we have a focal point
      this.focalPoint = value.focalPoint || { left: 0.5, top: 0.5 };
      this.src = value.src || undefined;
      this.#value = value;
    }

    this.requestUpdate();
  }
  get value() {
    return this.#value;
  }
  #value?: HotspotPropertyEditorValue;

  @state()
  private _config?: UmbPropertyEditorConfigCollection;

  @state()
  private src?: string;

  @state()
  focalPoint: UmbImageCropperFocalPoint = { left: 0.5, top: 0.5 };

  @property({ type: Boolean })
  hideFocalPoint = false;

  @property({ attribute: false })
  public set config(config: UmbPropertyEditorConfigCollection) {
    this._config = config;
    this.#setConfig();
  };

  #documentWorkspaceContext?: UmbDocumentWorkspaceContext;
  //#documentDetailRepository = new UmbDocumentDetailRepository(this);
  //#documentItemRepository = new UmbDocumentItemRepository(this);
  //#mediaDetailRepository = new UmbMediaDetailRepository(this);
  //#imagingRepository = new UmbImagingRepository(this);

  async #setConfig() {
    if (this._config && this.#documentWorkspaceContext) {

      //const imagePropertyAlias = this._config.getValueByAlias("imageSrc")?.toString();
      

    }
  }

  /*#getPropertyValue(alias: string, item: UmbElementDetailModel | undefined): any {
    if (!item) {
      return null;
    }

    const value = item?.values.find((i) => i.alias === alias);
    if (value) {
      return value.value;
    }
    return null;
  }*/

  connectedCallback() {
    super.connectedCallback();
    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentWorkspaceContext = context;
      this.#setConfig();
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

  #onFocalPointChange = (event: UmbFocalPointChangeEvent) => {
    this.focalPoint = { top: event.focalPoint.top, left: event.focalPoint.left };
    this.#updateValue();
  };

  #updateValue() {
    this.#value = {
      focalPoint: this.focalPoint,
      src: this.src,
    };

    this.dispatchEvent(new UmbChangeEvent());
  }

  protected onResetFocalPoint = () => {
    this.focalPoint = { left: 0.5, top: 0.5 };
    this.#updateValue();
  };

  render() {
    return html`
      <umb-image-cropper-focus-setter
				.focalPoint=${this.focalPoint}
				.src=${this.source}
				?hideFocalPoint=${this.hideFocalPoint}
				@focalpoint-change=${this.#onFocalPointChange}>
			</umb-image-cropper-focus-setter>
      <div id="actions">${this.renderActions()}</div>
     `;
  }

  protected renderActions() {
    return html`
			<slot name="actions"></slot>
			${when(
      !this.hideFocalPoint && this.focalPoint.left !== 0.5 && this.focalPoint.top !== 0.5,
      () => html`
					<uui-button compact label=${this.localize.term('content_resetFocalPoint')} @click=${this.onResetFocalPoint}>
						<uui-icon name="icon-axis-rotation"></uui-icon>
						${this.localize.term('content_resetFocalPoint')}
					</uui-button>
				`,
    )}
		`;
  }

  static styles = css`
   `;
}

export default HotspotPropertyEditorUiElement;


declare global {
  interface HTMLElementTagNameMap {
    'hotspot-property-editor-ui': HotspotPropertyEditorUiElement;
  }
}

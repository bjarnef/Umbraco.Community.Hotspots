import { customElement, css, html, ifDefined, nothing, property, repeat, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/router';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { UMB_WORKSPACE_MODAL } from '@umbraco-cms/backoffice/workspace';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbStaticFilePickerInputContext } from '@umbraco-cms/backoffice/static-file';
import { UmbMediaPickerInputContext } from '@umbraco-cms/backoffice/media';
import type { UmbMediaCardItemModel } from '@umbraco-cms/backoffice/media';
import type { SourceImagePropertyEditorValue } from '../types.js';

@customElement("source-image-property-editor-ui")
export class SourceImagePropertyEditorUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {
  //@property()
  //value?: string;

  @property({ attribute: false })
  set value(value) {
    if (!value) {
      this.#value = undefined;
    } else {
      this.#value = value;
    }

    this.requestUpdate();
  }
  get value() {
    return this.#value;
  }
  #value?: SourceImagePropertyEditorValue;

  /**
   * Sets the input to readonly mode, meaning value cannot be changed but still able to read and select its content.
   * @type {boolean}
   * @attr
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  @state()
  _type: 'media' | 'staticAsset' = 'media';

  @state()
  private _editMediaPath = '';

  @state()
  private _cards: Array<UmbMediaCardItemModel> = [];

  #pickerInputContext = new UmbMediaPickerInputContext(this);
  #pickerFileInputContext = new UmbStaticFilePickerInputContext(this);

  constructor() {
    super();

    new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
      .addAdditionalPath('media')
      .onSetup(() => {
        return { data: { entityType: 'media', preset: {} } };
      })
      .observeRouteBuilder((routeBuilder) => {
        this._editMediaPath = routeBuilder({});
      });

    this.observe(this.#pickerInputContext.selection, (selection) => {
      if (this.value) {
        this.value.mediaId = selection[0];
      }
    });

    this.observe(this.#pickerInputContext.selectedItems, async (selectedItems) => {
      const missingCards = selectedItems.filter((item) => !this._cards.find((card) => card.unique === item.unique));
      if (selectedItems?.length && !missingCards.length) return;

      this._cards = selectedItems ?? [];
    });

    /*this.observe(this.#pickerFileInputContext.selection, (selection) => {
      if (this.value) {
        console.log("Static file selected:", selection[0]);

        const path = decodeURIComponent(selection[0].replace(/\+/g, " "));
        console.log("path:", path);
        const url = "~/" + path.replace("wwwroot/", "");
        console.log("url:", url);

        this.value.src = url;
      }
    });*/
  }

  #onInput(e: UUIBooleanInputEvent) {
    this._type = e.target.value === "staticAsset" ? "staticAsset" : "media";
    //this.value = { type: this._type };
    this.dispatchEvent(new UmbChangeEvent());
  }

  #openMediaPicker() {
    this.#pickerInputContext.openPicker(
      {
        multiple: false,
        //startNode: this.startNode,
      },
      {
        /*allowedContentTypes: this.allowedContentTypeIds?.map((id) => ({
          unique: id,
          entityType: UMB_MEDIA_TYPE_ENTITY_TYPE,
        })),*/
        includeTrashed: false,
      },
    );
  }

  #openStaticFilePicker() {
    this.#pickerFileInputContext.openPicker(
      {
        pickableFilter: (item) => !item.isFolder,
        multiple: false,
        hideTreeRoot: true
      }
    );
  }

  async #onRemove(item: UmbMediaCardItemModel) {
    await this.#pickerInputContext.requestRemoveItem(item.unique);
    this._cards = this._cards.filter((x) => x.unique !== item.unique);
  }

  override render() {
    return html`<div>Test
        ${this.#renderOptions()}
        <div>
          ${when(
            this._type === 'staticAsset',
            () => html`<div class="container">
               ${this.#renderStaticFileAddButton()}
              </div>`,
            () =>
              html`<div class="container">
                ${this.#renderItems()} ${this.#renderMediaAddButton()}
              </div>`,
          )}
        </div>
      </div>
     `;
  }

  #renderOptions() {
    return html`<uui-radio-group @input=${this.#onInput} value="${this._type}">
			  <uui-radio name="type" label="Media" value="media" required></uui-radio>
			  <uui-radio name="type" label="Static Asset" value="staticAsset" required></uui-radio>
		  </uui-radio-group>`;
  }

  #renderItems() {
    if (!this._cards?.length) return nothing;
    return html`
			${repeat(
        this._cards,
        (item) => item.unique,
        (item) => this.#renderItem(item),
      )}
		`;
  }

  #renderItem(item: UmbMediaCardItemModel) {
    const href = this.readonly ? undefined : `${this._editMediaPath}edit/${item.unique}`;
    return html`
			<uui-card-media
				name=${ifDefined(item.name === null ? undefined : item.name)}
				data-mark="${item.entityType}:${item.unique}"
				href="${ifDefined(href)}"
				?readonly=${this.readonly}>
				<umb-imaging-thumbnail
					unique=${item.unique}
					alt=${item.name}
					icon=${item.mediaType.icon}></umb-imaging-thumbnail>
				<uui-action-bar slot="actions">${this.#renderRemoveAction(item)}</uui-action-bar>
			</uui-card-media>
		`;
  }

  #renderMediaAddButton() {
    if (this._cards && this._cards.length >= 1) return nothing;
    if (this.readonly && this._cards.length > 0) {
      return nothing;
    } else {
      return html`
				<uui-button
					id="btn-add"
					look="placeholder"
					@click=${this.#openMediaPicker}
					label=${this.localize.term('general_choose')}
					?disabled=${this.readonly}>
					<uui-icon name="icon-add"></uui-icon>
					${this.localize.term('general_choose')}
				</uui-button>
			`;
    }
  }

  #renderStaticFileAddButton() {
    return html`
			<uui-button
				id="btn-add"
				look="placeholder"
				@click=${this.#openStaticFilePicker}
				label=${this.localize.term('general_choose')}></uui-button>
		`;
  }

  #renderRemoveAction(item: UmbMediaCardItemModel) {
    if (this.readonly) return nothing;
    return html`
			<uui-button label=${this.localize.term('general_remove')} look="secondary" @click=${() => this.#onRemove(item)}>
				<uui-icon name="icon-trash"></uui-icon>
			</uui-button>
		`;
  }

  static override styles = [
    css`
			:host {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			}

      uui-radio-group {
        display: flex;
        gap: 1rem;
        margin-bottom: var(--uui-size-space-2);
      }

      .container {
				display: grid;
				gap: var(--uui-size-space-3);
				grid-template-columns: repeat(auto-fill, minmax(var(--umb-card-medium-min-width), 1fr));
				grid-auto-rows: var(--umb-card-medium-min-width);
			}

      #btn-add {
				text-align: center;
				height: 100%;
			}

			uui-icon {
				display: block;
				margin: 0 auto;
			}

			uui-card-media umb-icon {
				font-size: var(--uui-size-8);
			}

			img {
				background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
				background-size: 10px 10px;
				background-repeat: repeat;
			}
		`,
  ];
}

export default SourceImagePropertyEditorUiElement;

declare global {
  interface HTMLElementTagNameMap {
    'source-image-property-editor-ui': SourceImagePropertyEditorUiElement;
  }
}

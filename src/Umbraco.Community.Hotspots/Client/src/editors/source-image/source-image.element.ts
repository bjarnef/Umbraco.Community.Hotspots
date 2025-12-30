import { customElement, css, html, ifDefined, nothing, property, repeat, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/router';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UMB_WORKSPACE_MODAL } from '@umbraco-cms/backoffice/workspace';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
//import { UmbStaticFilePickerInputContext } from '@umbraco-cms/backoffice/static-file';
import { isUmbracoFolder, UmbMediaTypeStructureRepository } from '@umbraco-cms/backoffice/media-type';
import { UMB_MEDIA_TYPE_ENTITY_TYPE } from '@umbraco-cms/backoffice/media-type';
//import { UmbMediaPickerInputContext } from '@umbraco-cms/backoffice/media';
import { UmbMediaDetailRepository } from '@umbraco-cms/backoffice/media';
import type { UmbMediaCardItemModel } from '@umbraco-cms/backoffice/media';
import type { SourceImagePropertyEditorValue, SourceImageType } from '../types.js';
//import { UMB_PICKER_INPUT_CONTEXT } from '@umbraco-cms/backoffice/picker-input';
import { UUIRadioElement } from '@umbraco-cms/backoffice/external/uui';
import type { UUIRadioEvent } from '@umbraco-cms/backoffice/external/uui';
import type { UmbMediaItemModel } from '@umbraco-cms/backoffice/media';
import type { UmbMediaTypeEntityType } from '@umbraco-cms/backoffice/media-type';

import { UMB_MEDIA_PICKER_MODAL } from '@umbraco-cms/backoffice/media';
import { UMB_STATIC_FILE_PICKER_MODAL, UmbStaticFilePickerModalData } from '@umbraco-cms/backoffice/static-file';

import {
  UMB_MODAL_MANAGER_CONTEXT
} from "@umbraco-cms/backoffice/modal";

@customElement("source-image-property-editor-ui")
export class SourceImagePropertyEditorUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {
  //@property()
  //value?: string;

  @property({ attribute: false })
  set value(value) {
    if (!value) {
      this.#value = undefined;
    } else {
      this._type = value.type;
      this.mediaId = value.mediaId || undefined;
      this.src = value.src || undefined;
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
  private _type: SourceImageType = 'media';

  @state()
  private src?: string;

  @state()
  private mediaId?: string;

  @state()
  private _editMediaPath = '';

  @state()
  private _cards: Array<UmbMediaCardItemModel> = [];

  @state()
  private _allowedMediaTypeUniques?: Array<string>;

  //#pickerFileInputContext = new UmbStaticFilePickerInputContext(this);
  //#pickerInputContext = new UmbMediaPickerInputContext(this);

  //#pickerInputContext?: typeof UMB_PICKER_INPUT_CONTEXT.TYPE;
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

  //readonly #itemManager = new UmbRepositoryItemsManager<UmbMediaItemModel>(this, UMB_MEDIA_ITEM_REPOSITORY_ALIAS);

  readonly #mediaRepository = new UmbMediaDetailRepository(this);

  constructor() {
    super();

    //this.observe(this.#itemManager.items, () => {
    //  this.#populateCards();
    //});

    console.log("value", this.value);

    new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
      .addAdditionalPath('media')
      .onSetup(() => {
        return { data: { entityType: 'media', preset: {} } };
      })
      .observeRouteBuilder((routeBuilder) => {
        this._editMediaPath = routeBuilder({});
      });

    this.#getMediaTypes();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManagerContext = instance;
      // modalManagerContext is now ready to be used.
    });

    /*this.consumeContext(UMB_PICKER_INPUT_CONTEXT, (pickerInputContext) => {
      this.#pickerInputContext = pickerInputContext;
    });*/

    /*this.observe(this.#pickerInputContext?.selection, (selection) => {
      if (this.value && selection) {
        this.mediaId = selection[0];
        this.#updateValue();
      }
    });

    this.observe((this.#pickerInputContext as UmbMediaPickerInputContext)?.selectedItems, async (selectedItems) => {
      const missingCards = selectedItems.filter((item) => !this._cards.find((card) => card.unique === item.unique));
      if (selectedItems?.length && !missingCards.length) return;

      this._cards = selectedItems ?? [];
    });*/
  }

  firstUpdated() {
    this.#populateCards();
  }

  async #getMediaTypes() {
    // Get all the media types, excluding the folders, so that files are selectable media items.
    const mediaTypeStructureRepository = new UmbMediaTypeStructureRepository(this);
    const { data: mediaTypes } = await mediaTypeStructureRepository.requestAllowedChildrenOf(null, null);
    this._allowedMediaTypeUniques =
      (mediaTypes?.items.map((x) => x.unique).filter((x) => x && !isUmbracoFolder(x)) as Array<string>) ?? [];
  }

  async #populateCards() {
    /*const mediaItems = this.#itemManager.getItems();
    const media = mediaItems.find((x) => x.unique === this.value?.mediaId);

    this._cards =
      media ? [media] : [];*/

    if (!this.mediaId) return;

    const { data: image } = await this.#mediaRepository.requestByUnique(this.mediaId)
    console.log(image);

    const card: UmbMediaCardItemModel = {
      entityType: "media",
      unique: image?.unique ?? "",
      src: (image?.values.find(v => v.alias === "umbracoFile")?.value as any)?.src,
      name: image?.variants[0]?.name ?? "",
      isTrashed: image?.isTrashed ?? false,
      hasChildren: false,
      parent: null,
      variants: image?.variants ?? [],
      mediaType: {
        unique: image?.mediaType.unique ?? '',
        icon: image?.mediaType.icon ?? '',
        collection: image?.mediaType.collection || null
      }
    };

    this._cards = [...this._cards, card];
  }

  #updateValue() {
    this.#value = {
      type: this._type,
      mediaId: this.mediaId || null,
      src: this.src,
    };

    this.dispatchEvent(new UmbChangeEvent());
  }

  #onChange(event: UUIRadioEvent) {
    event.stopPropagation();
    if (!(event.target instanceof UUIRadioElement)) return;
    this._type = event.target.value === "staticAsset" ? "staticAsset" : "media";
    this.#updateValue();
  }

  #openMediaPicker() {    
    const modalContext = this.#modalManagerContext?.open(this, UMB_MEDIA_PICKER_MODAL, {
      data: {
        multiple: false,
        filter: (item) => !item.isFolder,
        pickableFilter: (item) => this.#pickableFilter(item, this._allowedMediaTypeUniques?.map((id) => ({
          unique: id,
          entityType: UMB_MEDIA_TYPE_ENTITY_TYPE,
        }))),
      }
    });
    modalContext
      ?.onSubmit()
      .then((value) => {
        /**/
        if (value.selection && value.selection.length > 0) {
          this.mediaId = value.selection[0] || undefined;

          if (this.mediaId) {
            this.#populateCards();
          }

          this.#updateValue();
        }
      })
      .catch(() => undefined);

    /*this.#pickerInputContext.openPicker(
      {
        multiple: false,
        //startNode: this.startNode,
      },
      {
        allowedContentTypes: this._allowedMediaTypeUniques?.map((id) => ({
          unique: id,
          entityType: UMB_MEDIA_TYPE_ENTITY_TYPE,
        })),
        includeTrashed: false,
      },
    );*/
  }

  #pickableFilter = (
    item: UmbMediaItemModel,
    allowedContentTypes?: Array<{ unique: string; entityType: UmbMediaTypeEntityType }>,
  ): boolean => {
    if (allowedContentTypes && allowedContentTypes.length > 0) {
      return allowedContentTypes
        .map((contentTypeReference) => contentTypeReference.unique)
        .includes(item.mediaType.unique);
    }
    return true;
  };

  #openStaticFilePicker() {

    const data: UmbStaticFilePickerModalData = {
      hideTreeRoot: true,
      multiple: false,
      pickableFilter: (item) => !item.isFolder && (item.name.endsWith('.png') || item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.gif') || item.name.endsWith('.webp'))
    };
    const modalContext = this.#modalManagerContext?.open(this, UMB_STATIC_FILE_PICKER_MODAL, { data });
    modalContext
      ?.onSubmit()
      .then((value) => {
        /*this._cards = [...this._cards,
          {
            url: value.url,
            preview: value.markup,
            width: value.width,
            height: value.height
          }
        ];*/
        if (value.selection && value.selection.length > 0) {

          if (!value.selection[0]) return;

          const path = value.selection[0];

          const filenameWithExt = path.substring(path.lastIndexOf('/') + 1);
          const extension = filenameWithExt.substring(filenameWithExt.lastIndexOf('.') + 1);
          const filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.'));

          const url = decodeURIComponent(filename.replace(/\+/g, " ")) + `.${extension}`;
          const src = "~" + url.replace("wwwroot/", "");

          console.log("SRC", src);

          this.mediaId = undefined;
          this.src = src;
          this.#updateValue();
        }
      })
      .catch(() => undefined);
    /*(this.#pickerInputContext as UmbStaticFilePickerInputContext)?.openPicker(
      {
        pickableFilter: (item) => !item.isFolder,
        multiple: false,
        hideTreeRoot: true
      }
    */
  }

  async #onRemove(item: UmbMediaCardItemModel) {
    //await this.#pickerInputContext?.requestRemoveItem(item.unique);
    this._cards = this._cards.filter((x) => x.unique !== item.unique);
  }

  override render() {
    return html`<div>
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
        <pre>${JSON.stringify(this.value, null, 2)}</pre>
      </div>
     `;
  }

  #renderOptions() {
    return html`<uui-radio-group @change=${this.#onChange} value="${this._type}" required>
			  <uui-radio name="type" label="Media" value="media"></uui-radio>
			  <uui-radio name="type" label="Static Asset" value="staticAsset"></uui-radio>
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
          ${this.#renderIsTrashed(item)}
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
				label=${this.localize.term('general_choose')}
        ?disabled=${this.readonly}>
        <uui-icon name="icon-add"></uui-icon>
        ${this.localize.term('general_choose')}
      </uui-button>
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

  #renderIsTrashed(item: UmbMediaCardItemModel) {
    if (!item.isTrashed) return nothing;
    return html`
			<uui-tag size="s" slot="tag" color="danger">
				<umb-localize key="mediaPicker_trashed">Trashed</umb-localize>
			</uui-tag>
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

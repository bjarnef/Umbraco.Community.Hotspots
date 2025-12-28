import { html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { SourceImagePropertyEditorValue } from './types.js';

export default class SourceImageElement extends UmbLitElement implements UmbPropertyEditorUiElement {
   //@property()
  //value?: string;

  static properties = {
    value: { type: Object },
    config: { type: Object },
  }

  @property({ attribute: false })
  value: SourceImagePropertyEditorValue = {
    type: 'media',
  };

   /*
    * Indicates if the Property Editor is in read-only mode
    */
   @property({ type: Boolean })
   readonly?: boolean;

  #onInput(_e: UUIBooleanInputEvent) {
    //this.value.type = e.target.value;
    this.dispatchEvent(new UmbChangeEvent());
  }

  override render() {
    return html`
      <div>
        ${this.#renderOptions()}
      </div>`;
  }

  #renderOptions() {
    return html`<div class="flex mb2" style="gap: 1rem;">
      <uui-radio-group @input=${this.#onInput} value=${this.value.type}>
			  <uui-radio name="type" label="Media" value="media" required></uui-radio>
			  <uui-radio name="type" label="Static Asset" value="staticAsset" required></uui-radio>
		  </uui-radio-group>
    </div>`;
  }

}

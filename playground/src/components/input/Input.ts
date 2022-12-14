import type { StateChangeEvent } from '@queelag/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import { createRef, Ref, ref } from 'lit-html/directives/ref.js'
import { when } from 'lit-html/directives/when.js'
import { size, string } from 'superstruct'
import '../../../../src/elements/input/input.element'
import type { InputElement } from '../../../../src/elements/input/input.element'

export default class Input extends LitElement {
  ref: Ref<InputElement> = createRef()

  onStateChange(event: StateChangeEvent): void {
    this.requestUpdate()
  }

  protected render(): unknown {
    return html`
      <div class="field">
        <div class="controls">
          <q-input ${ref(this.ref)} @state-change=${this.onStateChange} placeholder="input" .schema=${size(string(), 0, 5)} touch-trigger="input"></q-input>
          <q-button @click=${() => (this.ref.value?.obscured ? this.ref.value.reveal() : this.ref.value?.obscure())}>
            <q-icon
              fill="none"
              size="12"
              src=${this.ref.value?.obscured
                ? 'https://raw.githubusercontent.com/feathericons/feather/master/icons/eye.svg'
                : 'https://raw.githubusercontent.com/feathericons/feather/master/icons/eye-off.svg'}
              stroke="black"
              stroke-width="2.5"
            ></q-icon>
          </q-button>
          <q-button @click=${() => this.ref.value?.clear()}>
            <q-icon
              fill="none"
              size="16"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg"
              stroke="black"
              stroke-width="2"
            ></q-icon>
          </q-button>
        </div>
        ${when(this.ref.value?.isErrorVisible, () => html`<span class="error">${this.ref.value?.error}</span>`)}
      </div>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    div.field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    div.controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    span.error {
      color: red;
      font-size: 12px;
    }
  `
}

defineCustomElement('my-input', Input)

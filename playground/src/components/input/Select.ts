import { offset } from '@floating-ui/dom'
import type { StateChangeEvent } from '@queelag/web'
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { when } from 'lit-html/directives/when.js'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/input/select.element'

export default class Select extends LitElement {
  filter: string = ''
  value?: string

  onStateChange(event: StateChangeEvent<string>): void {
    if (event.detail?.name === 'value') {
      this.filter = event.detail.value ?? ''
      this.value = event.detail.value ?? undefined
    }
  }

  onInput(event: InputEvent): void {
    let value: string | undefined

    // @ts-ignore
    value = event.target?.value
    if (typeof value === 'undefined') return

    this.filter = value
  }

  /**
   * <span>${this.value ?? 'Select (a fruit)'}</span>
   */
  protected render(): unknown {
    return html`
      <q-select @state-change=${this.onStateChange} autocomplete="list">
        <q-select-group>
          <q-select-input>
            <input @input=${this.onInput} placeholder="Select (a fruit)" type="text" />
          </q-select-input>
          <!-- <q-select-button>
            
            <q-icon
              class="up"
              fill="none"
              size="16"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              stroke="black"
              stroke-width="2"
            ></q-icon>
            <q-icon
              class="down"
              fill="none"
              size="16"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              stroke="black"
              stroke-width="2"
            ></q-icon>
          </q-select-button> -->
        </q-select-group>
        <q-select-list .middlewares=${[offset(4)]}>
          ${when(
            'apple'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <q-select-option value="Apple">
                <span className="text-xs">Apple</span>
                <q-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-select-option>
            `
          )}
          ${when(
            'banana'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <q-select-option value="Banana">
                <span className="text-xs">Banana</span>
                <q-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-select-option>
            `
          )}
          ${when(
            'cherry'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <q-select-option value="Cherry">
                <span className="text-xs">Cherry</span>
                <q-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-select-option>
            `
          )}
        </q-select-list>
      </q-select>
    `
  }

  static properties: PropertyDeclarations = {
    filter: { type: String, state: true },
    value: { type: String, state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    q-select {
      width: 256px;
    }

    q-select-group {
      width: 100%;
      height: 32px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-select-input {
      width: 100%;
      height: 100%;
    }

    q-select-input input {
      width: 100%;

      padding: 8px;

      border: 0;
      border-radius: 4px;

      font-size: 12px;
    }

    q-select-button {
      width: 100%;
      height: 100%;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
    }

    q-select-button span {
      font-size: 12px;
      font-weight: 500;
    }

    q-select[expanded] q-icon.down {
      display: none;
    }

    q-select:not([expanded]) q-icon.up {
      display: none;
    }

    q-select-list {
      max-height: 256px;
      z-index: 10;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;

      background: white;
    }

    q-select-list > * + * {
      border-top: 1px solid gray;
    }

    q-select:not([expanded]) q-select-list {
      opacity: 0;
      pointer-events: none;
    }

    q-select-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
    }

    q-select-option[focused] {
      background: lightgray;
    }

    q-select-option span {
      font-size: 12px;
      font-weight: 500;
    }

    q-select-option:not([selected]) q-icon {
      display: none;
    }
  `
}

customElements.define('my-select', Select)

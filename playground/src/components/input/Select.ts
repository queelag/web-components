import type { StateChangeEvent } from '@aracna/web'
import { offset } from '@floating-ui/dom'
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
      <aracna-select @state-change=${this.onStateChange} autocomplete="list">
        <aracna-select-group>
          <aracna-select-input>
            <input @input=${this.onInput} placeholder="Select (a fruit)" type="text" />
          </aracna-select-input>
          <!-- <aracna-select-button>
            
            <aracna-icon
              class="up"
              fill="none"
              size="16"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
            <aracna-icon
              class="down"
              fill="none"
              size="16"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
          </aracna-select-button> -->
        </aracna-select-group>
        <aracna-select-list .middlewares=${[offset(4)]}>
          ${when(
            'apple'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <aracna-select-option value="Apple">
                <span className="text-xs">Apple</span>
                <aracna-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-select-option>
            `
          )}
          ${when(
            'banana'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <aracna-select-option value="Banana">
                <span className="text-xs">Banana</span>
                <aracna-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-select-option>
            `
          )}
          ${when(
            'cherry'.includes(this.filter.toLowerCase().trim()),
            () => html`
              <aracna-select-option value="Cherry">
                <span className="text-xs">Cherry</span>
                <aracna-icon
                  fill="none"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-select-option>
            `
          )}
        </aracna-select-list>
      </aracna-select>
    `
  }

  static properties: PropertyDeclarations = {
    filter: { type: String, state: true },
    value: { type: String, state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-select {
      width: 256px;
    }

    aracna-select-group {
      width: 100%;
      height: 32px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-select-input {
      width: 100%;
      height: 100%;
    }

    aracna-select-input input {
      width: 100%;

      padding: 8px;

      border: 0;
      border-radius: 4px;

      font-size: 12px;
    }

    aracna-select-button {
      width: 100%;
      height: 100%;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
    }

    aracna-select-button span {
      font-size: 12px;
      font-weight: 500;
    }

    aracna-select[expanded] aracna-icon.down {
      display: none;
    }

    aracna-select:not([expanded]) aracna-icon.up {
      display: none;
    }

    aracna-select-list {
      max-height: 256px;
      z-index: 10;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;

      background: white;
    }

    aracna-select-list > * + * {
      border-top: 1px solid gray;
    }

    aracna-select:not([expanded]) aracna-select-list {
      opacity: 0;
      pointer-events: none;
    }

    aracna-select-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
    }

    aracna-select-option[focused] {
      background: lightgray;
    }

    aracna-select-option span {
      font-size: 12px;
      font-weight: 500;
    }

    aracna-select-option:not([selected]) aracna-icon {
      display: none;
    }
  `
}

defineCustomElement('my-select', Select)

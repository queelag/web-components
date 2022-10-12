import { ButtonPressed, ButtonType, ButtonVariant, ClickAsyncEvent, ElementName, KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, html, PropertyDeclarations } from 'lit'
import { ifdef } from '../directives/if.defined'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-button': ButtonElement
  }
}

export class ButtonElement extends BaseElement {
  /**
   * PROPERTIES
   */
  async?: boolean
  disabled?: boolean
  icon?: string
  label?: string
  native?: boolean
  normalized?: boolean
  pressed?: ButtonPressed
  spinning?: boolean
  type?: ButtonType
  variant?: ButtonVariant

  onClick = (): void => {
    if (this.async) {
      this.onClickAsync()
    }
  }

  onClickAsync(): void {
    if (this.disabled || this.spinning) {
      WebElementLogger.warn(this.uid, 'onClickAsync', `The element is disabled or spinning.`)
      return
    }

    this.disabled = true
    this.spinning = true
    WebElementLogger.verbose(this.uid, 'onClickAsync', `The disabled and spinning properties have been set to true.`)

    this.dispatchEvent(new ClickAsyncEvent(this.finalize))
    WebElementLogger.verbose(this.uid, 'onClickAsync', `The "clickasync" event has been dispatched.`)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KeyboardEventKey.ENTER && event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.spinning) {
      return
    }

    if (this.async) {
      this.onClickAsync()
      return
    }

    this.click()
    WebElementLogger.verbose(this.uid, 'onKeyDown', `The element has been clicked.`)
  }

  finalize = (): void => {
    this.spinning = false
    this.disabled = false

    WebElementLogger.verbose(this.uid, 'finalize', `The disabled and spinning properties have been set to false.`)
  }

  render() {
    if (this.native) {
      return html`
        <button
          aria-label=${ifdef(this.label)}
          aria-pressed=${ifdef(this.pressed)}
          ?disabled=${this.disabled}
          style=${this.styleMap}
          tabindex="-1"
          type=${ifdef(this.type)}
        >
          <slot>${this.label}</slot>
        </button>
        ${this.shapeHTML}
      `
    }

    return html`
      <div style=${this.styleMap}>
        <slot>${this.label}</slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get name(): ElementName {
    return ElementName.BUTTON
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    icon: { type: String, reflect: true },
    label: { type: String, reflect: true },
    native: { type: Boolean, reflect: true },
    normalized: { type: Boolean, reflect: true },
    spinning: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }

      :host([normalized]) button {
        appearance: none;
        background: none;
        display: inline-flex;
        border: none;
        height: 100%;
        padding: 0;
        width: 100%;
      }

      div {
        display: inline-flex;
        height: 100%;
        width: 100%;
      }
    `
  ]
}

customElements.define('q-button', ButtonElement)

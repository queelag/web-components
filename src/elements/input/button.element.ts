import { ButtonClickEvent, ButtonElementEventMap, ButtonType, ButtonVariant, defineCustomElement, ElementName, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup, html, PropertyDeclarations } from 'lit'
import { ifdef } from '../../directives/if.defined.js'
import { AriaButtonElement } from '../aria/aria.button.element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-button': ButtonElement
  }
}

export class ButtonElement<E extends ButtonElementEventMap = ButtonElementEventMap> extends AriaButtonElement<E> {
  /**
   * PROPERTIES
   */
  async?: boolean
  icon?: string
  label?: string
  normalized?: boolean
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
      WebElementLogger.warn(this.uid, 'onClickAsync', `The button is disabled or spinning.`)
      return
    }

    this.disabled = true
    this.spinning = true
    WebElementLogger.verbose(this.uid, 'onClickAsync', `The disabled and spinning properties have been set to true.`)

    this.dispatchEvent(new ButtonClickEvent(this.finalize))
    WebElementLogger.verbose(this.uid, 'onClickAsync', `The "clickasync" event has been dispatched.`)
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

defineCustomElement('aracna-button', ButtonElement)

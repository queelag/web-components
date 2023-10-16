import { ButtonClickEvent, ButtonElementEventMap, ButtonType, ButtonVariant, defineCustomElement, ElementName, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup, html, PropertyDeclarations } from 'lit'
import { ifdef } from '../../directives/if-defined.js'
import { AriaButtonElement } from '../aria/aria-button-element.js'

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
  normalized?: boolean
  spinning?: boolean
  text?: string
  type?: ButtonType
  variant?: ButtonVariant

  click(): void {
    if (this.spinning) {
      return
    }

    super.click()
  }

  onClick = (): void => {
    if (this.disabled || this.spinning) {
      WebElementLogger.warn(this.uid, 'onClick', `The button is disabled or spinning.`)
      return
    }

    if (this.async) {
      this.disabled = true
      this.spinning = true
      WebElementLogger.verbose(this.uid, 'onClick', `The disabled and spinning properties have been set to true.`)
    }

    this.dispatchEvent(new ButtonClickEvent(this.finalize))
    WebElementLogger.verbose(this.uid, 'onClick', `The "button-click" event has been dispatched.`)
  }

  finalize = (): void => {
    if (!this.async) {
      return
    }

    this.spinning = false
    this.disabled = false

    WebElementLogger.verbose(this.uid, 'finalize', `The disabled and spinning properties have been set to false.`)
  }

  render() {
    if (this.native) {
      return html`
        <button
          aria-label=${ifdef(this.text)}
          aria-pressed=${ifdef(this.pressed)}
          ?disabled=${this.disabled}
          style=${this.styleMap}
          tabindex="-1"
          type=${ifdef(this.type)}
        >
          <slot>${this.text}</slot>
        </button>
        ${this.shapeHTML}
      `
    }

    return html`
      <div style=${this.styleMap}>
        <slot>${this.text}</slot>
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

      :host([native]) button {
        all: inherit;
      }

      :host([normalized]) button {
        appearance: none;
        background: none;
        border: none;
        height: 100%;
        padding: none;
        width: 100%;
      }

      :host(:not([native])) div {
        align-items: center;
        display: inline-flex;
        height: 100%;
        justify-content: center;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-button', ButtonElement)

import { defineCustomElement } from '@aracna/web'
import { css, type CSSResultGroup, html, type PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { ButtonElementEventMap } from '../../definitions/events.js'
import type { ButtonType, ButtonVariant } from '../../definitions/types.js'
import { ifdef } from '../../directives/if-defined.js'
import { ButtonClickEvent } from '../../events/button-click-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaButtonElement as AriaButtonElement } from '../aria/aria-button-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-button': ButtonElement
  }
}

class ButtonElement<E extends ButtonElementEventMap = ButtonElementEventMap> extends AriaButtonElement<E> {
  /**
   * Properties
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
      ElementLogger.warn(this.uid, 'onClick', `The button is disabled or spinning.`)
      return
    }

    if (this.async) {
      this.disabled = true
      this.spinning = true
      ElementLogger.verbose(this.uid, 'onClick', `The disabled and spinning properties have been set to true.`)
    }

    this.dispatchEvent(new ButtonClickEvent(this.finalize))
    ElementLogger.verbose(this.uid, 'onClick', `The "button-click" event has been dispatched.`)
  }

  finalize = (): void => {
    if (!this.async) {
      return
    }

    this.spinning = false
    this.disabled = false

    ElementLogger.verbose(this.uid, 'finalize', `The disabled and spinning properties have been set to false.`)
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
      `
    }

    return super.render()
  }

  get name(): ElementName {
    return ElementName.BUTTON
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    icon: { type: String, reflect: true },
    normalized: { type: Boolean, reflect: true },
    spinning: { type: Boolean, reflect: true },
    text: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }

      :host(:not([native])) {
        align-items: center;
        justify-content: center;
      }

      :host([native]) button {
        all: inherit;
      }

      :host([native][normalized]) button {
        appearance: none;
        background: none;
        border: none;
        height: 100%;
        padding: none;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-button', ButtonElement)

export { ButtonElement as AracnaButtonElement }

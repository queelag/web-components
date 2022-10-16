import { ButtonPressed, ElementName, KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaButtonController } from '../../controllers/aria.button.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-button': AriaButtonElement
  }
}

export class AriaButtonElement extends BaseElement {
  protected aria: AriaButtonController = new AriaButtonController(this)

  /**
   * PROPERTIES
   */
  disabled?: boolean
  native?: boolean
  pressed?: ButtonPressed

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  click(): void {
    if (this.disabled) {
      return
    }

    super.click()
  }

  onClick(): void {}

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KeyboardEventKey.ENTER && event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled) {
      return WebElementLogger.warn(this.uid, 'onKeyDown', `The button is disabled.`)
    }

    this.click()
    WebElementLogger.verbose(this.uid, 'onKeyDown', `The button has been clicked.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_BUTTON
  }

  static properties: PropertyDeclarations = {
    disabled: { type: Boolean, reflect: true },
    native: { type: Boolean, reflect: true },
    pressed: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

customElements.define('q-aria-button', AriaButtonElement)

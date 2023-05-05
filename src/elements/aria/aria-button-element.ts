import { AriaButtonElementEventMap, ButtonPressed, defineCustomElement, ElementName, KeyboardEventKey, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaButtonController } from '../../controllers/aria-button-controller.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-button': AriaButtonElement
  }
}

export class AriaButtonElement<E extends AriaButtonElementEventMap = AriaButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaButtonController = new AriaButtonController(this)

  /**
   * PROPERTIES
   */
  disabled?: boolean
  native?: boolean
  pressed?: ButtonPressed

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

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

defineCustomElement('aracna-aria-button', AriaButtonElement)

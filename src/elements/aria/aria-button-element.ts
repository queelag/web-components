import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaButtonController } from '../../controllers/aria-button-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaButtonElementEventMap } from '../../definitions/events.js'
import type { ButtonPressed } from '../../definitions/types.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-button': AriaButtonElement
  }
}

class AriaButtonElement<E extends AriaButtonElementEventMap = AriaButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaButtonController = new AriaButtonController(this)

  /**
   * Properties
   */
  /** */
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
      return ElementLogger.warn(this.uid, 'click', `The button is disabled.`)
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
      return ElementLogger.warn(this.uid, 'onKeyDown', `The button is disabled.`)
    }

    super.click()
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

export { AriaButtonElement as AracnaAriaButtonElement }

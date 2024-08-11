import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaLinkController } from '../../controllers/aria-link-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaLinkElementEventMap } from '../../definitions/events.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-link': AriaLinkElement
  }
}

class AriaLinkElement<E extends AriaLinkElementEventMap = AriaLinkElementEventMap> extends BaseElement<E> {
  protected aria: AriaLinkController = new AriaLinkController(this)

  /**
   * PROPERTIES
   */
  href?: string
  target?: string

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

  onClick = (): void => {
    if (!this.href) {
      return
    }

    ElementLogger.verbose(this.uid, 'onClick', `Opening the link.`, [this.href, this.target])
    window.open(this.href, this.target)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KeyboardEventKey.ENTER) {
      return
    }

    ElementLogger.verbose(this.uid, 'onKeyDown', 'SPACE', `Clicking the link.`)
    this.click()
  }

  get name(): ElementName {
    return ElementName.ARIA_LINK
  }

  static properties: PropertyDeclarations = {
    href: { type: String, reflect: true },
    target: { type: String, reflect: true }
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

defineCustomElement('aracna-aria-link', AriaLinkElement)

export { AriaLinkElement as AracnaAriaLinkElement }

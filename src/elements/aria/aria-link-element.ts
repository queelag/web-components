import { AriaLinkElementEventMap, defineCustomElement, ElementName, KeyboardEventKey } from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaLinkController } from '../../controllers/aria-link-controller.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-link': AriaLinkElement
  }
}

export class AriaLinkElement<E extends AriaLinkElementEventMap = AriaLinkElementEventMap> extends BaseElement<E> {
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

    window.open(this.href, this.target)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KeyboardEventKey.ENTER) {
      return
    }

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
      * {
        cursor: pointer;
      }
    `
  ]
}

defineCustomElement('aracna-aria-link', AriaLinkElement)

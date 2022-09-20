import { ElementName } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-list': ListElement
    'q-list-item': ListItemElement
  }
}

export class ListElement extends BaseElement {
  /**
   * PROPERTIES
   */
  items?: any[]

  get name(): ElementName {
    return ElementName.LIST
  }

  get isItemsEmpty(): boolean {
    return !this.items?.length
  }

  get isItemsNotEmpty(): boolean {
    return !this.isItemsEmpty
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

export class ListItemElement extends BaseElement {
  /**
   * PROPERTIES
   */
  headline?: string
  icon?: string
  image?: string
  text?: string

  get name(): ElementName {
    return ElementName.LIST_ITEM
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    image: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

customElements.define('q-list', ListElement)
customElements.define('q-list-item', ListItemElement)

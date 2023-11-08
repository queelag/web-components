import { defineCustomElement, ElementName, ListElementEventMap, ListItemElementEventMap } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaListElement, AriaListItemElement } from '../aria/aria-list-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-list': ListElement
    'aracna-list-item': ListItemElement
  }
}

export class ListElement<E extends ListElementEventMap = ListElementEventMap, T = any> extends AriaListElement<E> {
  /**
   * PROPERTIES
   */
  items?: T[]

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

export class ListItemElement<E extends ListItemElementEventMap = ListItemElementEventMap> extends AriaListItemElement<E> {
  /**
   * PROPERTIES
   */
  headline?: string
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

  get name(): ElementName {
    return ElementName.LIST_ITEM
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    text: { type: String, reflect: true },
    trialingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trialingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trialingText: { type: String, attribute: 'trailing-text', reflect: true }
  }
}

defineCustomElement('aracna-list', ListElement)
defineCustomElement('aracna-list-item', ListItemElement)

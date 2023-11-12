import { defineCustomElement, ElementName, NavigationBarElementEventMap, NavigationBarItemElementEventMap } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-navigation-bar': NavigationBarElement
    'aracna-navigation-bar-item': NavigationBarItemElement
  }
}

export class NavigationBarElement<E extends NavigationBarElementEventMap = NavigationBarElementEventMap, T = any> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  items?: T[]

  get name(): ElementName {
    return ElementName.NAVIGATION_BAR
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

export class NavigationBarItemElement<E extends NavigationBarItemElementEventMap = NavigationBarItemElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  active?: boolean
  badge?: boolean
  badgeText?: string
  icon?: string
  text?: string

  get name(): ElementName {
    return ElementName.NAVIGATION_BAR_ITEM
  }

  static properties: PropertyDeclarations = {
    active: { type: Boolean, reflect: true },
    badge: { type: Boolean, reflect: true },
    badgeText: { type: String, attribute: 'badge-text', reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-navigation-bar', NavigationBarElement)
defineCustomElement('aracna-navigation-bar-item', NavigationBarItemElement)

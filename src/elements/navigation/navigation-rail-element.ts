import { defineCustomElement, ElementName, NavigationRailElementEventMap, NavigationRailItemElementEventMap } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-navigation-rail': NavigationRailElement
    'aracna-navigation-rail-item': NavigationRailItemElement
  }
}

export class NavigationRailElement<E extends NavigationRailElementEventMap = NavigationRailElementEventMap, T = any> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  items?: T[]

  get name(): ElementName {
    return ElementName.NAVIGATION_RAIL
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

export class NavigationRailItemElement<E extends NavigationRailItemElementEventMap = NavigationRailItemElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  active?: boolean
  badge?: boolean
  badgeText?: string
  icon?: string
  text?: string

  get name(): ElementName {
    return ElementName.NAVIGATION_RAIL_ITEM
  }

  static properties: PropertyDeclarations = {
    active: { type: Boolean, reflect: true },
    badge: { type: Boolean, reflect: true },
    badgeText: { type: String, attribute: 'badge-text', reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-navigation-rail', NavigationRailElement)
defineCustomElement('aracna-navigation-rail-item', NavigationRailItemElement)

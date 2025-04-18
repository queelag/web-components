import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { NavigationRailElementEventMap, NavigationRailItemElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-navigation-rail': NavigationRailElement
    'aracna-navigation-rail-item': NavigationRailItemElement
  }
}

class NavigationRailElement<E extends NavigationRailElementEventMap = NavigationRailElementEventMap, T = any> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  items?: T[]

  get slug(): ElementSlug {
    return ElementSlug.NAVIGATION_RAIL
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

class NavigationRailItemElement<E extends NavigationRailItemElementEventMap = NavigationRailItemElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  active?: boolean
  badge?: boolean
  badgeText?: string
  icon?: string
  text?: string

  get slug(): ElementSlug {
    return ElementSlug.NAVIGATION_RAIL_ITEM
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

export { NavigationRailElement as AracnaNavigationRailElement, NavigationRailItemElement as AracnaNavigationRailItemElement }

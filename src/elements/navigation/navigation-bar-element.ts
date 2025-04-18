import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { NavigationBarElementEventMap, NavigationBarItemElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-navigation-bar': NavigationBarElement
    'aracna-navigation-bar-item': NavigationBarItemElement
  }
}

class NavigationBarElement<E extends NavigationBarElementEventMap = NavigationBarElementEventMap, T = any> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  items?: T[]

  get slug(): ElementSlug {
    return ElementSlug.NAVIGATION_BAR
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

class NavigationBarItemElement<E extends NavigationBarItemElementEventMap = NavigationBarItemElementEventMap> extends BaseElement<E> {
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
    return ElementSlug.NAVIGATION_BAR_ITEM
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

export { NavigationBarElement as AracnaNavigationBarElement, NavigationBarItemElement as AracnaNavigationBarItemElement }

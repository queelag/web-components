import {
  defineCustomElement,
  ElementName,
  NavigationBarElementEventMap,
  NavigationBarItemElementAttributes,
  NavigationBarItemElementEventMap,
  WebElementLogger
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-navigation-bar': NavigationBarElement
    'aracna-navigation-bar-item': NavigationBarItemElement
  }
}

export class NavigationBarElement<E extends NavigationBarElementEventMap = NavigationBarElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  activeItem?: string
  items?: NavigationBarItemElementAttributes[]

  activateItem(item: string): void {
    this.activeItem = item
    WebElementLogger.verbose(this.uid, 'activateItem', `The active item has been set.`, [this.activeItem])
  }

  isItemActive(item: string): boolean {
    return item === this.activeItem
  }

  get name(): ElementName {
    return ElementName.NAVIGATION_BAR
  }

  static properties: PropertyDeclarations = {
    activeItem: { type: String, attribute: 'active-item', reflect: true },
    items: { type: Array }
  }
}

export class NavigationBarItemElement<E extends NavigationBarItemElementEventMap = NavigationBarItemElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  active?: boolean
  label?: string
  icon?: string

  get name(): ElementName {
    return ElementName.NAVIGATION_BAR_ITEM
  }

  static properties: PropertyDeclarations = {
    active: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    icon: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-navigation-bar', NavigationBarElement)
defineCustomElement('aracna-navigation-bar-item', NavigationBarItemElement)

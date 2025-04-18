import { parseNumber } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { MenuButtonElementEventMap, MenuElementEventMap, MenuItemElementEventMap, MenuSubMenuElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaMenuButtonElement as AriaMenuButtonElement,
  AracnaAriaMenuElement as AriaMenuElement,
  AracnaAriaMenuItemElement as AriaMenuItemElement,
  AracnaAriaMenuSubMenuElement as AriaMenuSubMenuElement
} from '../aria/aria-menu-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-menu': MenuElement
    'aracna-menu-button': MenuButtonElement
    'aracna-menu-item': MenuItemElement
    'aracna-menu-submenu': MenuSubMenuElement
  }
}

class MenuElement<E extends MenuElementEventMap = MenuElementEventMap, T = any> extends AriaMenuElement<E> {
  /**
   * Properties
   */
  /** */
  items?: T[]

  get slug(): ElementSlug {
    return ElementSlug.MENU
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-menu-button' },
    expandedSubMenuElement: { selector: 'aracna-menu-submenu[expanded]' },
    expandedSubMenuElements: {
      selector: 'aracna-menu-submenu[expanded]',
      all: true
    },
    focusedItemElement: { selector: 'aracna-menu-item[focused]' },
    itemElements: { selector: 'aracna-menu-item', all: true },
    shallowFocusedItemElement: {
      selector: 'aracna-menu-item[depth="0"][focused]'
    },
    shallowItemElements: { selector: 'aracna-menu-item[depth="0"]', all: true },
    subMenuElement: { selector: 'aracna-menu-submenu' }
  }
}

class MenuButtonElement<E extends MenuButtonElementEventMap = MenuButtonElementEventMap> extends AriaMenuButtonElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-menu', closest: true }
  }
}

class MenuItemElement<E extends MenuItemElementEventMap = MenuItemElementEventMap, T = any> extends AriaMenuItemElement<E> {
  /**
   * Properties
   */
  /** */
  items?: T[]
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

  get deep(): boolean {
    let closest: MenuItemElement | null | undefined

    closest = this.parentElement?.closest('aracna-menu-item')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: MenuItemElement | null | undefined

    n = this.rootElement?.buttonElement ? 1 : 0
    closest = this.parentElement?.closest('aracna-menu-item')

    while (typeof closest === 'object' && closest !== null && closest !== this) {
      n++
      closest = closest.parentElement?.closest('aracna-menu-item')
    }

    return n
  }

  get slug(): ElementSlug {
    return ElementSlug.MENU_ITEM
  }

  get sameDepthItemElements(): NodeListOf<MenuItemElement> {
    return this.rootElement?.querySelectorAll(`aracna-menu-item[depth="${this.depth}"][focused]`) ?? (new NodeList() as any)
  }

  get sameDepthFocusedItemElement(): MenuItemElement | null {
    return this.rootElement?.querySelector(`aracna-menu-item[depth="${this.depth}"][focused]`) ?? null
  }

  get sameDepthFocusedItemElements(): NodeListOf<MenuItemElement> {
    return this.rootElement?.querySelectorAll(`aracna-menu-item[depth="${this.depth}"][focused]`) ?? (new NodeList() as any)
  }

  get sameDepthExpandedSubMenuElement(): MenuSubMenuElement | null {
    return this.rootElement?.querySelector(`aracna-menu-submenu[depth="${this.depth}"][expanded]`) ?? null
  }

  static properties: PropertyDeclarations = {
    items: { type: Array },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    text: { type: String, reflect: true },
    trailingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trailingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trailingText: { type: String, attribute: 'trailing-text', reflect: true }
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: ':scope > a' },
    rootElement: { selector: 'aracna-menu', closest: true },
    subMenuElement: { selector: 'aracna-menu-submenu' }
  }
}

class MenuSubMenuElement<E extends MenuSubMenuElementEventMap = MenuSubMenuElementEventMap> extends AriaMenuSubMenuElement<E> {
  get deep(): boolean {
    let closest: MenuSubMenuElement | null | undefined

    closest = this.parentElement?.closest('aracna-menu-submenu')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: MenuSubMenuElement | null | undefined

    n = 0
    closest = this.parentElement?.closest('aracna-menu-submenu')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('aracna-menu-submenu')
    }

    return n
  }

  get slug(): ElementSlug {
    return ElementSlug.MENU_SUBMENU
  }

  get shallowFocusedItemElement(): MenuItemElement | null {
    return this.querySelector(`aracna-menu-item[depth="${parseNumber(this.depth) + 1}"][focused]`)
  }

  get shallowItemElements(): NodeListOf<MenuItemElement> {
    return this.querySelectorAll(`aracna-menu-item[depth="${parseNumber(this.depth) + 1}"]`)
  }

  static queries: QueryDeclarations = {
    itemElements: { selector: 'aracna-menu-item', all: true },
    parentItemElement: { selector: 'aracna-menu-item', closest: true },
    parentSubMenuElement: { selector: 'aracna-menu-submenu', closest: true },
    rootElement: { selector: 'aracna-menu', closest: true }
  }
}

defineCustomElement('aracna-menu', MenuElement)
defineCustomElement('aracna-menu-button', MenuButtonElement)
defineCustomElement('aracna-menu-item', MenuItemElement)
defineCustomElement('aracna-menu-submenu', MenuSubMenuElement)

export {
  MenuButtonElement as AracnaMenuButtonElement,
  MenuElement as AracnaMenuElement,
  MenuItemElement as AracnaMenuItemElement,
  MenuSubMenuElement as AracnaMenuSubMenuElement
}

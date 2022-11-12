import { parseNumber } from '@queelag/core'
import {
  defineCustomElement,
  ElementName,
  MenuButtonElementEventMap,
  MenuElementEventMap,
  MenuItemElementEventMap,
  MenuSubMenuElementEventMap,
  QueryDeclarations
} from '@queelag/web'
import { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../aria/aria.menu.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-menu': MenuElement
    'q-menu-button': MenuButtonElement
    'q-menu-item': MenuItemElement
    'q-menu-submenu': MenuSubMenuElement
  }
}

export class MenuElement<E extends MenuElementEventMap = MenuElementEventMap> extends AriaMenuElement<E> {
  get name(): ElementName {
    return ElementName.MENU
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-menu-button' },
    expandedSubMenuElement: { selector: 'q-menu-submenu[expanded]' },
    expandedSubMenuElements: { selector: 'q-menu-submenu[expanded]', all: true },
    focusedItemElement: { selector: 'q-menu-item[focused]' },
    itemElements: { selector: 'q-menu-item', all: true },
    shallowFocusedItemElement: { selector: 'q-menu-item[depth="0"][focused]' },
    shallowItemElements: { selector: 'q-menu-item[depth="0"]', all: true },
    subMenuElement: { selector: 'q-menu-submenu' }
  }
}

export class MenuButtonElement<E extends MenuButtonElementEventMap = MenuButtonElementEventMap> extends AriaMenuButtonElement<E> {
  get name(): ElementName {
    return ElementName.MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-menu', closest: true }
  }
}

export class MenuItemElement<E extends MenuItemElementEventMap = MenuItemElementEventMap> extends AriaMenuItemElement<E> {
  get deep(): boolean {
    let closest: MenuItemElement | null | undefined

    closest = this.parentElement?.closest('q-menu-item')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: MenuItemElement | null | undefined

    n = this.rootElement.buttonElement ? 1 : 0
    closest = this.parentElement?.closest('q-menu-item')

    while (typeof closest === 'object' && closest !== null && closest !== this) {
      n++
      closest = closest.parentElement?.closest('q-menu-item')
    }

    return n
  }

  get name(): ElementName {
    return ElementName.MENU_ITEM
  }

  get sameDepthItemElements(): NodeListOf<MenuItemElement> {
    return this.rootElement.querySelectorAll(`q-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElement(): MenuItemElement | null {
    return this.rootElement.querySelector(`q-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElements(): NodeListOf<MenuItemElement> {
    return this.rootElement.querySelectorAll(`q-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthExpandedSubMenuElement(): MenuSubMenuElement | null {
    return this.rootElement.querySelector(`q-menu-submenu[depth="${this.depth}"][expanded]`)
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: ':scope > a' },
    rootElement: { selector: 'q-menu', closest: true },
    subMenuElement: { selector: 'q-menu-submenu' }
  }
}

export class MenuSubMenuElement<E extends MenuSubMenuElementEventMap = MenuSubMenuElementEventMap> extends AriaMenuSubMenuElement<E> {
  get deep(): boolean {
    let closest: MenuSubMenuElement | null | undefined

    closest = this.parentElement?.closest('q-menu-submenu')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: MenuSubMenuElement | null | undefined

    n = 0
    closest = this.parentElement?.closest('q-menu-submenu')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('q-menu-submenu')
    }

    return n
  }

  get name(): ElementName {
    return ElementName.MENU_SUBMENU
  }

  get shallowFocusedItemElement(): MenuItemElement | null {
    return this.querySelector(`q-menu-item[depth="${parseNumber(this.depth) + 1}"][focused]`)
  }

  get shallowItemElements(): NodeListOf<MenuItemElement> {
    return this.querySelectorAll(`q-menu-item[depth="${parseNumber(this.depth) + 1}"]`)
  }

  static queries: QueryDeclarations = {
    itemElements: { selector: 'q-menu-item', all: true },
    parentItemElement: { selector: 'q-menu-item', closest: true },
    parentSubMenuElement: { selector: 'q-menu-submenu', closest: true },
    rootElement: { selector: 'q-menu', closest: true }
  }
}

defineCustomElement('q-menu', MenuElement)
defineCustomElement('q-menu-button', MenuButtonElement)
defineCustomElement('q-menu-item', MenuItemElement)
defineCustomElement('q-menu-submenu', MenuSubMenuElement)

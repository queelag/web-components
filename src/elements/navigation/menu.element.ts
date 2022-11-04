import { parseNumber } from '@queelag/core'
import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../aria/aria.menu.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-menu': MenuElement
    'q-menu-button': MenuButtonElement
    'q-menu-item': MenuItemElement
    'q-menu-submenu': MenuSubMenuElement
  }
}

export class MenuElement extends AriaMenuElement {
  get name(): ElementName {
    return ElementName.MENU
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-menu-button' },
    expandedSubMenuElement: { selector: 'q-menu-submenu[expanded]' },
    expandedSubMenuElements: { selector: 'q-menu-submenu[expanded]', all: true },
    focusedItemElement: { selector: 'q-menu-item:focus' },
    itemElements: { selector: 'q-menu-item', all: true },
    shallowFocusedItemElement: { selector: 'q-menu-item[depth="0"]:focus' },
    shallowItemElements: { selector: 'q-menu-item[depth="0"]', all: true },
    subMenuElement: { selector: 'q-menu-submenu' }
  }
}

export class MenuButtonElement extends AriaMenuButtonElement {
  get name(): ElementName {
    return ElementName.MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-menu', closest: true }
  }
}

export class MenuItemElement extends AriaMenuItemElement {
  get deep(): boolean {
    let closest: AriaMenuItemElement | null | undefined

    closest = this.parentElement?.closest('q-menu-item')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: AriaMenuItemElement | null | undefined

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

  get sameDepthItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement.querySelectorAll(`q-menu-item[depth="${this.depth}"]:focus`)
  }

  get sameDepthFocusedItemElement(): AriaMenuItemElement | null {
    return this.rootElement.querySelector(`q-menu-item[depth="${this.depth}"]:focus`)
  }

  get sameDepthFocusedItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement.querySelectorAll(`q-menu-item[depth="${this.depth}"]:focus`)
  }

  get sameDepthExpandedSubMenuElement(): AriaMenuSubMenuElement | null {
    return this.rootElement.querySelector(`q-menu-submenu[depth="${this.depth}"][expanded]`)
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: 'a' },
    rootElement: { selector: 'q-menu', closest: true },
    subMenuElement: { selector: 'q-menu-submenu' }
  }
}

export class MenuSubMenuElement extends AriaMenuSubMenuElement {
  get deep(): boolean {
    let closest: AriaMenuSubMenuElement | null | undefined

    closest = this.parentElement?.closest('q-menu-submenu')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: AriaMenuSubMenuElement | null | undefined

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

  get shallowFocusedItemElement(): AriaMenuItemElement | null {
    return this.querySelector(`q-menu-item[depth="${parseNumber(this.depth) + 1}"]:focus`)
  }

  get shallowItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.querySelectorAll(`q-menu-item[depth="${parseNumber(this.depth) + 1}"]`)
  }

  static queries: QueryDeclarations = {
    itemElements: { selector: 'q-menu-item', all: true },
    parentItemElement: { selector: 'q-menu-item', closest: true },
    parentSubMenuElement: { selector: 'q-menu-submenu', closest: true },
    rootElement: { selector: 'q-menu', closest: true }
  }
}

customElements.define('q-menu', MenuElement)
customElements.define('q-menu-button', MenuButtonElement)
customElements.define('q-menu-item', MenuItemElement)
customElements.define('q-menu-submenu', MenuSubMenuElement)

import { generateRandomString, parseNumber } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaMenuButtonElement as AriaMenuButtonElement,
  AracnaAriaMenuElement as AriaMenuElement,
  AracnaAriaMenuItemElement as AriaMenuItemElement,
  AracnaAriaMenuSubMenuElement as AriaMenuSubMenuElement
} from '../elements/aria/aria-menu-element.js'

export class AriaMenuController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    //   setImmutableElementAttribute(this.host, 'aria-label', '')
    setImmutableElementAttribute(this.host, 'role', this.host.buttonElement ? 'menu' : 'menubar')
  }
}

export class AriaMenuButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuButtonElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.rootElement.subMenuElement?.id)
    setImmutableElementAttribute(this.host, 'aria-haspopup', 'true')
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: this.host.name
        })
      )
    }
  }
}

export class AriaMenuItemController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuItemElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()

    if (this.host.index === 0) {
      setImmutableElementAttribute(this.host.anchorElement ?? this.host, 'tabindex', '0')
    }
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'depth', String(this.host.depth))

    setImmutableElementAttribute(this.host.anchorElement ?? this.host, 'aria-haspopup', this.host.subMenuElement ? 'true' : 'false')
    setImmutableElementAttribute(this.host.anchorElement ?? this.host, 'role', 'menuitem')

    if (this.host.anchorElement) {
      setImmutableElementAttribute(this.host, 'role', 'none')
      setImmutableElementAttribute(this.host.anchorElement, 'tabindex', '-1')

      if (this.host.shallow) {
        setImmutableElementAttribute(this.host.anchorElement, 'aria-current', this.host.anchorElement.href === window.location.href ? 'page' : undefined)
      }
    }

    switch (true) {
      case this.host.focused:
      case parseNumber(this.host.depth) === 0 && this.host.index === 0 && !this.host.rootElement.focusedItemElement:
        setImmutableElementAttribute(this.host, 'tabindex', '0')
        break
      default:
        setImmutableElementAttribute(this.host, 'tabindex', '-1')
        break
    }
  }
}

export class AriaMenuSubMenuController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuSubMenuElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-label', this.host.parentItemElement?.headline)
    setImmutableElementAttribute(this.host, 'depth', String(this.host.depth))
    setImmutableElementAttribute(this.host, 'role', 'menu')

    if (this.host.parentItemElement) {
      setImmutableElementAttribute(this.host.parentItemElement, 'submenu-expanded', this.host.expanded ? '' : undefined)

      setImmutableElementAttribute(
        this.host.parentItemElement.anchorElement ?? this.host.parentItemElement,
        'aria-expanded',
        this.host.expanded ? 'true' : 'false'
      )
    }

    if (this.host.rootElement.buttonElement && this.host.shallow) {
      setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.rootElement.buttonElement.id)
      setImmutableElementAttribute(this.host.rootElement.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
    }

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: this.host.name
        })
      )
    }
  }
}

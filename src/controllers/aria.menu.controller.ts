import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../elements/aria/aria.menu.element'

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
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
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
      setImmutableElementAttribute(this.host.anchorElement || this.host, 'tabindex', '0')
    }
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'depth', String(this.host.depth))

    // setImmutableElementAttribute(this.host.anchorElement || this.host, 'aria-label', '')
    setImmutableElementAttribute(this.host.anchorElement || this.host, 'aria-haspopup', 'true')
    setImmutableElementAttribute(this.host.anchorElement || this.host, 'role', 'menuitem')

    if (this.host.anchorElement) {
      setImmutableElementAttribute(this.host, 'role', 'none')

      if (this.host.shallow) {
        setImmutableElementAttribute(this.host.anchorElement, 'aria-current', this.host.anchorElement.href === window.location.href ? 'page' : undefined)
      }
    }

    setImmutableElementAttribute(this.host.anchorElement || this.host, 'tabindex', this.host.focused ? '0' : '-1')
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
    //   setImmutableElementAttribute(this.host, 'aria-label', '')
    setImmutableElementAttribute(this.host, 'depth', String(this.host.depth))
    setImmutableElementAttribute(this.host, 'role', 'menu')

    if (this.host.itemElement) {
      /**
       * Set aria-expanded to parent item.
       */
      setImmutableElementAttribute(this.host.itemElement.anchorElement || this.host.itemElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
    }

    if (this.host.rootElement.buttonElement) {
      setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.rootElement.buttonElement.id)
      setImmutableElementAttribute(this.host.rootElement.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
    }
  }
}

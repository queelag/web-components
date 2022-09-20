import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuListElement } from '../elements/aria/aria.menu.element'

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
    setImmutableElementAttribute(this.host.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
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
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.rootElement.listElement?.id)
    // setImmutableElementAttribute(this.host, 'aria-expanded', this.host.rootElement.expanded ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-haspopup', 'true')
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaMenuListController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuListElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.rootElement.buttonElement.id)
    setImmutableElementAttribute(this.host, 'role', 'menu')

    // if (!this.host.rootElement.navigation) {
    setImmutableElementAttribute(this.host, 'aria-activedescendant', this.host.focusedItemElement?.id)
    // }

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
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'menuitem')
    // setImmutableElementAttribute(this.host, 'role', this.host.rootElement.navigation ? 'none' : 'menuitem')

    // if (this.host.rootElement.navigation && this.host.anchorElement) {
    //   setImmutableElementAttribute(this.host.anchorElement, 'role', 'menuitem')
    //   setImmutableElementAttribute(this.host.anchorElement, 'tabindex', '-1')
    // }

    if (this.host.anchorElement) {
      setImmutableElementAttribute(this.host.anchorElement, 'tabindex', '-1')
    }
  }
}

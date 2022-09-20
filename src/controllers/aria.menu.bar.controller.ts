import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaMenuBarItemElement, AriaMenuBarSubMenuElement } from '../elements/aria/aria.menu.bar.element'

export class AriaMenuBarController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & HTMLElement) {
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
    setImmutableElementAttribute(this.host, 'role', 'menubar')
  }
}

export class AriaMenuBarItemController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuBarItemElement) {
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

export class AriaMenuBarSubMenuController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMenuBarSubMenuElement) {
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

    /**
     * Set aria-expanded to parent item.
     */
    setImmutableElementAttribute(this.host.itemElement.anchorElement || this.host.itemElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
  }
}

import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaBreadcrumbListItemElement } from '../elements/aria/aria.breadcrumb.element'

export class AriaBreadcrumbController implements ReactiveController {
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
    // setImmutableElementAttribute(this.host, 'aria-label', 'AriaBreadcrumb')
    setImmutableElementAttribute(this.host, 'role', 'navigation')
  }
}

export class AriaBreadcrumbListController implements ReactiveController {
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
    setImmutableElementAttribute(this.host, 'role', 'list')
  }
}

export class AriaBreadcrumbListItemController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaBreadcrumbListItemElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host.anchorElement, 'aria-current', this.host.current ? 'page' : undefined)
  }
}

import { setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaBreadcrumbItemElement } from '../elements/aria/aria-breadcrumb-element.js'

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
    setImmutableElementAttribute(this.host, 'aria-label', 'Breadcrumb')
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

export class AriaBreadcrumbItemController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaBreadcrumbItemElement) {
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

import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaTabsElement, AriaTabsPanelElement, AriaTabsTabElement } from '../elements/aria/aria.tabs.element'

export class AriaTabsController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTabsElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'role', 'tablist')
  }
}

export class AriaTabsPanelController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTabsPanelElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'tabpanel')
    setImmutableElementAttribute(this.host, 'tabindex', '0')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaTabsTabController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTabsTabElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-selected', this.host.selected ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.selected ? this.host.rootElement.panelElement.id : undefined)
    setImmutableElementAttribute(this.host, 'role', 'tab')
    setImmutableElementAttribute(this.host, 'tabindex', this.host.selected ? '0' : '-1')

    if (this.host.selected) {
      setImmutableElementAttribute(this.host.rootElement.panelElement, 'aria-labelledby', this.host.id)
    }

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

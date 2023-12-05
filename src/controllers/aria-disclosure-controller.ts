import { generateRandomString } from '@aracna/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaDisclosureButtonElement, AriaDisclosurePanelElement, AriaDisclosureSectionElement } from '../elements/aria/aria-disclosure-element.js'

export class AriaDisclosureButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaDisclosureButtonElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.sectionElement.panelElement?.id)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

export class AriaDisclosurePanelController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaDisclosurePanelElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', generateRandomString({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaDisclosureSectionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaDisclosureSectionElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : undefined)
  }
}

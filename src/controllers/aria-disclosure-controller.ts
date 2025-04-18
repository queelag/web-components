import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaDisclosureButtonElement as AriaDisclosureButtonElement,
  AracnaAriaDisclosurePanelElement as AriaDisclosurePanelElement,
  AracnaAriaDisclosureSectionElement as AriaDisclosureSectionElement
} from '../elements/aria/aria-disclosure-element.js'

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
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.sectionElement?.panelElement?.id)
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
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: this.host.slug
        })
      )
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
    if (this.host.buttonElement) {
      setImmutableElementAttribute(this.host.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : undefined)
    }
  }
}

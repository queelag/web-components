import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type {
  AriaAccordionButtonElement,
  AriaAccordionHeaderElement,
  AriaAccordionPanelElement,
  AriaAccordionSectionElement
} from '../elements/aria/aria.accordion.element'

export class AriaAccordionButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaAccordionButtonElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaAccordionHeaderController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaAccordionHeaderElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-level', String(this.host.level || 6))
    setImmutableElementAttribute(this.host, 'role', 'heading')
  }
}

export class AriaAccordionPanelController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaAccordionPanelElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'region')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaAccordionSectionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaAccordionSectionElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host.buttonElement, 'aria-controls', this.host.panelElement?.id)
    setImmutableElementAttribute(this.host.buttonElement, 'aria-disabled', !this.host.collapsable && this.host.expanded ? 'true' : 'false')

    if (this.host.panelElement) {
      setImmutableElementAttribute(this.host.panelElement, 'aria-expanded', String(this.host.expanded))
      setImmutableElementAttribute(this.host.panelElement, 'aria-labelledby', this.host.buttonElement.id)
    }
  }
}

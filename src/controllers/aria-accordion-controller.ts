import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaAccordionButtonElement as AriaAccordionButtonElement,
  AracnaAriaAccordionHeaderElement as AriaAccordionHeaderElement,
  AracnaAriaAccordionPanelElement as AriaAccordionPanelElement,
  AracnaAriaAccordionSectionElement as AriaAccordionSectionElement
} from '../elements/aria/aria-accordion-element.js'

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
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.sectionElement?.panelElement?.id)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')

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
    setImmutableElementAttribute(this.host, 'aria-level', String(this.host.level ?? 6))
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
    setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.sectionElement?.buttonElement?.id)
    setImmutableElementAttribute(this.host, 'role', 'region')

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
    if (this.host.buttonElement) {
      setImmutableElementAttribute(this.host.buttonElement, 'aria-disabled', this.host.uncollapsible && this.host.expanded ? 'true' : 'false')
    }

    if (this.host.panelElement) {
      setImmutableElementAttribute(this.host.panelElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
    }
  }
}

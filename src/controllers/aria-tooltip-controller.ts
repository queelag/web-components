import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaTooltipContentElement as AriaTooltipContentElement,
  AracnaAriaTooltipElement as AriaTooltipElement,
  AracnaAriaTooltipTriggerElement as AriaTooltipTriggerElement
} from '../elements/aria/aria-tooltip-element.js'

export class AriaTooltipController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTooltipElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'tooltip')

    if (this.host.triggerElement) {
      setImmutableElementAttribute(this.host.triggerElement, 'tabindex', this.host.focusable ? '0' : undefined)
    }
  }
}

export class AriaTooltipContentController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTooltipContentElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length > 0) {
      return
    }

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

export class AriaTooltipTriggerController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaTooltipTriggerElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-describedby', this.host.rootElement?.contentElement?.id)
  }
}

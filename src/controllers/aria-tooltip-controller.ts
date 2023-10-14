import { ID } from '@aracna/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaTooltipContentElement, AriaTooltipElement, AriaTooltipTriggerElement } from '../elements/aria/aria-tooltip-element.js'

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
      setImmutableElementAttribute(this.host.triggerElement, 'tabindex', this.host.focusable ? '0' : '-1')
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

    setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
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
    setImmutableElementAttribute(this.host, 'aria-describedby', this.host.rootElement.contentElement?.id)
  }
}

import { ID } from '@aracna/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaTooltipContentElement, AriaTooltipTriggerElement } from '../elements/aria/aria-tooltip-element.js'

export class AriaTooltipController implements ReactiveController {
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
    setImmutableElementAttribute(this.host, 'role', 'tooltip')
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

    if (this.host.rootElement.focusable) {
      setImmutableElementAttribute(this.host, 'tabindex', '0')
    }
  }
}

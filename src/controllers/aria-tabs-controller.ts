import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaTabsElement as AriaTabsElement,
  AracnaAriaTabsPanelElement as AriaTabsPanelElement,
  AracnaAriaTabsTabElement as AriaTabsTabElement
} from '../elements/aria/aria-tabs-element.js'

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
    setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.rootElement?.tabElements[this.host.index]?.id)
    setImmutableElementAttribute(this.host, 'role', 'tabpanel')
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
    setImmutableElementAttribute(this.host, 'aria-controls', this.host.rootElement?.panelElements[this.host.index]?.id)
    setImmutableElementAttribute(this.host, 'aria-selected', this.host.selected ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'tab')
    setImmutableElementAttribute(this.host, 'tabindex', this.host.selected ? '0' : '-1')

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

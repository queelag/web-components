import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaListBoxElement as AriaListBoxElement,
  AracnaAriaListBoxOptionElement as AriaListBoxOptionElement
} from '../elements/aria/aria-list-box-element.js'

export class AriaListBoxController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaListBoxElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-multiselectable', this.host.multiple ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'listbox')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

export class AriaListBoxOptionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaListBoxOptionElement) {
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
    setImmutableElementAttribute(this.host, 'role', 'option')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS,
          prefix: this.host.name
        })
      )
    }

    if (this.host.focused) {
      setImmutableElementAttribute(this.host.rootElement, 'aria-activedescendant', this.host.id)
    }
  }
}

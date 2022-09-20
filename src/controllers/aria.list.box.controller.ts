import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaListBoxElement, AriaListBoxOptionElement } from '../elements/aria/aria.list.box.element'

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
    setImmutableElementAttribute(this.host, 'aria-activedescendant', this.host.focusedOptionElement?.id)
    setImmutableElementAttribute(this.host, 'aria-multiselectable', this.host.multiple ? 'true' : undefined)
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
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

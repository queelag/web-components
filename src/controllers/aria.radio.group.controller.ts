import { ID } from '@queelag/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaRadioButtonElement, AriaRadioGroupElement } from '../elements/aria/aria.radio.group.element'

export class AriaRadioGroupController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaRadioGroupElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.native) {
      return
    }

    // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'radiogroup')
  }
}

export class AriaRadioButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaRadioButtonElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-checked', this.host.checked ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'radio')

    switch (true) {
      case this.host.checked:
      case this.host.focused:
      case this.host.index === 0 && !this.host.rootElement.checkedButtonElement:
        setImmutableElementAttribute(this.host, 'tabindex', '0')
        break
      default:
        setImmutableElementAttribute(this.host, 'tabindex', '-1')
        break
    }

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

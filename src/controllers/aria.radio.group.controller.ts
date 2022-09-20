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
    // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'aria-activedescendant', this.host.focusedButtonElement?.id)
    setImmutableElementAttribute(this.host, 'role', 'radiogroup')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
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

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

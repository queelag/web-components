import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { CheckBoxElement } from '../elements/check.box.element'

export class AriaCheckBoxController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & CheckBoxElement) {
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

    setImmutableElementAttribute(this.host, 'aria-checked', String(this.host.checked))
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'checkbox')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

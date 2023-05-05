import { setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import { AriaCheckBoxElement } from '../elements/aria/aria-check-box-element.js'

export class AriaCheckBoxController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaCheckBoxElement) {
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

    setImmutableElementAttribute(this.host, 'aria-checked', this.host.checked ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'checkbox')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

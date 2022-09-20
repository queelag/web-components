import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import { AriaButtonElement } from '../elements/aria/aria.button.element'

export class AriaButtonController implements ReactiveController {
  native?: boolean

  constructor(private host: ReactiveControllerHost & AriaButtonElement, native?: boolean) {
    this.host.addController(this)
    this.native = native
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.native) {
      setImmutableElementAttribute(this.host, 'tabindex', this.host.getAttribute('tabindex') || '0')
      return
    }

    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : undefined)
    // setImmutableElementAttribute(this.host, 'aria-label', this.host.label)
    setImmutableElementAttribute(this.host, 'aria-pressed', this.host.pressed ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', this.host.getAttribute('tabindex') || '0')
  }
}

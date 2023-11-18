import { setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import { AriaButtonElement } from '../elements/aria/aria-button-element.js'

export class AriaButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaButtonElement) {
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
      setImmutableElementAttribute(this.host, 'tabindex', this.host.getAttribute('tabindex') ?? '0')
      return
    }

    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    // setImmutableElementAttribute(this.host, 'aria-label', '')
    setImmutableElementAttribute(this.host, 'aria-pressed', this.host.pressed)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', this.host.getAttribute('tabindex') ?? '0')
  }
}

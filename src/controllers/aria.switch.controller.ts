import { setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaSwitchElement } from '../elements/aria/aria.switch.element.js'

export class AriaSwitchController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaSwitchElement) {
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

    setImmutableElementAttribute(this.host, 'aria-checked', this.host.on ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'switch')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

import { removeImmutableElementAttribute, setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AracnaAriaCheckBoxElement as AriaCheckBoxElement } from '../elements/aria/aria-check-box-element.js'

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
    if (this.host.inputElement) {
      removeImmutableElementAttribute(this.host, 'aria-checked')
      removeImmutableElementAttribute(this.host, 'aria-disabled')
      removeImmutableElementAttribute(this.host, 'aria-readonly')
      removeImmutableElementAttribute(this.host, 'role')
      removeImmutableElementAttribute(this.host, 'tabindex')

      return
    }

    setImmutableElementAttribute(this.host, 'aria-checked', this.host.checked ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'checkbox')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

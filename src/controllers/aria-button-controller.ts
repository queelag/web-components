import { removeImmutableElementAttribute, setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AracnaAriaButtonElement as AriaButtonElement } from '../elements/aria/aria-button-element.js'

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
    if (this.host.buttonElement) {
      removeImmutableElementAttribute(this.host, 'aria-disabled')
      removeImmutableElementAttribute(this.host, 'aria-label')
      removeImmutableElementAttribute(this.host, 'aria-pressed')
      removeImmutableElementAttribute(this.host, 'role')
      removeImmutableElementAttribute(this.host, 'tabindex')

      return
    }

    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-label', this.host.label)
    setImmutableElementAttribute(this.host, 'aria-pressed', this.host.pressed)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', this.host.getAttribute('tabindex') ?? '0')
  }
}

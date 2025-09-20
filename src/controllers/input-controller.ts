import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AracnaInputElement as InputElement } from '../elements/input/input-element.js'

export class InputController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & InputElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'input-disabled', this.host.inputElement?.disabled ? '' : null)
    setImmutableElementAttribute(this.host, 'input-readonly', this.host.inputElement?.readOnly ? '' : null)
    setImmutableElementAttribute(this.host, 'input-type', this.host.inputElement?.type ?? 'text')
  }
}

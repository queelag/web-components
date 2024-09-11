import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { AracnaAriaHeadingElement as AriaHeadingElement } from '../elements/aria/aria-heading-element.js'

export class AriaHeadingController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaHeadingElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-level', this.host.level.toString())
    setImmutableElementAttribute(this.host, 'role', 'heading')
  }
}

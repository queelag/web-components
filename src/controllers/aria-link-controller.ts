import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

export class AriaLinkController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & HTMLElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'role', 'link')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

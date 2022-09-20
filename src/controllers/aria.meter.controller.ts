import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { MeterElement } from '../elements/meter.element'

export class AriaMeterController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & MeterElement) {
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

    setImmutableElementAttribute(this.host, 'aria-valuemax', this.host.maximum?.toString())
    setImmutableElementAttribute(this.host, 'aria-valuemin', this.host.minimum?.toString())
    setImmutableElementAttribute(this.host, 'aria-valuenow', this.host.value.toString())
    setImmutableElementAttribute(this.host, 'role', 'meter')
  }
}

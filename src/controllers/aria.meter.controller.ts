import { setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import { AriaMeterElement } from '../elements/aria/aria.meter.element'

export class AriaMeterController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaMeterElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-valuemax', this.host.max?.toString())
    setImmutableElementAttribute(this.host, 'aria-valuemin', this.host.min?.toString())
    setImmutableElementAttribute(this.host, 'aria-valuenow', this.host.value?.toString())
    setImmutableElementAttribute(this.host, 'role', 'meter')
  }
}

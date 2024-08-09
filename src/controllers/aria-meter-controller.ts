import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { DEFAULT_METER_MAX, DEFAULT_METER_MIN } from '../definitions/constants.js'
import { AracnaAriaMeterElement as AriaMeterElement } from '../elements/aria/aria-meter-element.js'

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
    if (this.host.native) {
      return
    }

    setImmutableElementAttribute(this.host, 'aria-valuemax', String(this.host.max ?? DEFAULT_METER_MAX))
    setImmutableElementAttribute(this.host, 'aria-valuemin', String(this.host.min ?? DEFAULT_METER_MIN))
    setImmutableElementAttribute(this.host, 'aria-valuenow', String(this.host.value))
    setImmutableElementAttribute(this.host, 'role', 'meter')
  }
}

import { PropertyDeclarations } from 'lit'
import { AriaMeterController } from '../../controllers/aria.meter.controller'
import { BaseElement } from '../core/base.element'

export class AriaMeterElement extends BaseElement {
  protected aria: AriaMeterController = new AriaMeterController(this)

  /**
   * PROPERTIES
   */
  max?: number
  min?: number
  value?: number

  static properties: PropertyDeclarations = {
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    value: { type: Number, reflect: true }
  }
}

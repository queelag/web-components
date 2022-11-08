import { ElementName } from '@queelag/web'
import { AriaAlertController } from '../../controllers/aria.alert.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-alert': AriaAlertElement
  }
}

export class AriaAlertElement extends BaseElement {
  protected aria: AriaAlertController = new AriaAlertController(this)

  get name(): ElementName {
    return ElementName.ARIA_ALERT
  }
}

customElements.define('q-aria-alert', AriaAlertElement)

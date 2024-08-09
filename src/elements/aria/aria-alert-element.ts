import { defineCustomElement } from '@aracna/web'
import { AriaAlertController } from '../../controllers/aria-alert-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaAlertElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-alert': AriaAlertElement
  }
}

class AriaAlertElement<E extends AriaAlertElementEventMap = AriaAlertElementEventMap> extends BaseElement<E> {
  protected aria: AriaAlertController = new AriaAlertController(this)

  get name(): ElementName {
    return ElementName.ARIA_ALERT
  }
}

defineCustomElement('aracna-aria-alert', AriaAlertElement)

export { AriaAlertElement as AracnaAriaAlertElement }

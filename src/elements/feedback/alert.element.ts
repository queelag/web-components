import { ElementName } from '@queelag/web'
import { AriaAlertElement } from '../aria/aria.alert.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-alert': AriaAlertElement
  }
}

export class AlertElement extends AriaAlertElement {
  get name(): ElementName {
    return ElementName.ALERT
  }
}

customElements.define('q-alert', AlertElement)

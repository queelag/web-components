import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { AlertElementEventMap } from '../../definitions/events.js'
import type { AlertSeverity, AlertVariant } from '../../definitions/types.js'
import { AracnaAriaAlertElement as AriaAlertElement } from '../aria/aria-alert-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-alert': AlertElement
  }
}

class AlertElement<E extends AlertElementEventMap = AlertElementEventMap> extends AriaAlertElement<E> {
  /**
   * Properties
   */
  /** */
  closable?: boolean
  headline?: string
  icon?: string
  severity?: AlertSeverity
  text?: string
  variant?: AlertVariant

  get name(): ElementName {
    return ElementName.ALERT
  }

  static properties: PropertyDeclarations = {
    closable: { type: Boolean, reflect: true },
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    severity: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-alert', AlertElement)

export { AlertElement as AracnaAlertElement }

import { AlertElementEventMap, AlertSeverity, AlertVariant, defineCustomElement, ElementName } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaAlertElement } from '../aria/aria.alert.element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-alert': AriaAlertElement
  }
}

export class AlertElement<E extends AlertElementEventMap = AlertElementEventMap> extends AriaAlertElement<E> {
  /**
   * PROPERTIES
   */
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

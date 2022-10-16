import { AriaAlertSeverity, AriaAlertVariant, ElementName } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaAlertController } from '../../controllers/aria.alert.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-alert': AriaAlertElement
  }
}

export class AriaAlertElement extends BaseElement {
  protected aria: AriaAlertController = new AriaAlertController(this)

  /**
   * PROPERTIES
   */
  closable?: boolean
  headline?: string
  icon?: string
  severity?: AriaAlertSeverity
  text?: string
  variant?: AriaAlertVariant

  get name(): ElementName {
    return ElementName.ARIA_ALERT
  }

  static properties: PropertyDeclarations = {
    closable: { type: Boolean, reflect: true },
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    severity: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

customElements.define('q-aria-alert', AriaAlertElement)

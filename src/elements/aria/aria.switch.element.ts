import { AriaSwitchElementEventMap, defineCustomElement, KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResult, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaSwitchController } from '../../controllers/aria.switch.controller'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-switch': AriaSwitchElement
  }
}

export class AriaSwitchElement<E extends AriaSwitchElementEventMap = AriaSwitchElementEventMap> extends FormFieldElement<E> {
  protected aria: AriaSwitchController = new AriaSwitchController(this)

  /**
   * PROPERTIES
   */
  on?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onClick(): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.id, 'onClick', `The switch is disabled or readonly.`)
    }

    this.on = !this.on
    WebElementLogger.verbose(this.uid, 'onClick', `The switch has been turned ${this.value ? 'on' : 'off'}.`)
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.onClick()
  }

  static properties: PropertyDeclarations = {
    on: { type: Boolean, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles as CSSResult,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

defineCustomElement('q-aria-switch', AriaSwitchElement)

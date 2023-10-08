import { AriaSwitchElementEventMap, defineCustomElement, KeyboardEventKey, WebElementLogger } from '@aracna/web'
import { css, CSSResult, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaSwitchController } from '../../controllers/aria-switch-controller.js'
import { FormFieldElement } from '../core/form-field-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-switch': AriaSwitchElement
  }
}

export class AriaSwitchElement<E extends AriaSwitchElementEventMap = AriaSwitchElementEventMap> extends FormFieldElement<E> {
  protected aria: AriaSwitchController = new AriaSwitchController(this)

  /**
   * INTERNAL
   */
  _on?: boolean

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

  get on(): boolean | undefined {
    return this._on
  }

  set on(on: boolean | undefined) {
    let old: boolean | undefined

    old = this._on
    this._on = on

    this.requestUpdate('on', old)
  }

  get value(): boolean | undefined {
    return super.value
  }

  set value(value: boolean | undefined) {
    super.value = value
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

defineCustomElement('aracna-aria-switch', AriaSwitchElement)

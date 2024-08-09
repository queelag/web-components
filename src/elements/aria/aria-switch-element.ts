import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResult, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaSwitchController } from '../../controllers/aria-switch-controller.js'
import type { AriaSwitchElementEventMap } from '../../definitions/events.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-switch': AriaSwitchElement
  }
}

class AriaSwitchElement<E extends AriaSwitchElementEventMap = AriaSwitchElementEventMap> extends FormControlElement<E> {
  protected aria: AriaSwitchController = new AriaSwitchController(this)

  /**
   * INTERNAL
   */
  protected _on?: boolean

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
    if (this.native) {
      return
    }

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.id, 'onClick', `The switch is disabled or readonly.`)
    }

    this.on = !this.on
    ElementLogger.verbose(this.uid, 'onClick', `The switch has been turned ${this.value ? 'on' : 'off'}.`)

    this.touch()
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.native) {
      return
    }

    if (event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.onClick()
  }

  get on(): boolean | undefined {
    if (this.target && typeof this.path === 'string') {
      return super.value
    }

    return this._on
  }

  set on(on: boolean | undefined) {
    let old: boolean | undefined

    old = this._on
    this._on = on

    this.requestUpdate('on', old)

    super.value = on
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

export { AriaSwitchElement as AracnaAriaSwitchElement }

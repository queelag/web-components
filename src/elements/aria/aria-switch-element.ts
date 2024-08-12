import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResult, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaSwitchController } from '../../controllers/aria-switch-controller.js'
import type { AriaSwitchElementEventMap } from '../../definitions/events.js'
import { SwitchOffEvent } from '../../events/switch-off-event.js'
import { SwitchOnEvent } from '../../events/switch-on-event.js'
import { gkek } from '../../functions/gkek.js'
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
   * Internals
   */
  /** */
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

    ElementLogger.verbose(this.uid, 'onClick', `Turning ${this.on ? 'off' : 'on'} the switch.`)
    this.toggle()
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

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.id, 'onClick', `The switch is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the switch.`)
    this.onClick()
  }

  toggle(): void {
    if (this.on) {
      return this.off()
    }

    this.__on()
  }

  __on(): void {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, '__on', `The switch is disabled or readonly.`)
    }

    this.on = true
    ElementLogger.verbose(this.uid, '__on', `The switch has been turned on.`)

    ElementLogger.verbose(this.uid, '__on', `Setting the value.`)
    this.setValue(this.on)

    ElementLogger.verbose(this.uid, '__on', `Touching the switch.`)
    this.touch()

    this.dispatchEvent(new SwitchOnEvent())
    ElementLogger.verbose(this.uid, '__on', `The "switch-on" event has been dispatched.`)
  }

  off(): void {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'off', `The switch is disabled or readonly.`)
    }

    this.on = false
    ElementLogger.verbose(this.uid, 'off', `The switch has been turned off.`)

    ElementLogger.verbose(this.uid, 'off', `Setting the value.`)
    this.setValue(this.on)

    ElementLogger.verbose(this.uid, 'off', `Touching the switch.`)
    this.touch()

    this.dispatchEvent(new SwitchOffEvent())
    ElementLogger.verbose(this.uid, 'off', `The "switch-off" event has been dispatched.`)
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

import { wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import type { SwitchElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaSwitchElement as AriaSwitchElement } from '../aria/aria-switch-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-switch': SwitchElement
  }
}

class SwitchElement<E extends SwitchElementEventMap = SwitchElementEventMap> extends AriaSwitchElement<E> {
  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.inputElement, 4).then(() => {
      this.setInputElementAttributes()
      this.inputElement?.addEventListener('change', this.onChange)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'path', 'readonly', 'target', 'value'].includes(name)) {
      this.setInputElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.inputElement?.removeEventListener('change', this.onChange)
  }

  setInputElementAttributes = (): void => {
    if (!this.inputElement) {
      return
    }

    if (typeof this.disabled === 'boolean') {
      this.inputElement.disabled = this.disabled
    }

    this.inputElement.max = '1'
    this.inputElement.min = '0'

    if (typeof this.readonly === 'boolean') {
      this.inputElement.readOnly = this.readonly
    }

    this.inputElement.step = '1'
    this.inputElement.type = 'range'
    this.inputElement.value = this.value ? '1' : '0'
  }

  blur(): void {
    if (!this.inputElement) {
      return super.blur()
    }

    this.inputElement.blur()
    ElementLogger.verbose(this.uid, 'blur', 'The input element has been blurred.')
  }

  focus(options?: FocusOptions): void {
    if (!this.inputElement) {
      return super.focus(options)
    }

    this.inputElement.focus(options)
    ElementLogger.verbose(this.uid, 'focus', 'The input element has been focused.')
  }

  onChange = (): void => {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onChange', `The switch is disabled or readonly.`)
    }

    if (this.inputElement?.value === '1') {
      ElementLogger.verbose(this.uid, 'onChange', `Turning the switch on.`)
      return this.__on()
    }

    ElementLogger.verbose(this.uid, 'onChange', `Turning the switch off.`)
    this.off()
  }

  get value(): boolean | undefined {
    return super.value
  }

  set value(value: boolean | undefined) {
    super.value = value

    if (this.inputElement) {
      this.inputElement.value = value ? '1' : '0'
    }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' }
  }
}

defineCustomElement('aracna-switch', SwitchElement)

export { SwitchElement as AracnaSwitchElement }

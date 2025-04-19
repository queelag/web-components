import { wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { css, type CSSResultGroup } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { CheckBoxElementEventMap } from '../../definitions/events.js'
import { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaCheckBoxElement as AriaCheckBoxElement } from '../aria/aria-check-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-checkbox': CheckBoxElement
  }
}

class CheckBoxElement<E extends CheckBoxElementEventMap = CheckBoxElementEventMap> extends AriaCheckBoxElement<E> {
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

    if (['checked', 'disabled', 'path', 'readonly', 'target', 'value'].includes(name)) {
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

    this.inputElement.checked = Boolean(this.checked)
    this.inputElement.disabled = Boolean(this.disabled)
    this.inputElement.readOnly = Boolean(this.readonly)
    this.inputElement.type = 'checkbox'
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
    ElementLogger.verbose(this.uid, 'onChange', `${this.checked ? 'Checking' : 'Unchecking'} the checkbox.`)
    this.toggle()
  }

  get slug(): ElementSlug {
    return ElementSlug.CHECKBOX
  }

  get value(): boolean | undefined {
    return super.value
  }

  set value(value: boolean | undefined) {
    super.value = value

    if (this.inputElement && typeof value === 'boolean') {
      this.inputElement.checked = value
    }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }
    `
  ]
}

defineCustomElement('aracna-checkbox', CheckBoxElement)

export { CheckBoxElement as AracnaCheckBoxElement }

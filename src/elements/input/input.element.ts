import { parseNumber, removeArrayItems, TextCodec } from '@queelag/core'
import {
  DEFAULT_INPUT_TYPE,
  defineCustomElement,
  ElementName,
  InputElementEventMap,
  InputElementTouchTrigger,
  InputElementType,
  InputElementValue,
  QueryDeclarations,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { DirectiveResult } from 'lit-html/directive'
import { ifdef } from '../../directives/if.defined'
import { styleMap } from '../../directives/style.map'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-input': InputElement
  }
}

export class InputElement<E extends InputElementEventMap = InputElementEventMap> extends FormFieldElement<E> {
  /**
   * PROPERTIES
   */
  multiple?: boolean
  obscured?: boolean
  padding?: string
  placeholder?: string
  touchTrigger?: InputElementTouchTrigger
  type: InputElementType = DEFAULT_INPUT_TYPE

  /**
   * QUERIES
   */
  private inputElement!: HTMLInputElement

  /**
   * STATES
   */
  private temporaryValue: string = ''

  private onBlur(): void {
    this.focused = false
    WebElementLogger.verbose(this.uid, 'onBlur', `The focused property has been set to false.`)

    if (this.touchTrigger === 'blur') {
      this.touch()
    }
  }

  private onFocus(): void {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The focused property has been set to true.`)
  }

  private onInput(): void {
    switch (this.type) {
      case 'buffer':
        this.value = TextCodec.encode(this.inputElement.value)
        WebElementLogger.verbose(this.uid, 'onInput', `The value has been encoded and set.`, this.value)

        break
      case 'color':
      case 'email':
      case 'month':
      case 'password':
      case 'search':
      case 'tel':
      case 'time':
      case 'url':
      case 'week':
        this.value = this.inputElement.value
        WebElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])

        break
      case 'date':
      case 'datetime-local':
        this.value = this.inputElement.value ? new Date(this.inputElement.value) : undefined
        WebElementLogger.verbose(this.uid, 'onInput', `The value has been set as a date.`, this.value)

        break
      case 'number':
        this.value = this.inputElement.value ? parseNumber(this.inputElement.value) : undefined
        WebElementLogger.verbose(this.uid, 'onInput', `The value has been set as a number.`, [this.value])

        break
      case 'text':
        if (this.multiple) {
          this.temporaryValue = this.inputElement.value
          WebElementLogger.verbose(this.uid, 'onInput', `The temporary value has been set.`, [this.temporaryValue])

          break
        }

        this.value = this.inputElement.value
        WebElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])

        break
    }

    if (this.touchTrigger === 'input') {
      this.touch()
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || this.type !== 'text' || !this.multiple) {
      return
    }

    if (this.temporaryValue.length <= 0) {
      return WebElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    this.value = this.value || []
    this.value = [...(this.value as string[]), this.temporaryValue]
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The item has been pushed.`, [this.temporaryValue], this.value)

    this.inputElement.value = ''
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The input element value has been reset.`)

    this.touch()
  }

  removeItem(item: string): void {
    if (this.type !== 'text' || !this.multiple) {
      return
    }

    this.value = this.value || []
    this.value = removeArrayItems(this.value as string[], [item])
    WebElementLogger.verbose(this.uid, 'removeItem', `The item has been removed.`, [item], this.value)

    this.touch()
  }

  clear(): void {
    switch (this.type) {
      case 'buffer':
        this.value = new Uint8Array()
        break
      case 'color':
      case 'email':
      case 'month':
      case 'password':
      case 'search':
      case 'tel':
      case 'time':
      case 'url':
      case 'week':
        this.value = ''
        break
      case 'date':
      case 'datetime-local':
        this.value = undefined
        break
      case 'number':
        this.value = 0
        break
      case 'text':
        if (this.multiple) {
          this.value = []
          break
        }

        this.value = ''
        break
    }

    WebElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, [this.value])

    this.inputElement.value = ''
    WebElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`)

    this.inputElement.focus()
    WebElementLogger.verbose(this.uid, 'clear', `The input element has been focused.`)

    this.touch()
  }

  obscure(): void {
    this.obscured = true
    WebElementLogger.verbose(this.uid, 'obscure', `The obscured property has been set to true.`)

    this.inputElement.focus()
    WebElementLogger.verbose(this.uid, 'obscure', `The input element has been focused.`)
  }

  reveal(): void {
    this.obscured = false
    WebElementLogger.verbose(this.uid, 'reveal', `The obscured property has been set to false.`)

    this.inputElement.focus()
    WebElementLogger.verbose(this.uid, 'reveal', `The input element has been focused.`)
  }

  render() {
    return html`
      <input
        ?autofocus=${this.autofocus}
        @blur=${this.onBlur}
        ?disabled=${this.disabled}
        @focus=${this.onFocus}
        @input=${this.onInput}
        @keyup=${this.onKeyUp}
        placeholder=${ifdef(this.placeholder)}
        ?readonly=${this.readonly}
        style=${this.inputElementStyle}
        type=${this.inputElementType}
        value=${ifdef(this.inputElementValue)}
      />
    `
  }

  private get inputElementStyle(): DirectiveResult {
    return styleMap({ ...this.styleInfo, padding: this.padding })
  }

  private get inputElementType(): any {
    if (this.obscured) {
      return 'password'
    }

    if (this.type === 'buffer') {
      return 'text'
    }

    return this.type
  }

  private get inputElementValue(): string | undefined {
    switch (this.type) {
      case 'buffer':
        return undefined
      case 'color':
      case 'email':
      case 'month':
      case 'password':
      case 'search':
      case 'tel':
      case 'time':
      case 'url':
      case 'week':
        return super.value
      case 'date':
      case 'datetime-local':
        return super.value?.toISOString()
      case 'number':
        return super.value?.toString()
      case 'text':
        if (this.multiple) {
          return this.temporaryValue
        }

        return super.value
    }
  }

  get name(): ElementName {
    return ElementName.INPUT
  }

  get value(): InputElementValue {
    switch (this.type) {
      case 'buffer':
      // return undefined
      case 'color':
      case 'email':
      case 'month':
      case 'password':
      case 'search':
      case 'tel':
      case 'time':
      case 'url':
      case 'week':
        return super.value
      case 'date':
      case 'datetime-local':
        return super.value
      case 'number':
        return super.value
      case 'text':
        if (this.multiple) {
          return super.value
        }

        return super.value
    }
  }

  set value(value: InputElementValue) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    multiple: { type: Boolean, reflect: true },
    obscured: { type: Boolean, reflect: true },
    padding: { type: String, reflect: true },
    placeholder: { type: String, reflect: true },
    temporaryValue: { state: true },
    touchTrigger: { type: String, attribute: 'touch-trigger', reflect: true },
    type: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([normalized]) input {
        background: none;
        border: none;
        outline: none;
        padding: 0;
      }
    `
  ]
}

defineCustomElement('q-input', InputElement)

import { isArray, parseNumber, removeArrayItems, TextCodec } from '@aracna/core'
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
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { DirectiveResult } from 'lit-html/directive.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-input': InputElement
  }
}

export class InputElement<E extends InputElementEventMap = InputElementEventMap> extends FormControlElement<E> {
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
  inputElement!: HTMLInputElement

  /**
   * STATES
   */
  temporaryValue: string = ''

  onBlur(): void {
    this.focused = false
    WebElementLogger.verbose(this.uid, 'onBlur', `The focused property has been set to false.`)

    if (this.touchTrigger === 'blur') {
      this.touch()
    }
  }

  onFocus(): void {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The focused property has been set to true.`)
  }

  onInput(): void {
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

  onKeyUp(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || this.type !== 'text' || this.single) {
      return
    }

    if (this.temporaryValue.length <= 0) {
      return WebElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = [...this.value, this.temporaryValue]
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The item has been pushed.`, [this.temporaryValue], this.value)

    this.inputElement.value = ''
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The input element value has been reset.`)

    this.touch()
  }

  removeItem(item: string): void {
    if (this.type !== 'text' || this.single) {
      return
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = removeArrayItems(this.value, [item])
    WebElementLogger.verbose(this.uid, 'removeItem', `The item has been removed.`, [item], this.value)

    this.touch()
  }

  clear(): void {
    this.value = undefined
    WebElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, [this.value])

    if (this.multiple) {
      this.temporaryValue = ''
      WebElementLogger.verbose(this.uid, 'clear', `The temporary value has been reset.`, [this.temporaryValue])
    }

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
        style=${this.styleMap}
        type=${this.inputElementType}
        .value=${this.inputElementValue}
      />
    `
  }

  get inputElementType(): any {
    if (this.obscured) {
      return 'password'
    }

    if (this.type === 'buffer') {
      return 'text'
    }

    return this.type
  }

  get inputElementValue(): string {
    switch (this.type) {
      case 'buffer':
        return ''
      case 'color':
      case 'email':
      case 'month':
      case 'password':
      case 'search':
      case 'tel':
      case 'time':
      case 'url':
      case 'week':
        return typeof this.value === 'string' ? this.value : ''
      case 'date':
        return this.value instanceof Date ? this.value.toISOString().replace(/T[0-9:.]+Z$/, '') : ''
      case 'datetime-local':
        return this.value instanceof Date ? this.value.toISOString() : ''
      case 'number':
        return typeof this.value === 'number' ? this.value.toString() : ''
      case 'text':
        if (this.multiple) {
          return this.temporaryValue
        }

        return typeof this.value === 'string' ? this.value : ''
      default:
        return ''
    }
  }

  get name(): ElementName {
    return ElementName.INPUT
  }

  get single(): boolean {
    return !this.multiple
  }

  get styleMap(): DirectiveResult {
    return styleMap({
      ...this.sizeStyleInfo,
      padding: this.padding
    })
  }

  get value(): InputElementValue {
    switch (this.type) {
      case 'buffer':
        return super.value
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
      default:
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
        padding: none;
      }

      input {
        all: inherit;
      }
    `
  ]
}

defineCustomElement('aracna-input', InputElement)

import { encodeText, isArray, parseNumber, removeArrayItems } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'
import { DEFAULT_INPUT_TYPE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { InputElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { InputElementTouchTrigger, InputElementType, InputElementValue } from '../../definitions/types.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-input': InputElement
  }
}

class InputElement<E extends InputElementEventMap = InputElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  /** */
  multiple?: boolean
  obscured?: boolean
  padding?: string
  placeholder?: string
  touchTrigger?: InputElementTouchTrigger
  type: InputElementType = DEFAULT_INPUT_TYPE

  /**
   * Queries
   */
  /** */
  inputElement!: HTMLInputElement

  /**
   * States
   */
  /** */
  temporaryValue: string = ''

  onBlur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The input has been marked as blurred.`)

    if (this.touchTrigger === 'blur') {
      ElementLogger.verbose(this.uid, 'onBlur', `Touching.`)
      this.touch()
    }
  }

  onFocus(): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The input has been marked as focused.`)
  }

  onInput(): void {
    switch (this.type) {
      case 'buffer':
        ElementLogger.verbose(this.uid, 'onInput', `Setting the encoded value.`)
        this.setValue(encodeText(this.inputElement.value))

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
        ElementLogger.verbose(this.uid, 'onInput', `Setting the value.`)
        this.setValue(this.inputElement.value)

        break
      case 'date':
      case 'datetime-local':
        ElementLogger.verbose(this.uid, 'onInput', `Setting the date value.`)
        this.setValue(this.inputElement.value ? new Date(this.inputElement.value) : undefined)

        break
      case 'number':
        ElementLogger.verbose(this.uid, 'onInput', `Setting the number value.`)
        this.setValue(this.inputElement.value ? parseNumber(this.inputElement.value) : undefined)

        break
      case 'text':
        if (this.multiple) {
          this.temporaryValue = this.inputElement.value
          ElementLogger.verbose(this.uid, 'onInput', `The temporary value has been set.`, [this.temporaryValue])

          break
        }

        ElementLogger.verbose(this.uid, 'onInput', `Setting the value.`)
        this.setValue(this.inputElement.value)

        break
    }

    if (this.touchTrigger === 'input') {
      ElementLogger.verbose(this.uid, 'onInput', `Touching.`)
      this.touch()
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    let value: string[]

    if (event.key !== 'Enter' || this.type !== 'text' || this.single) {
      return
    }

    if (this.temporaryValue.length <= 0) {
      return ElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    value = isArray(this.value) ? this.value : []
    value = [...value, this.temporaryValue]

    ElementLogger.verbose(this.uid, 'onKeyUp', `Adding the item to the value.`, [this.temporaryValue])
    this.setValue(value)

    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'onKeyUp', `The input value has been reset.`, [this.inputElement.value])

    ElementLogger.verbose(this.uid, 'onKeyUp', `Touching.`)
    this.touch()
  }

  removeItem(item: string): void {
    let value: string[]

    if (this.type !== 'text' || this.single) {
      return ElementLogger.warn(this.uid, 'removeItem', `The type is not text or the input is not multiple.`)
    }

    value = isArray(this.value) ? this.value : []
    value = removeArrayItems(value, [item])

    ElementLogger.verbose(this.uid, 'removeItem', `Removing the item from the value.`, [item])
    this.setValue(value)

    ElementLogger.verbose(this.uid, 'removeItem', `Touching.`)
    this.touch()
  }

  clear(): void {
    super.clear()

    if (this.multiple) {
      this.temporaryValue = ''
      ElementLogger.verbose(this.uid, 'clear', `The temporary value has been reset.`, [this.temporaryValue])
    }

    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'clear', `The input value has been reset.`, [this.inputElement.value])

    this.inputElement.focus()
    ElementLogger.verbose(this.uid, 'clear', `The input has been focused.`)

    this.touch()
  }

  obscure(): void {
    this.obscured = true
    ElementLogger.verbose(this.uid, 'obscure', `The value has been obscured.`)

    this.inputElement.focus()
    ElementLogger.verbose(this.uid, 'obscure', `The input has been focused.`)
  }

  reveal(): void {
    this.obscured = false
    ElementLogger.verbose(this.uid, 'reveal', `The value has been revealed.`)

    this.inputElement.focus()
    ElementLogger.verbose(this.uid, 'reveal', `The input has been focused.`)
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

export { InputElement as AracnaInputElement }

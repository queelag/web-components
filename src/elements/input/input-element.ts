import { decodeText, encodeText, isArray, parseNumber, removeArrayItems, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { DEFAULT_INPUT_TYPE } from '../../definitions/constants.js'
import { ElementSlug } from '../../definitions/enums.js'
import type { InputClearElementEventMap, InputElementEventMap, InputItemRemoveElementEventMap, InputObscureElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { InputElementTouchTrigger, InputElementType, InputElementValue } from '../../definitions/types.js'
import { InputChangeEvent } from '../../events/input-change-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { getDateDate, getDateHours, getDateMilliseconds, getDateMinutes, getDateMonth, getDateSeconds } from '../../utils/date-utils.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-input': InputElement
    'aracna-input-clear': InputClearElement
    'aracna-input-obscure': InputObscureElement
    'aracna-input-item-remove': InputItemRemoveElement
  }
}

class InputElement<E extends InputElementEventMap = InputElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  /** */
  multiple?: boolean
  protected _obscured?: boolean
  placeholder?: string
  touchTrigger?: InputElementTouchTrigger
  protected _type?: InputElementType

  /**
   * Queries
   */
  /** */
  inputElement?: HTMLInputElement

  /**
   * States
   */
  /** */
  temporaryValue: string = ''

  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.inputElement, 4).then(() => {
      this.setInputElementAttributes()

      this.inputElement?.addEventListener('blur', this.onBlur)
      this.inputElement?.addEventListener('focus', this.onFocus)
      this.inputElement?.addEventListener('input', this.onInput)
      this.inputElement?.addEventListener('keyup', this.onKeyUp)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'multiple', 'path', 'placeholder', 'readonly', 'target', 'value'].includes(name)) {
      this.setInputElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.inputElement?.removeEventListener('blur', this.onBlur)
    this.inputElement?.removeEventListener('focus', this.onFocus)
    this.inputElement?.removeEventListener('input', this.onInput)
    this.inputElement?.removeEventListener('keyup', this.onKeyUp)
  }

  setInputElementAttributes = (): void => {
    if (!this.inputElement) {
      return
    }

    this.inputElement.disabled = Boolean(this.disabled)

    if (typeof this.placeholder === 'string') {
      this.inputElement.placeholder = this.placeholder
    }

    this.inputElement.readOnly = Boolean(this.readonly)
    this.inputElement.value = this.inputElementValue
  }

  onBlur = (): void => {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The input has been marked as blurred.`)

    if (this.touchTrigger === 'blur') {
      ElementLogger.verbose(this.uid, 'onBlur', `Touching.`)
      this.touch()
    }
  }

  onFocus = (): void => {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The input has been marked as focused.`)
  }

  onInput = (): void => {
    if (!this.inputElement) {
      return
    }

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

  onKeyUp = (event: KeyboardEvent): void => {
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

    if (this.inputElement) {
      this.inputElement.value = ''
      ElementLogger.verbose(this.uid, 'onKeyUp', `The input value has been reset.`, [this.inputElement.value])
    }

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

    if (this.inputElement) {
      this.inputElement.value = ''
      ElementLogger.verbose(this.uid, 'clear', `The input value has been reset.`, [this.inputElement.value])

      this.inputElement.focus()
      ElementLogger.verbose(this.uid, 'clear', `The input has been focused.`)
    }

    this.touch()
  }

  obscure(): void {
    this.obscured = true
    ElementLogger.verbose(this.uid, 'obscure', `The value has been obscured.`)

    if (this.inputElement) {
      this.inputElement.focus()
      ElementLogger.verbose(this.uid, 'obscure', `The input has been focused.`)
    }
  }

  reveal(): void {
    this.obscured = false
    ElementLogger.verbose(this.uid, 'reveal', `The value has been revealed.`)

    if (this.inputElement) {
      this.inputElement.focus()
      ElementLogger.verbose(this.uid, 'reveal', `The input has been focused.`)
    }
  }

  setValue(value: InputElementValue): void {
    super.setValue(value)

    this.dispatchEvent(
      new InputChangeEvent(this.value, this.inputElementValue, { error: this.error, schema: this.schema, touched: this.touched, validation: this.validation })
    )
    ElementLogger.verbose(this.uid, 'setValue', `The "input-change" event has been dispatched.`)
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
        return this.value instanceof Uint8Array ? decodeText(this.value) : ''
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
        return this.value instanceof Date ? `${this.value.getFullYear()}-${getDateMonth(this.value)}-${getDateDate(this.value)}` : ''
      case 'datetime-local':
        return this.value instanceof Date
          ? [
              `${this.value.getFullYear()}-${getDateMonth(this.value)}-${getDateDate(this.value)}`,
              `${getDateHours(this.value)}:${getDateMinutes(this.value)}:${getDateSeconds(this.value)}.${getDateMilliseconds(this.value)}`
            ].join('T')
          : ''
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

  get slug(): ElementSlug {
    return ElementSlug.INPUT
  }

  get obscured(): boolean | undefined {
    return this._obscured
  }

  set obscured(obscured: boolean | undefined) {
    let old: boolean | undefined

    old = this._obscured
    this._obscured = obscured

    this.requestUpdate('obscured', old)

    if (this.inputElement) {
      this.inputElement.type = this.inputElementType
    }
  }

  get single(): boolean {
    return !this.multiple
  }

  get type(): InputElementType {
    return this._type || DEFAULT_INPUT_TYPE
  }

  set type(type: InputElementType | undefined) {
    let old: InputElementType | undefined

    old = this._type
    this._type = type

    this.requestUpdate('type', old)

    if (this.inputElement) {
      this.inputElement.type = this.inputElementType
    }
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

    if (this.inputElement) {
      this.inputElement.value = this.inputElementValue
    }
  }

  static properties: PropertyDeclarations = {
    multiple: { type: Boolean, reflect: true },
    obscured: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true },
    temporaryValue: { state: true },
    touchTrigger: { type: String, attribute: 'touch-trigger', reflect: true },
    type: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' }
  }
}

class InputObscureElement<E extends InputObscureElementEventMap = InputObscureElementEventMap> extends BaseElement<E> {
  /**
   * Queries
   */
  /** */
  rootElement?: InputElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The input is disabled or readonly.`)
    }

    if (this.rootElement?.obscured) {
      ElementLogger.verbose(this.uid, 'onClick', `Revealing the value...`)
      return this.rootElement.reveal()
    }

    if (this.rootElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Obscuring the value...`)
      this.rootElement.obscure()
    }
  }

  get slug(): ElementSlug {
    return ElementSlug.INPUT_OBSCURE
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-input', closest: true }
  }
}

class InputItemRemoveElement<E extends InputItemRemoveElementEventMap = InputItemRemoveElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  item?: string

  /**
   * Queries
   */
  /** */
  rootElement?: InputElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The input is disabled or readonly.`)
    }

    if (this.rootElement && typeof this.item === 'string') {
      ElementLogger.verbose(this.uid, 'onClick', `Removing the item...`, [this.item])
      this.rootElement.removeItem(this.item)
    }
  }

  get slug(): ElementSlug {
    return ElementSlug.INPUT_ITEM_REMOVE
  }

  static properties: PropertyDeclarations = {
    item: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-input', closest: true }
  }
}

class InputClearElement<E extends InputClearElementEventMap = InputClearElementEventMap> extends BaseElement<E> {
  /**
   * Queries
   */
  /** */
  rootElement?: InputElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The input is disabled or readonly.`)
    }

    if (this.rootElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Clearing the value...`)
      this.rootElement.clear()
    }
  }

  get slug(): ElementSlug {
    return ElementSlug.INPUT_CLEAR
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-input', closest: true }
  }
}

defineCustomElement('aracna-input', InputElement)
defineCustomElement('aracna-input-clear', InputClearElement)
defineCustomElement('aracna-input-item-remove', InputItemRemoveElement)
defineCustomElement('aracna-input-obscure', InputObscureElement)

export {
  InputClearElement as AracnaInputClearElement,
  InputElement as AracnaInputElement,
  InputItemRemoveElement as AracnaInputItemRemoveElement,
  InputObscureElement as AracnaInputObscureElement
}

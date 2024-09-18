import { isArray, isWindowNotDefined, removeArrayItems, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { TextAreaClearElementEventMap, TextAreaElementEventMap, TextAreaItemRemoveElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { TextAreaElementTouchTrigger, TextAreaElementValue } from '../../definitions/types.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-textarea': TextAreaElement
    'aracna-textarea-clear': TextAreaClearElement
    'aracna-textarea-item-remove': TextAreaItemRemoveElement
  }
}

class TextAreaElement<E extends TextAreaElementEventMap = TextAreaElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  /** */
  autosize?: boolean
  multiple?: boolean
  placeholder?: string
  touchTrigger?: TextAreaElementTouchTrigger

  /**
   * Queries
   */
  /** */
  spanElement!: HTMLSpanElement
  textAreaElement!: HTMLTextAreaElement

  /**
   * States
   */
  /** */
  temporaryValue: string = ''

  connectedCallback(): void {
    super.connectedCallback()

    if (this.autosize) {
      ElementLogger.verbose(this.uid, 'connectedCallback', `Computing the height.`)
      wf(() => this.textAreaElement, 4).then(() => this.computeHeight())
    }

    wf(() => this.textAreaElement, 4).then(() => {
      this.setTextAreaElementAttributes()

      this.textAreaElement.addEventListener('blur', this.onBlur)
      this.textAreaElement.addEventListener('focus', this.onFocus)
      this.textAreaElement.addEventListener('input', this.onInput)
      this.textAreaElement.addEventListener('keyup', this.onKeyUp)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (this.autosize && ['cols', 'rows'].includes(name)) {
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Computing the height.`)
      this.computeHeight()
    }

    if (['disabled', 'readonly'].includes(name)) {
      this.setTextAreaElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.textAreaElement?.removeEventListener('blur', this.onBlur)
    this.textAreaElement?.removeEventListener('focus', this.onFocus)
    this.textAreaElement?.removeEventListener('input', this.onInput)
    this.textAreaElement?.removeEventListener('keyup', this.onKeyUp)
  }

  setTextAreaElementAttributes = (): void => {
    if (typeof this.disabled === 'boolean') {
      this.textAreaElement.disabled = this.disabled
    }

    if (typeof this.readonly === 'boolean') {
      this.textAreaElement.readOnly = this.readonly
    }

    this.textAreaElement.style.overflowY = 'hidden'
  }

  onBlur = (): void => {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The textarea has been marked as blurred.`)

    if (this.touchTrigger === 'blur') {
      ElementLogger.verbose(this.uid, 'onBlur', `Touching.`)
      this.touch()
    }
  }

  onFocus = (): void => {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The textarea has been marked as focused.`)
  }

  onInput = (): void => {
    if (this.multiple && this.textAreaElement) {
      this.temporaryValue = this.textAreaElement.value
      ElementLogger.verbose(this.uid, 'onInput', `The temporary value has been set.`, [this.temporaryValue])
    }

    if (this.single && this.textAreaElement) {
      ElementLogger.verbose(this.uid, 'onInput', `Setting the value.`)
      this.setValue(this.textAreaElement.value)
    }

    if (this.touchTrigger === 'input') {
      ElementLogger.verbose(this.uid, 'onInput', `Touching.`)
      this.touch()
    }
  }

  onKeyUp = (event: KeyboardEvent): void => {
    let value: string[]

    if (event.key !== 'Enter' || this.single) {
      return
    }

    if (this.temporaryValue.length <= 0) {
      return ElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    value = isArray(this.value) ? this.value : []
    value = [...value, this.temporaryValue]

    ElementLogger.verbose(this.uid, 'onKeyUp', `Adding the item to the value.`, [this.temporaryValue])
    this.setValue(value)

    this.textAreaElement.value = ''
    ElementLogger.verbose(this.uid, 'onKeyUp', `The textarea element value has been reset.`, [this.textAreaElement.value])

    ElementLogger.verbose(this.uid, 'onKeyUp', `Touching.`)
    this.touch()
  }

  computeHeight(): void {
    let style: CSSStyleDeclaration

    if (isWindowNotDefined() || !this.textAreaElement) {
      return
    }

    style = getComputedStyle(this.textAreaElement)

    if (this.spanElement.style.opacity !== '0') {
      for (let property in style) {
        this.spanElement.style.cssText += `${property}:${style[property]};`
      }

      this.spanElement.style.boxSizing = 'border-box'
      this.spanElement.style.opacity = '0'
      this.spanElement.style.pointerEvents = 'none'
      this.spanElement.style.position = 'absolute'
      this.spanElement.style.whiteSpace = 'pre-wrap'
      this.spanElement.style.wordBreak = 'break-word'
    }

    this.spanElement.innerText = this.textAreaElement.value + 'a'
    this.spanElement.style.height = 'auto'
    this.spanElement.style.maxHeight = 'auto'
    this.spanElement.style.maxWidth = style.width
    // this.spanElement.style.minHeight = style.height
    this.spanElement.style.width = '100%'

    this.textAreaElement.style.height = getComputedStyle(this.spanElement).height
    ElementLogger.verbose(this.uid, 'computeHeight', `The textarea element height has been set.`, [this.textAreaElement.style.height])
  }

  removeItem(item: string): void {
    let value: string[]

    if (this.single) {
      return ElementLogger.warn(this.uid, 'removeItem', `The textarea is not multiple.`)
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

    if (this.autosize) {
      this.textAreaElement.style.height = 'auto'
      ElementLogger.verbose(this.uid, 'clear', `The textarea element height has been set to "auto".`, [this.textAreaElement.style.height])
    }

    this.textAreaElement.value = ''
    ElementLogger.verbose(this.uid, 'clear', `The textarea element value has been reset.`, [this.textAreaElement.value])

    this.textAreaElement.focus()
    ElementLogger.verbose(this.uid, 'clear', `The textarea element has been focused.`)

    ElementLogger.verbose(this.uid, 'clear', `Touching.`)
    this.touch()
  }

  render() {
    return html`
      ${super.render()}
      <span></span>
    `
  }

  get name(): ElementName {
    return ElementName.TEXTAREA
  }

  get single(): boolean {
    return !this.multiple
  }

  get textAreaElementValue(): string {
    if (this.multiple) {
      return this.temporaryValue
    }

    return typeof this.value === 'string' ? this.value : ''
  }

  get value(): TextAreaElementValue {
    return super.value
  }

  set value(value: TextAreaElementValue) {
    super.value = value

    if (this.autosize) {
      ElementLogger.verbose(this.uid, 'set value', `Computing the height.`)
      this.computeHeight()
    }

    if (this.textAreaElement) {
      this.textAreaElement.value = this.textAreaElementValue
    }
  }

  static properties: PropertyDeclarations = {
    autosize: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true },
    temporaryValue: { state: true },
    touchTrigger: { type: String, attribute: 'touch-trigger', reflect: true }
  }

  static queries: QueryDeclarations = {
    spanElement: { selector: 'span', shadow: true },
    textAreaElement: { selector: 'textarea' }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([autosize]) textarea {
        overflow-y: hidden;
      }

      textarea {
        all: inherit;
        box-sizing: content-box;
        word-break: break-word;
      }
    `
  ]
}

class TextAreaClearElement<E extends TextAreaClearElementEventMap = TextAreaClearElementEventMap> extends BaseElement<E> {
  /**
   * Queries
   */
  /** */
  rootElement!: TextAreaElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The textarea is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onClick', `Clearing the value...`)
    this.rootElement.clear()
  }

  get name(): ElementName {
    return ElementName.TEXTAREA_CLEAR
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-textarea', closest: true }
  }
}

class TextAreaItemRemoveElement<E extends TextAreaItemRemoveElementEventMap = TextAreaItemRemoveElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  item!: string

  /**
   * Queries
   */
  /** */
  rootElement!: TextAreaElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The textarea is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onClick', `Removing the item...`, [this.item])
    this.rootElement.removeItem(this.item)
  }

  get name(): ElementName {
    return ElementName.TEXTAREA_ITEM_REMOVE
  }

  static properties: PropertyDeclarations = {
    item: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-textarea', closest: true }
  }
}

defineCustomElement('aracna-textarea', TextAreaElement)
defineCustomElement('aracna-textarea-clear', TextAreaClearElement)
defineCustomElement('aracna-textarea-remove-item', TextAreaItemRemoveElement)

export {
  TextAreaClearElement as AracnaTextAreaClearElement,
  TextAreaElement as AracnaTextAreaElement,
  TextAreaItemRemoveElement as AracnaTextAreaItemRemoveElement
}

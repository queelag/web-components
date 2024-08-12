import { isArray, isWindowNotDefined, removeArrayItems, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'
import { ElementName } from '../../definitions/enums.js'
import type { TextAreaElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { TextAreaElementResize, TextAreaElementTouchTrigger, TextAreaElementValue } from '../../definitions/types.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-textarea': TextAreaElement
  }
}

class TextAreaElement<E extends TextAreaElementEventMap = TextAreaElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  autosize?: boolean
  cols?: number
  multiple?: boolean
  padding?: string
  placeholder?: string
  resize?: TextAreaElementResize
  rows?: number
  touchTrigger?: TextAreaElementTouchTrigger

  /**
   * Queries
   */
  spanElement!: HTMLSpanElement
  textAreaElement!: HTMLTextAreaElement

  /**
   * States
   */
  computedHeight?: string
  temporaryValue: string = ''

  connectedCallback(): void {
    super.connectedCallback()

    if (this.autosize) {
      wf(() => this.textAreaElement, 4).then(() => this.computeHeight())
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (this.autosize && ['cols', 'rows'].includes(name)) {
      this.computeHeight()
    }
  }

  onBlur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The textarea has been blurred.`)

    if (this.touchTrigger === 'blur') {
      this.touch()
    }
  }

  onFocus(): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The textarea has been focused.`)
  }

  onInput(): void {
    if (this.multiple) {
      this.temporaryValue = this.textAreaElement.value
      ElementLogger.verbose(this.uid, 'onInput', `The temporary value has been set.`, [this.temporaryValue])
    }

    if (this.single) {
      this.value = this.textAreaElement.value
      ElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])
    }

    if (this.touchTrigger === 'input') {
      this.touch()
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || this.single) {
      return
    }

    if (this.temporaryValue.length <= 0) {
      return ElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = [...this.value, this.temporaryValue]
    ElementLogger.verbose(this.uid, 'onKeyUp', `The item has been pushed.`, [this.temporaryValue], this.value)

    this.textAreaElement.value = ''
    ElementLogger.verbose(this.uid, 'onKeyUp', `The textarea element value has been reset.`)

    this.touch()
  }

  computeHeight(): void {
    let style: CSSStyleDeclaration

    if (isWindowNotDefined()) {
      return
    }

    style = getComputedStyle(this.textAreaElement)

    if (typeof this.computedHeight === 'undefined') {
      for (let property in style) {
        this.spanElement.style.cssText += `${property}:${style[property]};`
      }

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

    this.computedHeight = getComputedStyle(this.spanElement).height
    ElementLogger.verbose(this.uid, 'computeHeight', `The height has been computed.`, [this.computedHeight])
  }

  removeItem(item: string): void {
    if (this.single) {
      return
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = removeArrayItems(this.value, [item])
    ElementLogger.verbose(this.uid, 'removeItem', `The item has been removed.`, [item], this.value)

    this.touch()
  }

  clear(): void {
    this.value = undefined
    ElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, [this.value])

    if (this.multiple) {
      this.temporaryValue = ''
      ElementLogger.verbose(this.uid, 'clear', `The temporary value has been reset.`, [this.temporaryValue])
    }

    if (this.autosize) {
      this.computedHeight = undefined
      ElementLogger.verbose(this.uid, 'clear', `The computed height has been unset.`)
    }

    this.textAreaElement.value = ''
    ElementLogger.verbose(this.uid, 'clear', `The textarea element value has been reset.`)

    this.textAreaElement.focus()
    ElementLogger.verbose(this.uid, 'clear', `The textarea element has been focused.`)

    this.touch()
  }

  render() {
    return html`
      <textarea
        ?autofocus=${this.autofocus}
        @blur=${this.onBlur}
        cols=${ifdef(this.cols)}
        ?disabled=${this.disabled}
        @focus=${this.onFocus}
        @input=${this.onInput}
        @keyup=${this.onKeyUp}
        placeholder=${ifdef(this.placeholder)}
        ?readonly=${this.readonly}
        rows=${ifdef(this.rows)}
        style=${this.styleMap}
        .value=${this.textAreaElementValue}
      ></textarea>
      <span></span>
    `
  }

  get name(): ElementName {
    return ElementName.TEXTAREA
  }

  get single(): boolean {
    return !this.multiple
  }

  get styleMap(): DirectiveResult {
    return styleMap({
      ...this.styleInfo,
      minHeight: this.computedHeight,
      padding: this.padding,
      resize: this.resize
    })
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
      this.computeHeight()
    }
  }

  static properties: PropertyDeclarations = {
    autosize: { type: Boolean, reflect: true },
    cols: { type: Number, reflect: true },
    computedHeight: { type: String, state: true },
    multiple: { type: Boolean, reflect: true },
    padding: { type: String, reflect: true },
    placeholder: { type: String, reflect: true },
    resize: { type: String, reflect: true },
    rows: { type: Number, reflect: true },
    temporaryValue: { state: true },
    touchTrigger: { type: String, attribute: 'touch-trigger', reflect: true }
  }

  static queries: QueryDeclarations = {
    spanElement: { selector: 'span', shadow: true },
    textAreaElement: { selector: 'textarea', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([autosize]) textarea {
        overflow-y: hidden;
      }

      :host([normalized]) textarea {
        background: none;
        border: none;
        outline: none;
        padding: none;
      }

      textarea {
        all: inherit;
        box-sizing: content-box;
        word-break: break-word;
      }
    `
  ]
}

defineCustomElement('aracna-textarea', TextAreaElement)

export { TextAreaElement as AracnaTextAreaElement }

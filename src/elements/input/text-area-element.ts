import { Environment, isArray, parseNumber, removeArrayItems, wf } from '@aracna/core'
import {
  ElementName,
  QueryDeclarations,
  TextAreaElementEventMap,
  TextAreaElementResize,
  TextAreaElementTouchTrigger,
  TextAreaElementValue,
  WebElementLogger,
  defineCustomElement
} from '@aracna/web'
import { CSSResultGroup, PropertyDeclarations, css } from 'lit'
import { html } from 'lit-html'
import { DirectiveResult } from 'lit-html/directive.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { FormFieldElement } from '../core/form-field-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-textarea': TextAreaElement
  }
}

export class TextAreaElement<E extends TextAreaElementEventMap = TextAreaElementEventMap> extends FormFieldElement<E> {
  /**
   * PROPERTIES
   */
  autosize?: boolean
  cols?: number
  multiple?: boolean
  placeholder?: string
  resize?: TextAreaElementResize
  rows?: number
  touchTrigger?: TextAreaElementTouchTrigger

  /**
   * QUERIES
   */
  spanElement!: HTMLSpanElement
  textAreaElement!: HTMLTextAreaElement

  /**
   * STATES
   */
  computedHeight?: string
  temporaryValue: string = ''

  connectedCallback(): void {
    super.connectedCallback()
    wf(() => this.textAreaElement, 4).then(() => this.computeHeight())
  }

  onBlur(): void {
    this.focused = false
    WebElementLogger.verbose(this.uid, 'onBlur', `The textarea has been blurred.`)

    if (this.touchTrigger === 'blur') {
      this.touch()
    }
  }

  onFocus(): void {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The textarea has been focused.`)
  }

  onInput(): void {
    if (this.multiple) {
      this.temporaryValue = this.textAreaElement.value
      WebElementLogger.verbose(this.uid, 'onInput', `The temporary value has been set.`, [this.temporaryValue])
    }

    if (this.single) {
      this.value = this.textAreaElement.value
      WebElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])
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
      return WebElementLogger.warn(this.uid, 'onKeyUp', `The temporary value is empty.`)
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = [...this.value, this.temporaryValue]
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The item has been pushed.`, [this.temporaryValue], this.value)

    this.textAreaElement.value = ''
    WebElementLogger.verbose(this.uid, 'onKeyUp', `The textarea element value has been reset.`)

    this.touch()
  }

  computeHeight(): void {
    let style: CSSStyleDeclaration

    if (!this.autosize) {
      return
    }

    if (Environment.isWindowNotDefined) {
      return
    }

    style = getComputedStyle(this.textAreaElement)

    if (typeof this.computedHeight === 'undefined') {
      for (let property in style) {
        this.spanElement.style.cssText += `${property}:${style[property]};`
      }

      this.spanElement.style.minHeight = style.height
      this.spanElement.style.opacity = '0'
      this.spanElement.style.pointerEvents = 'none'
      this.spanElement.style.position = 'absolute'
      this.spanElement.style.whiteSpace = 'pre-wrap'
      this.spanElement.style.wordBreak = 'break-all'
    }

    this.spanElement.innerText = this.textAreaElement.value + 'a'
    this.spanElement.style.height = 'auto'
    this.spanElement.style.maxHeight = 'auto'
    this.spanElement.style.maxWidth = parseNumber(style.width) + parseNumber(style.paddingLeft) + parseNumber(style.paddingRight) + 'px'

    this.computedHeight = getComputedStyle(this.spanElement).height
    WebElementLogger.verbose(this.uid, 'computeHeight', `The height has been computed.`, [this.computedHeight])
  }

  removeItem(item: string): void {
    if (this.single) {
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

    if (this.autosize) {
      this.computedHeight = undefined
      WebElementLogger.verbose(this.uid, 'clear', `The computed height has been unset.`)
    }

    this.textAreaElement.value = ''
    WebElementLogger.verbose(this.uid, 'clear', `The textarea element value has been reset.`)

    this.textAreaElement.focus()
    WebElementLogger.verbose(this.uid, 'clear', `The textarea element has been focused.`)

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
        rows=${ifdef(this.rows)}
        style=${this.textAreaElementStyle}
        .value=${ifdef(this.textAreaElementValue)}
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

  get textAreaElementStyle(): DirectiveResult {
    return styleMap({
      ...this.styleInfo,
      minHeight: this.computedHeight,
      resize: this.resize
    })
  }

  get textAreaElementValue(): string | undefined {
    if (this.multiple) {
      return this.temporaryValue
    }

    return super.value
  }

  get value(): TextAreaElementValue {
    return super.value
  }

  set value(value: TextAreaElementValue) {
    super.value = value
    this.computeHeight()
  }

  static properties: PropertyDeclarations = {
    autosize: { type: Boolean, reflect: true },
    cols: { type: Number, reflect: true },
    computedHeight: { type: String, state: true },
    multiple: { type: Boolean, reflect: true },
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
      }

      span {
        opacity: 0;
        pointer-events: none;
        position: absolute;
        white-space: pre-wrap;
        word-break: break-all;
      }
    `
  ]
}

defineCustomElement('aracna-textarea', TextAreaElement)

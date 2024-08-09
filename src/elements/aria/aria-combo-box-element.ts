import { getLimitedNumber, isArray, removeArrayItems, typeahead, type TypeaheadPredicate } from '@aracna/core'
import { defineCustomElement, KeyboardEventKey, scrollElementIntoView } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import {
  AriaComboBoxButtonController,
  AriaComboBoxController,
  AriaComboBoxInputController,
  AriaComboBoxListController,
  AriaComboBoxOptionController
} from '../../controllers/aria-combo-box-controller.js'
import { DEFAULT_COMBOBOX_FILTER_OPTIONS_PREDICATE, DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaComboBoxButtonElementEventMap,
  AriaComboBoxElementEventMap,
  AriaComboBoxGroupElementEventMap,
  AriaComboBoxInputElementEventMap,
  AriaComboBoxListElementEventMap,
  AriaComboBoxOptionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { AriaComboBoxElementAutoComplete, AriaComboBoxElementFilterOptionsPredicate } from '../../definitions/types.js'
import { ComboBoxCollapseEvent } from '../../events/combo-box-collapse-event.js'
import { ComboBoxExpandEvent } from '../../events/combo-box-expand-event.js'
import { ComboBoxOptionSelectEvent } from '../../events/combo-box-option-select-event.js'
import { StateChangeEvent } from '../../events/state-change-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFloatingElement as FloatingElement } from '../core/floating-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-combobox': AriaComboBoxElement
    'aracna-aria-combobox-button': AriaComboBoxButtonElement
    'aracna-aria-combobox-group': AriaComboBoxGroupElement
    'aracna-aria-combobox-input': AriaComboBoxInputElement
    'aracna-aria-combobox-list': AriaComboBoxListElement
    'aracna-aria-combobox-option': AriaComboBoxOptionElement
  }
}

class AriaComboBoxElement<E extends AriaComboBoxElementEventMap = AriaComboBoxElementEventMap> extends FormControlElement<E> {
  protected aria: AriaComboBoxController = new AriaComboBoxController(this)

  /**
   * PROPERTIES
   */
  autocomplete?: AriaComboBoxElementAutoComplete
  expanded?: boolean
  multiple?: boolean
  scrollIntoViewBehaviour?: ScrollBehavior
  scrollIntoViewBlock?: ScrollLogicalPosition
  scrollIntoViewInline?: ScrollLogicalPosition
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaComboBoxOptionElement>

  /**
   * QUERIES
   */
  buttonElement?: AriaComboBoxButtonElement
  groupElement!: AriaComboBoxGroupElement
  inputElement?: AriaComboBoxInputElement
  listElement?: AriaComboBoxListElement
  focusedOptionElement?: AriaComboBoxOptionElement
  optionElements!: AriaComboBoxOptionElement[]
  selectedOptionElement?: AriaComboBoxOptionElement
  selectedOptionElements!: AriaComboBoxOptionElement[]

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('keydown', this.onKeyDown)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)
    this.listElement?.computePosition()
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (this.native) {
      return
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.END:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.ESCAPE:
      case KeyboardEventKey.SPACE:
        if (event.key === KeyboardEventKey.SPACE && this.inputElement) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        break
    }

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onKeyDown', `The combobox is disabled or readonly.`)
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
        if (this.collapsed) {
          this.expand()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The combobox has been expanded.`)

          if (this.selectedOptionElement) {
            this.selectedOptionElement.focus()
            ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The selected option has been focused.`)

            return
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_DOWN) {
            this.optionElements[0]?.focus()
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_UP) {
            this.optionElements[this.optionElements.length - 1]?.focus()
          }

          return
        }
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          if (this.inputElement) {
            this.focusedOptionElement?.blur()

            this.optionElements[0]?.focus()
            ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first option has been focused.`)
          }

          break
        }

        this.focusedOptionElement?.blur()

        this.optionElements[this.focusedOptionElementIndex + 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next option has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedOptionElementIndex <= 0) {
          if (this.inputElement) {
            this.focusedOptionElement?.blur()

            this.optionElements[this.optionElements.length - 1]?.focus()
            ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last option has been focused.`)
          }

          break
        }

        this.focusedOptionElement?.blur()

        this.optionElements[this.focusedOptionElementIndex - 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The previous option has been focused.`)

        break
      case KeyboardEventKey.END:
        this.focusedOptionElement?.blur()

        if (this.collapsed) {
          this.expand()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The combobox has been expanded.`)
        }

        this.optionElements[this.optionElements.length - 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last option has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.focusedOptionElement?.blur()

        if (this.collapsed) {
          this.expand()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The combobox has been expanded.`)
        }

        this.optionElements[0]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first option has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (event.key === KeyboardEventKey.SPACE && this.inputElement) {
          break
        }

        if (this.collapsed) {
          this.expand()
          this.selectedOptionElement?.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The combobox has been expanded and the selected option has been focused.`)

          break
        }

        if (this.focusedOptionElement) {
          this.focusedOptionElement?.click()
          break
        }

        if (this.expanded) {
          this.collapse()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The combobox has been collapsed.`)
        }

        break
      case KeyboardEventKey.ESCAPE:
        if (this.single && this.collapsed && this.inputElement) {
          switch (this.autocomplete) {
            case 'both':
            case 'inline':
            case 'list':
              this.selectedOptionElement?.unselect()
              ElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The selected option has been unselected.`)

              this.inputElement.value = undefined
              ElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The input value has been reset.`, [this.inputElement.value])
          }

          break
        }

        if (this.expanded) {
          this.collapse()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The combobox has been collapsed.`)

          if (this.single && this.inputElement && this.selectedOptionElement) {
            this.inputElement.value = this.selectedOptionElement.label ?? this.selectedOptionElement.innerText
            ElementLogger.verbose(this.uid, 'onBlur', `The value has been set to the selected option label.`, [this.inputElement.value])
          }

          this.focusedOptionElement?.blur()
        }

        break
      case KeyboardEventKey.PAGE_DOWN:
        this.focusedOptionElement?.blur()

        this.optionElements[getLimitedNumber(getLimitedNumber(this.focusedOptionElementIndex, { min: 0 }) + 10, { min: 0 })]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The option focus has jumped ~10 options ahead.`)

        break
      case KeyboardEventKey.PAGE_UP:
        this.focusedOptionElement?.blur()

        this.optionElements[getLimitedNumber(this.focusedOptionElementIndex - 10, { min: 0 })]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The option focus has jumped ~10 options behind.`)

        break
      default:
        if (this.inputElement || event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        if (this.collapsed) {
          this.expand()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'DEFAULT', `The combobox has been expanded.`)
        }

        typeahead<AriaComboBoxOptionElement>(this.uid, event.key)
          .setDebounceTime(this.typeaheadDebounceTime)
          .setItems(this.optionElements)
          .setListeners([])
          .setPredicate(this.typeaheadPredicate ?? DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE)
          .on('match', this.onTypeaheadMatch)

        break
    }
  }

  onTypeaheadMatch = (element: AriaComboBoxOptionElement) => {
    this.focusedOptionElement?.blur()

    element.focus()
    ElementLogger.verbose(this.uid, 'typeahead', `The matched element has been focused.`)
  }

  collapse(): void {
    this.expanded = false
    this.dispatchEvent(new ComboBoxCollapseEvent())
  }

  expand(): void {
    this.expanded = true
    this.dispatchEvent(new ComboBoxExpandEvent())
  }

  removeOption(value: any): void {
    if (this.single) {
      return
    }

    for (let option of this.selectedOptionElements) {
      if (option.value !== value) {
        continue
      }

      option.blur()
      option.unselect()
      ElementLogger.verbose(this.uid, 'removeOption', `The option has been blurred and unselected.`, option)

      break
    }

    this.value = isArray(this.value) ? this.value : []
    this.value = removeArrayItems(this.value, [value])

    ElementLogger.verbose(this.uid, 'removeOption', `The option has been removed.`, this.value)
  }

  clear(): void {
    if (this.inputElement) {
      this.inputElement.value = ''
      ElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`, [this.inputElement.value])
    }

    this.value = undefined
    ElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, [this.value])
  }

  findOptionElementByValue(value: any): AriaComboBoxOptionElement | undefined {
    return this.optionElements.find((optionElement: AriaComboBoxOptionElement) => optionElement.value === value)
  }

  findOptionElementLabelByValue(value: any): string | undefined {
    return this.findOptionElementByValue(value)?.label
  }

  filterOptions<T extends { value?: any }>(
    options: T[],
    predicate: AriaComboBoxElementFilterOptionsPredicate<T> = DEFAULT_COMBOBOX_FILTER_OPTIONS_PREDICATE
  ): T[] {
    switch (this.autocomplete) {
      case 'both':
      case 'inline':
      case 'list':
        return options.filter((option: T, index: number, options: T[]) => predicate(option, index, options, this.inputElement?.value ?? ''))
      default:
        return options
    }
  }

  isOptionElementFocused(element: AriaComboBoxOptionElement): boolean {
    return element === this.focusedOptionElement
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get editable(): boolean {
    return typeof this.inputElement !== 'undefined'
  }

  get focusedOptionElementIndex(): number {
    return this.focusedOptionElement ? this.optionElements.indexOf(this.focusedOptionElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX
  }

  get scrollIntoViewOptions(): ScrollIntoViewOptions {
    return {
      behavior: this.scrollIntoViewBehaviour,
      block: this.scrollIntoViewBlock,
      inline: this.scrollIntoViewInline
    }
  }

  get selectedOptionElementIndex(): number {
    return this.selectedOptionElement ? this.optionElements.indexOf(this.selectedOptionElement) : -1
  }

  get single(): boolean {
    return !this.multiple
  }

  get value(): any {
    return super.value
  }

  set value(value: any) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    autocomplete: { type: String, reflect: true },
    expanded: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true },
    scrollIntoViewBehaviour: {
      type: String,
      attribute: 'scroll-into-view-behaviour'
    },
    scrollIntoViewBlock: { type: String, attribute: 'scroll-into-view-block' },
    scrollIntoViewInline: {
      type: String,
      attribute: 'scroll-into-view-inline'
    },
    typeaheadDebounceTime: {
      type: Number,
      attribute: 'typeahead-debounce-time',
      reflect: true
    },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-combobox-button' },
    groupElement: { selector: 'aracna-aria-combobox-group' },
    inputElement: { selector: 'aracna-aria-combobox-input' },
    listElement: { selector: 'aracna-aria-combobox-list' },
    focusedOptionElement: { selector: 'aracna-aria-combobox-option[focused]' },
    optionElements: { selector: 'aracna-aria-combobox-option', all: true },
    selectedOptionElement: {
      selector: 'aracna-aria-combobox-option[selected]'
    },
    selectedOptionElements: {
      selector: 'aracna-aria-combobox-option[selected]',
      all: true
    }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        position: relative;
      }
    `
  ]
}

class AriaComboBoxGroupElement<E extends AriaComboBoxGroupElementEventMap = AriaComboBoxGroupElementEventMap> extends BaseElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_GROUP
  }
}

class AriaComboBoxButtonElement<E extends AriaComboBoxButtonElementEventMap = AriaComboBoxButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaComboBoxButtonController = new AriaComboBoxButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaComboBoxElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('click', this.onClick)
  }

  onBlur = (): void => {
    if (this.rootElement.single && this.rootElement.focusedOptionElement) {
      this.rootElement.selectedOptionElement?.unselect()
      this.rootElement.focusedOptionElement.select()
      this.rootElement.focusedOptionElement.blur()

      ElementLogger.verbose(this.uid, 'onBlur', `The focused option has been selected && blurred.`)
    }

    if (this.rootElement.expanded) {
      this.rootElement.collapse()
      ElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)
    }
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.collapsed) {
      this.rootElement.expand()
      ElementLogger.verbose(this.uid, 'onClick', `The combobox has been expanded.`)

      this.rootElement.selectedOptionElement?.focus()

      return
    }

    this.rootElement.collapse()
    ElementLogger.verbose(this.uid, 'onClick', `The combobox has been collapsed.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-combobox', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

class AriaComboBoxInputElement<E extends AriaComboBoxInputElementEventMap = AriaComboBoxInputElementEventMap> extends BaseElement<E> {
  protected aria: AriaComboBoxInputController = new AriaComboBoxInputController(this)

  /**
   * QUERIES
   */
  inputElement?: HTMLInputElement
  rootElement!: AriaComboBoxElement

  connectedCallback(): void {
    super.connectedCallback()

    this.inputElement?.addEventListener('blur', this.onBlur)
    this.inputElement?.addEventListener('click', this.onClick)
    this.inputElement?.addEventListener('input', this.onInput)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.inputElement?.removeEventListener('blur', this.onBlur)
    this.inputElement?.removeEventListener('click', this.onClick)
    this.inputElement?.removeEventListener('input', this.onInput)
  }

  onBlur = (): void => {
    this.rootElement.collapse()
    ElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)

    if (this.rootElement.single && this.inputElement && this.rootElement.selectedOptionElement) {
      this.value = this.rootElement.selectedOptionElement.label ?? this.rootElement.selectedOptionElement.innerText
      ElementLogger.verbose(this.uid, 'onBlur', `The value has been set to the selected option label.`)
    }
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    this.rootElement.expand()
    ElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded.`)

    this.rootElement.selectedOptionElement?.focus()
    ElementLogger.verbose(this.uid, 'onFocus', `The selected option has been focused.`)
  }

  onInput = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onInput', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.collapsed) {
      this.rootElement.expand()
      this.rootElement.selectedOptionElement?.focus()

      ElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded and the selected option has been focused.`)
    }

    this.value = this.inputElement?.value
    ElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])
  }

  focus(): void {
    this.inputElement?.focus()
  }

  clear(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'clear', `The combobox is disabled or readonly.`)
    }

    if (this.inputElement) {
      this.value = ''
      ElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`)
    }
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_INPUT
  }

  get value(): string | undefined {
    return this.inputElement?.value
  }

  set value(value: string | undefined) {
    let old: string | undefined

    if (this.inputElement) {
      this.inputElement.value = value ?? ''
    }

    this.requestUpdate('value', old)
    this.dispatchEvent(new StateChangeEvent('value', undefined, this.value))
  }

  static properties: PropertyDeclarations = {
    value: { state: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'aracna-aria-combobox', closest: true }
  }
}

class AriaComboBoxListElement<E extends AriaComboBoxListElementEventMap = AriaComboBoxListElementEventMap> extends FloatingElement<E> {
  protected aria: AriaComboBoxListController = new AriaComboBoxListController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaComboBoxElement

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_LIST
  }

  get referenceElement(): AriaComboBoxGroupElement {
    return this.rootElement.groupElement
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-combobox', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        left: 0;
        overflow-y: auto;
        position: absolute;
        right: 0;
        z-index: 1;
      }
    `
  ]
}

class AriaComboBoxOptionElement<E extends AriaComboBoxOptionElementEventMap = AriaComboBoxOptionElementEventMap> extends BaseElement<E> {
  protected aria: AriaComboBoxOptionController = new AriaComboBoxOptionController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  selected?: boolean
  value?: any

  /**
   * QUERIES
   */
  listElement!: AriaComboBoxListElement
  rootElement!: AriaComboBoxElement

  /**
   * INTERNAL
   */
  _label?: string

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('mousedown', this.onMouseDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('mousedown', this.onMouseDown)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (name === 'focused' && typeof value === 'string') {
      scrollElementIntoView(this.listElement, this, this.rootElement.scrollIntoViewOptions)
      ElementLogger.verbose(this.uid, ' attributeChangedCallback', `The option has been scrolled into view.`)
    }
  }

  blur(): void {
    this.focused = false
  }

  focus(options?: FocusOptions | undefined): void {
    this.focused = true
  }

  select(): void {
    this.selected = true
    this.dispatchEvent(new ComboBoxOptionSelectEvent(this, this.value))

    if (this.rootElement.single) {
      this.rootElement.value = this.value
    }

    if (this.rootElement.multiple) {
      this.rootElement.value = isArray(this.rootElement.value) ? this.rootElement.value : []
      this.rootElement.value = [...this.rootElement.value, this.value]
    }

    this.rootElement.touch()
  }

  unselect(): void {
    this.selected = false

    if (this.rootElement.single) {
      this.rootElement.value = undefined
    }

    if (this.rootElement.multiple) {
      this.rootElement.value = isArray(this.rootElement.value) ? this.rootElement.value : []
      this.rootElement.value = removeArrayItems(this.rootElement.value, [this.value])
    }

    this.rootElement.touch()
  }

  onClick(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.single) {
      this.rootElement.focusedOptionElement?.blur()
      this.rootElement.selectedOptionElement?.unselect()

      this.select()
      ElementLogger.verbose(this.uid, 'onClick', `The option has been selected.`)

      this.rootElement.collapse()
      ElementLogger.verbose(this.uid, 'onClick', `The combobox has been collapsed.`)

      if (this.rootElement.inputElement) {
        this.rootElement.inputElement.value = this.label ?? this.innerText
        this.rootElement.inputElement.focus()

        return
      }

      this.rootElement.buttonElement?.focus()
    }

    if (this.rootElement.multiple) {
      if (this.selected) {
        this.unselect()
        ElementLogger.verbose(this.uid, 'onClick', `The option has been unselected.`)

        return
      }

      this.select()
      ElementLogger.verbose(this.uid, 'onClick', `The option has been selected.`)
    }
  }

  onMouseDown = (event: MouseEvent): void => {
    event.preventDefault()
  }

  get label(): string | undefined {
    return this._label
  }

  set label(label: string | undefined) {
    let old: string | undefined

    old = this._label
    this._label = label

    this.requestUpdate('label', old)
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_OPTION
  }

  get unselected(): boolean {
    return !this.selected
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    selected: { type: Boolean, reflect: true },
    value: {}
  }

  static queries: QueryDeclarations = {
    listElement: { selector: 'aracna-aria-combobox-list', closest: true },
    rootElement: { selector: 'aracna-aria-combobox', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

defineCustomElement('aracna-aria-combobox', AriaComboBoxElement)
defineCustomElement('aracna-aria-combobox-button', AriaComboBoxButtonElement)
defineCustomElement('aracna-aria-combobox-group', AriaComboBoxGroupElement)
defineCustomElement('aracna-aria-combobox-input', AriaComboBoxInputElement)
defineCustomElement('aracna-aria-combobox-list', AriaComboBoxListElement)
defineCustomElement('aracna-aria-combobox-option', AriaComboBoxOptionElement)

export {
  AriaComboBoxButtonElement as AracnaAriaComboBoxButtonElement,
  AriaComboBoxElement as AracnaAriaComboBoxElement,
  AriaComboBoxGroupElement as AracnaAriaComboBoxGroupElement,
  AriaComboBoxInputElement as AracnaAriaComboBoxInputElement,
  AriaComboBoxListElement as AracnaAriaComboBoxListElement,
  AriaComboBoxOptionElement as AracnaAriaComboBoxOptionElement
}

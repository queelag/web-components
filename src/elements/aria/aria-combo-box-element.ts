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
import { ComboBoxOptionUnselectEvent } from '../../events/combo-box-option-unselect-event.js'
import { StateChangeEvent } from '../../events/state-change-event.js'
import { gkek } from '../../functions/gkek.js'
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
   * Properties
   */
  /** */
  autocomplete?: AriaComboBoxElementAutoComplete
  expanded?: boolean
  multiple?: boolean
  scrollIntoViewBehaviour?: ScrollBehavior
  scrollIntoViewBlock?: ScrollLogicalPosition
  scrollIntoViewInline?: ScrollLogicalPosition
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaComboBoxOptionElement>

  /**
   * Queries
   */
  /** */
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

    if (this.listElement) {
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Computing the list position.`)
      this.listElement.computePosition()
    }
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
      case KeyboardEventKey.ARROW_UP: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.collapsed) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the combobox.`)
          this.expand()

          if (this.selectedOptionElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the selected option.`, this.selectedOptionElement)
            this.selectedOptionElement.focus()

            return
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_DOWN) {
            option = this.optionElements[0]
            if (!option) break

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first option.`, option)
            option.focus()
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_UP) {
            option = this.optionElements[this.optionElements.length - 1]
            if (!option) break

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last option.`, option)
            option.focus()
          }

          return
        }

        break
      }
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          if (!this.inputElement) {
            break
          }

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement?.blur()

          option = this.optionElements[0]
          if (!option) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first option element.`, option)
          option.focus()

          break
        }

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement.blur()
        }

        option = this.optionElements[this.focusedOptionElementIndex + 1]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the next option element.`, option)
        option.focus()

        break
      }
      case KeyboardEventKey.ARROW_UP: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElementIndex <= 0) {
          if (!this.inputElement) {
            break
          }

          if (this.focusedOptionElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
            this.focusedOptionElement.blur()
          }

          option = this.optionElements[this.optionElements.length - 1]
          if (!option) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last option element.`, option)
          option.focus()

          break
        }

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement.blur()
        }

        option = this.optionElements[this.focusedOptionElementIndex - 1]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the previous option element.`, option)
        option.focus()

        break
      }
      case KeyboardEventKey.END: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement?.blur()
        }

        if (this.collapsed) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the combobox.`)
          this.expand()
        }

        option = this.optionElements[this.optionElements.length - 1]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last option element.`, option)
        option.focus()

        break
      }
      case KeyboardEventKey.HOME: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement?.blur()
        }

        if (this.collapsed) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the combobox.`)
          this.expand()
        }

        option = this.optionElements[0]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first option element.`, option)
        option.focus()

        break
      }
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (event.key === KeyboardEventKey.SPACE && this.inputElement) {
          break
        }

        if (this.collapsed) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the combobox.`)
          this.expand()

          if (this.selectedOptionElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the selected option element.`, this.selectedOptionElement)
            this.selectedOptionElement.focus()
          }

          break
        }

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement.click()

          break
        }

        if (this.expanded) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the combobox.`)
          this.collapse()
        }

        break
      case KeyboardEventKey.ESCAPE:
        if (this.single && this.collapsed && this.inputElement) {
          switch (this.autocomplete) {
            case 'both':
            case 'inline':
            case 'list':
              if (this.selectedOptionElement) {
                ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Unselecting the selected option.`, this.selectedOptionElement)
                this.selectedOptionElement.unselect()
              }

              this.inputElement.value = undefined
              ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The input value has been reset.`, [this.inputElement.value])
          }

          break
        }

        if (this.expanded) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the combobox.`)
          this.collapse()

          if (this.single && this.inputElement && this.selectedOptionElement) {
            this.inputElement.value = this.selectedOptionElement.label ?? this.selectedOptionElement.innerText
            ElementLogger.verbose(this.uid, 'onBlur', `The value has been set to the selected option label.`, [this.inputElement.value])
          }

          if (this.focusedOptionElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
            this.focusedOptionElement.blur()
          }
        }

        break
      case KeyboardEventKey.PAGE_DOWN: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement.blur()
        }

        option = this.optionElements[getLimitedNumber(getLimitedNumber(this.focusedOptionElementIndex, { min: 0 }) + 10, { min: 0 })]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the option 10~ places ahead.`, option)
        option.focus()

        break
      }
      case KeyboardEventKey.PAGE_UP: {
        let option: AriaComboBoxOptionElement | undefined

        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option element.`, this.focusedOptionElement)
          this.focusedOptionElement.blur()
        }

        option = this.optionElements[getLimitedNumber(this.focusedOptionElementIndex - 10, { min: 0 })]
        if (!option) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the option 10~ places behind.`, option)
        option.focus()

        break
      }
      default:
        if (this.inputElement || event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        if (this.collapsed) {
          ElementLogger.verbose(this.uid, 'onKeyDown', `Expanding the combobox.`)
          this.expand()
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
    if (this.focusedOptionElement) {
      ElementLogger.verbose(this.uid, 'typeahead', `Blurring the focused option element.`, this.focusedOptionElement)
      this.focusedOptionElement.blur()
    }

    ElementLogger.verbose(this.uid, 'typeahead', `Focusing the matched option element.`, element)
    element.focus()
  }

  collapse(): void {
    this.expanded = false
    ElementLogger.verbose(this.uid, 'collapse', `The combobox has been collapsed.`)

    this.dispatchEvent(new ComboBoxCollapseEvent())
    ElementLogger.verbose(this.uid, 'collapse', `The "collapse" event has been dispatched.`)
  }

  expand(): void {
    this.expanded = true
    ElementLogger.verbose(this.uid, 'expand', `The combobox has been expanded.`)

    this.dispatchEvent(new ComboBoxExpandEvent())
    ElementLogger.verbose(this.uid, 'expand', `The "expand" event has been dispatched.`)
  }

  removeOption(value: any): void {
    let array: any[]

    if (this.single) {
      return ElementLogger.warn(this.uid, 'removeOption', `The combobox is not multiple.`)
    }

    for (let option of this.selectedOptionElements) {
      if (option.value !== value) {
        continue
      }

      ElementLogger.verbose(this.uid, 'removeOption', `Blurring an option.`, option)
      option.blur()

      ElementLogger.verbose(this.uid, 'removeOption', `Unselecting an option.`, option)
      option.unselect()

      break
    }

    array = isArray(this.value) ? this.value : []
    array = removeArrayItems(array, [value])

    ElementLogger.verbose(this.uid, 'removeOption', `Removing the option from the value.`, value)
    this.setValue(array)
  }

  clear(): void {
    super.clear()

    if (this.inputElement) {
      this.inputElement.value = ''
      ElementLogger.verbose(this.uid, 'clear', `The input value has been reset.`, [this.inputElement.value])
    }
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
   * Queries
   */
  /** */
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
      if (this.rootElement.selectedOptionElement) {
        ElementLogger.verbose(this.uid, 'onBlur', `Unselecting the selected option.`, this.rootElement.selectedOptionElement)
        this.rootElement.selectedOptionElement.unselect()
      }

      ElementLogger.verbose(this.uid, 'onBlur', `Selecting the focused option.`, this.rootElement.focusedOptionElement)
      this.rootElement.focusedOptionElement.select()

      ElementLogger.verbose(this.uid, 'onBlur', `Blurring the focused option.`, this.rootElement.focusedOptionElement)
      this.rootElement.focusedOptionElement.blur()
    }

    if (this.rootElement.expanded) {
      ElementLogger.verbose(this.uid, 'onBlur', `Collapsing the combobox.`)
      this.rootElement.collapse()
    }
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.collapsed) {
      ElementLogger.verbose(this.uid, 'onClick', `Expanding the combobox.`)
      this.rootElement.expand()

      if (this.rootElement.selectedOptionElement) {
        ElementLogger.verbose(this.uid, 'onClick', `Focusing the selected option.`, this.rootElement.selectedOptionElement)
        this.rootElement.selectedOptionElement?.focus()
      }

      return
    }

    ElementLogger.verbose(this.uid, 'onClick', `Collapsing the combobox.`)
    this.rootElement.collapse()
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
   * Queries
   */
  /** */
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
      ElementLogger.verbose(this.uid, 'onInput', `Expanding the combobox.`)
      this.rootElement.expand()

      if (this.rootElement.selectedOptionElement) {
        ElementLogger.verbose(this.uid, 'onInput', `Focusing the selected option.`, this.rootElement.selectedOptionElement)
        this.rootElement.selectedOptionElement.focus()
      }

      ElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded and the selected option has been focused.`)
    }

    this.value = this.inputElement?.value
    ElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])
  }

  focus(): void {
    ElementLogger.verbose(this.uid, 'focus', `Focusing the input element.`, this.inputElement)
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
   * Queries
   */
  /** */
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
   * Properties
   */
  /** */
  focused?: boolean
  selected?: boolean
  value?: any

  /**
   * Queries
   */
  /** */
  listElement!: AriaComboBoxListElement
  rootElement!: AriaComboBoxElement

  /**
   * Internals
   */
  /** */
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
    ElementLogger.verbose(this.uid, 'blur', `The option has been blurred.`)

    this.dispatchEvent(new FocusEvent('blur'))
  }

  focus(options?: FocusOptions | undefined): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'focus', `The option has been focused.`)

    this.dispatchEvent(new FocusEvent('focus'))
  }

  select(): void {
    this.selected = true
    ElementLogger.verbose(this.uid, 'select', `The option has been selected.`)

    if (this.rootElement.single) {
      ElementLogger.verbose(this.uid, 'select', `Setting the value.`)
      this.rootElement.setValue(this.value)
    }

    if (this.rootElement.multiple) {
      let value: any[]

      value = isArray(this.rootElement.value) ? this.rootElement.value : []
      value = [...value, this.value]

      ElementLogger.verbose(this.uid, 'select', `Adding the option to the value.`, this.value)
      this.rootElement.setValue(value)
    }

    ElementLogger.verbose(this.uid, 'select', `Touching the combobox.`)
    this.rootElement.touch()

    this.dispatchEvent(new ComboBoxOptionSelectEvent(this.value))
    ElementLogger.verbose(this.uid, 'select', `The "select" event has been dispatched.`)
  }

  unselect(): void {
    this.selected = false
    ElementLogger.verbose(this.uid, 'unselect', `The option has been unselected.`)

    if (this.rootElement.single) {
      ElementLogger.verbose(this.uid, 'unselect', `Clearing the value.`)
      this.rootElement.clear()
    }

    if (this.rootElement.multiple) {
      let value: any[]

      value = isArray(this.rootElement.value) ? this.rootElement.value : []
      value = removeArrayItems(value, [this.value])

      ElementLogger.verbose(this.uid, 'unselect', `Removing the option from the value.`, this.value)
      this.rootElement.setValue(value)
    }

    ElementLogger.verbose(this.uid, 'unselect', `Touching the combobox.`)
    this.rootElement.touch()

    this.dispatchEvent(new ComboBoxOptionUnselectEvent(this.value))
    ElementLogger.verbose(this.uid, 'unselect', `The "unselect" event has been dispatched.`)
  }

  onClick(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.single) {
      if (this.rootElement.focusedOptionElement) {
        ElementLogger.verbose(this.uid, 'onClick', `Blurring the focused option element.`, this.rootElement.focusedOptionElement)
        this.rootElement.focusedOptionElement.blur()
      }

      if (this.rootElement.selectedOptionElement) {
        ElementLogger.verbose(this.uid, 'onClick', `Unselecting the selected option element.`, this.rootElement.selectedOptionElement)
        this.rootElement.selectedOptionElement.unselect()
      }

      ElementLogger.verbose(this.uid, 'onClick', `Selecting the option.`)
      this.select()

      ElementLogger.verbose(this.uid, 'onClick', `Collapsing the combobox.`)
      this.rootElement.collapse()

      if (this.rootElement.inputElement) {
        this.rootElement.inputElement.value = this.label ?? this.innerText
        ElementLogger.verbose(this.uid, 'onClick', `The input value has been set.`, [this.rootElement.inputElement.value])

        this.rootElement.inputElement.focus()
        ElementLogger.verbose(this.uid, 'onClick', `The input has been focused.`)

        return
      }

      if (this.rootElement.buttonElement) {
        this.rootElement.buttonElement.focus()
        ElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
      }
    }

    if (this.rootElement.multiple) {
      if (this.selected) {
        ElementLogger.verbose(this.uid, 'onClick', `Unselecting the option.`)
        return this.unselect()
      }

      ElementLogger.verbose(this.uid, 'onClick', `Selecting the option.`)
      this.select()
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

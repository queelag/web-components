import { getLimitedNumber, Typeahead, TypeaheadPredicate } from '@aracna/core'
import {
  AriaComboBoxButtonElementEventMap,
  AriaComboBoxElementAutoComplete,
  AriaComboBoxElementEventMap,
  AriaComboBoxGroupElementEventMap,
  AriaComboBoxInputElementEventMap,
  AriaComboBoxListElementEventMap,
  AriaComboBoxOptionElementEventMap,
  DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE,
  defineCustomElement,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  scrollElementIntoView,
  StateChangeEvent,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import {
  AriaComboBoxButtonController,
  AriaComboBoxController,
  AriaComboBoxInputController,
  AriaComboBoxListController,
  AriaComboBoxOptionController
} from '../../controllers/aria-combo-box-controller.js'
import { BaseElement } from '../core/base-element.js'
import { FloatingElement } from '../core/floating-element.js'
import { FormFieldElement } from '../core/form-field-element.js'

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

export class AriaComboBoxElement<E extends AriaComboBoxElementEventMap = AriaComboBoxElementEventMap> extends FormFieldElement<E> {
  protected aria: AriaComboBoxController = new AriaComboBoxController(this)

  /**
   * PROPERTIES
   */
  autocomplete?: AriaComboBoxElementAutoComplete
  expanded?: boolean
  multiple?: boolean
  scrollIntoViewOptions?: ScrollIntoViewOptions
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

  /**
   * INTERNAL
   */
  private typeahead: Typeahead<AriaComboBoxOptionElement> = new Typeahead(this.onTypeaheadMatch, DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE)

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
    this.listElement?.computePosition && this.listElement?.computePosition()

    if (name === 'typeaheadPredicate') {
      this.typeahead = new Typeahead(this.onTypeaheadMatch, this.typeaheadPredicate ?? DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE)
    }
  }

  onTypeaheadMatch(element: AriaComboBoxOptionElement) {
    this.focusedOptionElement?.blur()

    element.focus()
    WebElementLogger.verbose(this.uid, 'typeahead', `The matched element has been focused.`)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.END:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.ESCAPE:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()
    }

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onKeyDown', `The combobox is disabled or readonly.`)
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The combobox has been expanded.`)

          if (this.selectedOptionElement) {
            this.selectedOptionElement.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The selected option has been focused.`)

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
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first option has been focused.`)
          }

          break
        }

        this.focusedOptionElement?.blur()

        this.optionElements[this.focusedOptionElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next option has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedOptionElementIndex <= 0) {
          if (this.inputElement) {
            this.focusedOptionElement?.blur()

            this.optionElements[this.optionElements.length - 1]?.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last option has been focused.`)
          }

          break
        }

        this.focusedOptionElement?.blur()

        this.optionElements[this.focusedOptionElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The previous option has been focused.`)

        break
      case KeyboardEventKey.END:
        this.focusedOptionElement?.blur()

        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The combobox has been expanded.`)
        }

        this.optionElements[this.optionElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last option has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.focusedOptionElement?.blur()

        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The combobox has been expanded.`)
        }

        this.optionElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first option has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.collapsed) {
          this.expand()
          this.selectedOptionElement?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The combobox has been expanded and the selected option has been focused.`)

          break
        }

        if (this.focusedOptionElement) {
          this.focusedOptionElement?.click()
          break
        }

        if (this.expanded) {
          this.collapse()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The combobox has been collapsed.`)
        }

        break
      case KeyboardEventKey.ESCAPE:
        if (this.collapsed && this.inputElement) {
          switch (this.autocomplete) {
            case 'both':
            case 'inline':
            case 'list':
              this.inputElement.clear()
              WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The input value has been reset.`)
          }

          break
        }

        if (this.expanded) {
          this.collapse()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The combobox has been collapsed.`)

          /**
           * REFACTOR TO NOT USE INNERTEXT
           */
          if (this.inputElement?.inputElement && this.selectedOptionElement) {
            this.inputElement.inputElement.value = this.selectedOptionElement.innerText
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The input value has been set to the selected option inner text.`)
          }

          this.focusedOptionElement?.blur()
        }

        break
      case KeyboardEventKey.PAGE_DOWN:
        this.focusedOptionElement?.blur()

        this.optionElements[getLimitedNumber(getLimitedNumber(this.focusedOptionElementIndex, 0) + 10, 0)]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The option focus has jumped ~10 options ahead.`)

        break
      case KeyboardEventKey.PAGE_UP:
        this.focusedOptionElement?.blur()

        this.optionElements[getLimitedNumber(this.focusedOptionElementIndex - 10, 0)]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The option focus has jumped ~10 options behind.`)

        break
      default:
        if (this.inputElement || event.key.length !== 1) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'DEFAULT', `The combobox has been expanded.`)
        }

        this.typeahead.handle(event.key, this.optionElements, this.typeaheadDebounceTime)

        break
    }
  }

  collapse(): void {
    this.expanded = false
  }

  expand(): void {
    this.expanded = true
  }

  filterOptions<T>(options: T[], predicate: (option: T, index: number, options: T[]) => unknown): T[] {
    switch (this.autocomplete) {
      case 'both':
      case 'inline':
      case 'list':
        return options.filter(predicate)
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

  get selectedOptionElementIndex(): number {
    return this.selectedOptionElement ? this.optionElements.indexOf(this.selectedOptionElement) : -1
  }

  static properties: PropertyDeclarations = {
    autocomplete: { type: String, reflect: true },
    expanded: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true },
    scrollIntoViewOptions: { type: Object, attribute: 'scroll-into-view-options' },
    typeaheadDebounceTime: { type: Number, attribute: 'typeahead-debounce-time', reflect: true },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-combobox-button' },
    groupElement: { selector: 'aracna-aria-combobox-group' },
    inputElement: { selector: 'aracna-aria-combobox-input' },
    listElement: { selector: 'aracna-aria-combobox-list' },
    focusedOptionElement: { selector: 'aracna-aria-combobox-option[focused]' },
    optionElements: { selector: 'aracna-aria-combobox-option', all: true },
    selectedOptionElement: { selector: 'aracna-aria-combobox-option[selected]' }
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

export class AriaComboBoxGroupElement<E extends AriaComboBoxGroupElementEventMap = AriaComboBoxGroupElementEventMap> extends BaseElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_GROUP
  }
}

export class AriaComboBoxButtonElement<E extends AriaComboBoxButtonElementEventMap = AriaComboBoxButtonElementEventMap> extends BaseElement<E> {
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
    if (this.rootElement.focusedOptionElement) {
      this.rootElement.selectedOptionElement?.unselect()
      this.rootElement.focusedOptionElement.select()
      this.rootElement.focusedOptionElement.blur()

      WebElementLogger.verbose(this.uid, 'onBlur', `The focused option has been selected && blurred.`)
    }

    if (this.rootElement.expanded) {
      this.rootElement.collapse()
      WebElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)
    }
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    this.rootElement.expanded = !this.rootElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The combobox has been ${this.rootElement.expanded ? 'expanded' : 'collapsed'}.`)

    if (this.rootElement.expanded) {
      this.rootElement.selectedOptionElement?.focus()
    }
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

export class AriaComboBoxInputElement<E extends AriaComboBoxInputElementEventMap = AriaComboBoxInputElementEventMap> extends BaseElement<E> {
  protected aria: AriaComboBoxInputController = new AriaComboBoxInputController(this)

  /**
   * QUERIES
   */
  inputElement?: HTMLInputElement
  rootElement!: AriaComboBoxElement

  /**
   * STATES
   */
  value?: string

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
    WebElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)

    /**
     * REFACTOR TO NOT USE INNERTEXT
     */
    // if (this.inputElement && this.rootElement.selectedOptionElement) {
    //   this.inputElement.value = this.rootElement.selectedOptionElement.innerText
    //   WebElementLogger.verbose(this.uid, 'onBlur', `The value has been set to the selected option inner text.`)
    // }
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    this.rootElement.expand()
    WebElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded.`)

    this.rootElement.selectedOptionElement?.focus()
    WebElementLogger.verbose(this.uid, 'onFocus', `The selected option has been focused.`)
  }

  onInput = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onInput', `The combobox is disabled or readonly.`)
    }

    if (this.rootElement.collapsed) {
      this.rootElement.expand()
      this.rootElement.selectedOptionElement?.focus()

      WebElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded and the selected option has been focused.`)
    }

    this.value = this.inputElement?.value
    WebElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])

    this.rootElement.dispatchEvent(new StateChangeEvent('value', undefined, this.value))
  }

  clear(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'clear', `The combobox is disabled or readonly.`)
    }

    if (this.inputElement) {
      this.inputElement.value = ''
    }
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_INPUT
  }

  static properties: PropertyDeclarations = {
    value: { state: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'aracna-aria-combobox', closest: true }
  }
}

export class AriaComboBoxListElement<E extends AriaComboBoxListElementEventMap = AriaComboBoxListElementEventMap> extends FloatingElement<E> {
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

export class AriaComboBoxOptionElement<E extends AriaComboBoxOptionElementEventMap = AriaComboBoxOptionElementEventMap> extends BaseElement<E> {
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

    if (name === 'focused' && value !== null) {
      scrollElementIntoView(this.listElement, this, this.rootElement.scrollIntoViewOptions)
      WebElementLogger.verbose(this.uid, ' attributeChangedCallback', `The option has been scrolled into view.`)
    }

    if (name === 'selected' && value !== null && this.rootElement.inputElement?.inputElement) {
      this.rootElement.inputElement.inputElement.value = this.value
      WebElementLogger.verbose(this.uid, 'attributeChangedCallback', `The input value has been set to the value of this option.`, [this.value])
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
  }

  unselect(): void {
    this.selected = false
  }

  onClick(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The combobox is disabled or readonly.`)
    }

    this.rootElement.focusedOptionElement?.blur()
    this.rootElement.selectedOptionElement?.unselect()

    this.select()
    WebElementLogger.verbose(this.uid, 'onClick', `The option has been selected.`)

    this.rootElement.expanded = false
    WebElementLogger.verbose(this.uid, 'onClick', `The combobox has been collapsed.`)

    if (this.rootElement.inputElement) {
      this.rootElement.inputElement.inputElement?.focus()
      return
    }

    this.rootElement.buttonElement?.focus()
  }

  onMouseDown = (event: MouseEvent): void => {
    event.preventDefault()
  }

  get name(): ElementName {
    return ElementName.ARIA_COMBOBOX_OPTION
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
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

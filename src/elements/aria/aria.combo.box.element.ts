import { getLimitedNumber } from '@queelag/core'
import {
  AriaComboBoxElementAutoComplete,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  scrollElementIntoView,
  StateChangedEvent,
  Typeahead,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import {
  AriaComboBoxButtonController,
  AriaComboBoxController,
  AriaComboBoxInputController,
  AriaComboBoxListController,
  AriaComboBoxOptionController
} from '../../controllers/aria.combo.box.controller'
import { BaseElement } from '../core/base.element'
import { FloatingElement } from '../core/floating.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-combobox': AriaComboBoxElement
    'q-aria-combobox-button': AriaComboBoxButtonElement
    'q-aria-combobox-group': AriaComboBoxGroupElement
    'q-aria-combobox-input': AriaComboBoxInputElement
    'q-aria-combobox-list': AriaComboBoxListElement
    'q-aria-combobox-option': AriaComboBoxOptionElement
  }
}

export class AriaComboBoxElement extends BaseElement {
  protected aria: AriaComboBoxController = new AriaComboBoxController(this)

  /**
   * PROPERTIES
   */
  autocomplete?: AriaComboBoxElementAutoComplete
  expanded?: boolean
  scrollIntoViewOptions?: ScrollIntoViewOptions

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
  private typeahead: Typeahead<AriaComboBoxOptionElement> = new Typeahead((element: AriaComboBoxOptionElement) => {
    this.blurFocusedOptionElement()

    element.focused = true
    WebElementLogger.verbose(this.uid, 'typeahead', `The matched element has been focused.`)
  })

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)
    this.listElement?.computePosition && this.listElement?.computePosition()
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

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The combobox has been expanded.`)

          if (this.selectedOptionElement) {
            this.focusSelectedOptionElement()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The selected option has been focused.`)

            return
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_DOWN) {
            this.optionElements[0].focused = true
          }

          if (this.inputElement && event.key === KeyboardEventKey.ARROW_UP) {
            this.optionElements[this.optionElements.length - 1].focused = true
          }

          return
        }
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          if (this.inputElement) {
            this.blurFocusedOptionElement()

            this.optionElements[0].focused = true
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first option has been focused.`)
          }

          break
        }

        this.blurFocusedOptionElement()

        this.optionElements[this.focusedOptionElementIndex + 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next option has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedOptionElementIndex <= 0) {
          if (this.inputElement) {
            this.blurFocusedOptionElement()

            this.optionElements[this.optionElements.length - 1].focused = true
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last option has been focused.`)
          }

          break
        }

        this.blurFocusedOptionElement()

        this.optionElements[this.focusedOptionElementIndex - 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The previous option has been focused.`)

        break
      case KeyboardEventKey.END:
        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The combobox has been expanded.`)
        }

        this.optionElements[this.optionElements.length - 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last option has been focused.`)

        break
      case KeyboardEventKey.HOME:
        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The combobox has been expanded.`)
        }

        this.optionElements[0].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first option has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.collapsed) {
          this.expand()
          this.focusSelectedOptionElement()
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

          this.blurFocusedOptionElement()
        }

        break
      case KeyboardEventKey.PAGE_DOWN:
        this.blurFocusedOptionElement()

        this.optionElements[getLimitedNumber(getLimitedNumber(this.focusedOptionElementIndex, 0) + 10, 0)].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The option focus has jumped ~10 options ahead.`)

        break
      case KeyboardEventKey.PAGE_UP:
        this.blurFocusedOptionElement()

        this.optionElements[getLimitedNumber(this.focusedOptionElementIndex - 10, 0)].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The option focus has jumped ~10 options behind.`)

        break
      default:
        if (this.inputElement || event.key.length > 1) {
          break
        }

        if (this.collapsed) {
          this.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'DEFAULT', `The combobox has been expanded.`)
        }

        this.typeahead.handle(event, this.optionElements)

        break
    }
  }

  blurFocusedOptionElement(): void {
    if (this.focusedOptionElement) {
      this.focusedOptionElement.focused = false
    }
  }

  collapse(): void {
    this.expanded = false
  }

  expand(): void {
    this.expanded = true
  }

  filterOptions<T>(options: T[], predicate: (value: T, index: number, array: T[]) => unknown): T[] {
    switch (this.autocomplete) {
      case 'both':
      case 'inline':
      case 'list':
        return options.filter(predicate)
      default:
        return options
    }
  }

  focusSelectedOptionElement(): void {
    if (this.selectedOptionElement) {
      this.selectedOptionElement.focused = true
    }
  }

  selectFocusedOptionElement(): void {
    if (this.focusedOptionElement) {
      this.focusedOptionElement.selected = true
    }
  }

  unselectSelectedOptionElement(): void {
    if (this.selectedOptionElement) {
      this.selectedOptionElement.selected = false
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
    return ElementName.COMBOBOX
  }

  get selectedOptionElementIndex(): number {
    return this.selectedOptionElement ? this.optionElements.indexOf(this.selectedOptionElement) : -1
  }

  static properties: PropertyDeclarations = {
    autocomplete: { type: String, reflect: true },
    expanded: { type: Boolean, reflect: true },
    scrollIntoViewOptions: { type: Object, attribute: 'scroll-into-view-options' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-combobox-button' },
    groupElement: { selector: 'q-aria-combobox-group' },
    inputElement: { selector: 'q-aria-combobox-input' },
    listElement: { selector: 'q-aria-combobox-list' },
    focusedOptionElement: { selector: 'q-aria-combobox-option[focused]' },
    optionElements: { selector: 'q-aria-combobox-option', all: true },
    selectOptionElement: { selector: 'q-aria-combobox-option[selected]' }
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

export class AriaComboBoxGroupElement extends BaseElement {
  get name(): ElementName {
    return ElementName.COMBOBOX_GROUP
  }
}

export class AriaComboBoxButtonElement extends BaseElement {
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
      this.rootElement.unselectSelectedOptionElement()
      this.rootElement.selectFocusedOptionElement()
      this.rootElement.blurFocusedOptionElement()

      WebElementLogger.verbose(this.uid, 'onBlur', `The focused option has been selected && blurred.`)
    }

    if (this.rootElement.expanded) {
      this.rootElement.collapse()
      WebElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)
    }
  }

  onClick = (): void => {
    this.rootElement.expanded = !this.rootElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The combobox has been ${this.rootElement.expanded ? 'expanded' : 'collapsed'}.`)

    if (this.rootElement.expanded) {
      this.rootElement.focusSelectedOptionElement()
    }
  }

  get name(): ElementName {
    return ElementName.COMBOBOX_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-combobox', closest: true }
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

export class AriaComboBoxInputElement extends BaseElement {
  protected aria: AriaComboBoxInputController = new AriaComboBoxInputController(this)

  /**
   * QUERIES
   */
  inputElement?: HTMLInputElement
  rootElement!: AriaComboBoxElement

  /**
   * STATES
   */
  value: string = ''

  connectedCallback(): void {
    super.connectedCallback()

    this.inputElement?.addEventListener('blur', this.onBlur)
    this.inputElement?.addEventListener('click', this.onClick)
    this.inputElement?.addEventListener('focus', this.onFocus)
    this.inputElement?.addEventListener('input', this.onInput)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.inputElement?.removeEventListener('blur', this.onBlur)
    this.inputElement?.removeEventListener('click', this.onClick)
    this.inputElement?.removeEventListener('focus', this.onFocus)
    this.inputElement?.removeEventListener('input', this.onInput)
  }

  onBlur = (): void => {
    this.rootElement.collapse()
    WebElementLogger.verbose(this.uid, 'onBlur', `The combobox has been collapsed.`)

    /**
     * REFACTOR TO NOT USE INNERTEXT
     */
    if (this.inputElement && this.rootElement.selectedOptionElement) {
      this.inputElement.value = this.rootElement.selectedOptionElement.innerText
      WebElementLogger.verbose(this.uid, 'onBlur', `The value has been set to the selected option inner text.`)
    }
  }

  onClick = (): void => {
    this.rootElement.expand()
    WebElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded.`)

    this.rootElement.focusSelectedOptionElement()
    WebElementLogger.verbose(this.uid, 'onFocus', `The selected option has been focused.`)
  }

  onFocus = (): void => {
    this.rootElement.expand()
    WebElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded.`)
  }

  onInput = (event: Event): void => {
    if (this.rootElement.collapsed) {
      this.rootElement.expand()
      this.rootElement.focusSelectedOptionElement()

      WebElementLogger.verbose(this.uid, 'onFocus', `The combobox has been expanded and the selected option has been focused.`)
    }

    // @ts-ignore
    this.value = event.target.value
    WebElementLogger.verbose(this.uid, 'onInput', `The value has been set.`, [this.value])

    this.rootElement.dispatchEvent(new StateChangedEvent('value', undefined, this.value))
  }

  clear(): void {
    if (this.inputElement) {
      this.inputElement.value = ''
    }
  }

  get name(): ElementName {
    return ElementName.COMBOBOX_INPUT
  }

  static properties: PropertyDeclarations = {
    value: { state: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'q-aria-combobox', closest: true }
  }
}

export class AriaComboBoxListElement extends FloatingElement {
  protected aria: AriaComboBoxListController = new AriaComboBoxListController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaComboBoxElement

  get name(): ElementName {
    return ElementName.COMBOBOX_LIST
  }

  get referenceElement(): AriaComboBoxGroupElement {
    return this.rootElement.groupElement
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-combobox', closest: true }
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

export class AriaComboBoxOptionElement extends BaseElement {
  protected aria: AriaComboBoxOptionController = new AriaComboBoxOptionController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  selected?: boolean

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

    /**
     * REFACTOR TO NOT USE INNERTEXT
     */
    if (name === 'selected' && value !== null) {
      if (this.rootElement.inputElement?.inputElement) {
        this.rootElement.inputElement.inputElement.value = this.innerText
        WebElementLogger.verbose(this.uid, 'attributeChangedCallback', `The input value has been set to the inner text of this option.`, [this.innerText])
      }
    }
  }

  onClick = (): void => {
    this.rootElement.blurFocusedOptionElement()
    this.rootElement.unselectSelectedOptionElement()

    this.selected = true
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
    return ElementName.COMBOBOX_OPTION
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    listElement: { selector: 'q-aria-combobox-list', closest: true },
    rootElement: { selector: 'q-aria-combobox', closest: true }
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

customElements.define('q-aria-combobox', AriaComboBoxElement)
customElements.define('q-aria-combobox-button', AriaComboBoxButtonElement)
customElements.define('q-aria-combobox-group', AriaComboBoxGroupElement)
customElements.define('q-aria-combobox-input', AriaComboBoxInputElement)
customElements.define('q-aria-combobox-list', AriaComboBoxListElement)
customElements.define('q-aria-combobox-option', AriaComboBoxOptionElement)

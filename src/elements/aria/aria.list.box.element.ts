import {
  AriaListBoxElementEventMap,
  AriaListBoxOptionElementEventMap,
  DEFAULT_LISTBOX_TYPEAHEAD_PREDICATE,
  defineCustomElement,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  Typeahead,
  TypeaheadPredicate,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaListBoxController, AriaListBoxOptionController } from '../../controllers/aria.list.box.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-listbox': AriaListBoxElement
    'q-aria-listbox-option': AriaListBoxOptionElement
  }
}

export class AriaListBoxElement<E extends AriaListBoxElementEventMap = AriaListBoxElementEventMap> extends BaseElement<E> {
  protected aria: AriaListBoxController = new AriaListBoxController(this)

  /**
   * PROPERTIES
   */
  multiple?: boolean
  selectFirstOptionOnFocus?: boolean
  selectionFollowsFocus?: boolean
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaListBoxOptionElement>

  /**
   * QUERIES
   */
  focusedOptionElement?: AriaListBoxOptionElement
  optionElements!: AriaListBoxOptionElement[]
  selectedOptionElement?: AriaListBoxOptionElement

  /**
   * INTERNAL
   */
  private typeahead: Typeahead<AriaListBoxOptionElement> = new Typeahead((element: AriaListBoxOptionElement) => {
    this.focusedOptionElement?.blur()

    element.focus()
    WebElementLogger.verbose(this.uid, 'typeahead', `The matched element has been focused.`)
  })

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onBlur = (): void => {
    this.focusedOptionElement?.blur()
    WebElementLogger.verbose(this.uid, 'onBlur', `The focused option has been blurred.`)
  }

  onFocus = (): void => {
    if (this.selectedOptionElement) {
      this.selectedOptionElement.focus()
      WebElementLogger.verbose(this.uid, 'onFocus', `The selected option has been focused.`)

      return
    }

    this.optionElements[0]?.focus()
    WebElementLogger.verbose(this.uid, 'onFocus', `The first option has been focused.`)

    if (this.selectFirstOptionOnFocus && this.single) {
      this.optionElements[0]?.select()
      WebElementLogger.verbose(this.uid, 'onFocus', `The first option has been selected.`)
    }
  }

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.A:
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.END:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.END:
      case KeyboardEventKey.HOME:
        this.focusedOptionElement?.blur()

        if (this.selectionFollowsFocus && this.single) {
          this.selectedOptionElement?.unselect()
        }

        break
    }

    switch (event.key) {
      case KeyboardEventKey.A:
        if (this.single || !event.ctrlKey) {
          break
        }

        if (this.optionElements.every((element: AriaListBoxOptionElement) => element.selected)) {
          for (let element of this.optionElements) {
            element.unselect()
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option has been unselected.`)

          break
        }

        for (let element of this.optionElements) {
          element.select()
        }
        WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option has been selected.`)

        break
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          this.optionElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The first option has been focused.`)

          if (this.selectionFollowsFocus && this.single) {
            this.optionElements[0]?.select()
          }

          break
        }

        this.optionElements[this.focusedOptionElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The next option has been focused.`)

        if (this.selectionFollowsFocus && this.single) {
          this.optionElements[this.focusedOptionElementIndex + 1]?.select()
        }

        if (this.multiple && event.ctrlKey && this.focusedOptionElement) {
          this.focusedOptionElement.selected = !this.focusedOptionElement.selected
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The next option has been selected.`)
        }

        break
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT:
        if (this.focusedOptionElementIndex <= 0) {
          this.optionElements[this.optionElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The last option has been focused.`)

          if (this.selectionFollowsFocus && this.single) {
            this.optionElements[this.optionElements.length - 1]?.select()
          }

          break
        }

        this.optionElements[this.focusedOptionElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous option has been focused.`)

        if (this.selectionFollowsFocus && this.single) {
          this.optionElements[this.focusedOptionElementIndex - 1]?.select()
        }

        if (this.multiple && event.ctrlKey && this.focusedOptionElement) {
          this.focusedOptionElement.selected = !this.focusedOptionElement.selected
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous option has been selected.`)
        }

        break
      case KeyboardEventKey.END:
        this.optionElements[this.optionElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The last option has been focused.`)

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = this.focusedOptionElementIndex; i < this.optionElements.length; i++) {
            this.optionElements[i]?.select()
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option from the focused one to the last one has been selected.`)
        }

        break
      case KeyboardEventKey.HOME:
        this.optionElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The first option has been focused.`)

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = 0; i < this.focusedOptionElementIndex; i++) {
            this.optionElements[i]?.select()
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option from the first one to the focused one has been selected.`)
        }

        break
      case KeyboardEventKey.SPACE:
        this.focusedOptionElement?.click()
        break
      default:
        this.typeahead.handle(event, this.optionElements, this.typeaheadPredicate ?? DEFAULT_LISTBOX_TYPEAHEAD_PREDICATE, {
          debounceTime: this.typeaheadDebounceTime
        })
        break
    }
  }

  isOptionElementFocused(element: AriaListBoxOptionElement): boolean {
    return element === this.focusedOptionElement
  }

  get focusedOptionElementIndex(): number {
    return this.focusedOptionElement ? this.optionElements.indexOf(this.focusedOptionElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_LISTBOX
  }

  get single(): boolean {
    return !this.multiple
  }

  static properties: PropertyDeclarations = {
    selectionFollowsFocus: { type: Boolean, attribute: 'selection-follows-focus', reflect: true },
    multiple: { type: Boolean, reflect: true },
    selectFirstOptionOnFocus: { type: Boolean, attribute: 'select-first-option-on-focus', reflect: true },
    typeaheadDebounceTime: { type: Number, attribute: 'typeahead-debounce-time', reflect: true },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    focusedOptionElement: { selector: 'q-aria-listbox-option[focused]' },
    optionElements: { selector: 'q-aria-listbox-option', all: true },
    selectedOptionElement: { selector: 'q-aria-listbox-option[selected]' }
  }
}

export class AriaListBoxOptionElement<E extends AriaListBoxOptionElementEventMap = AriaListBoxOptionElementEventMap> extends BaseElement<E> {
  protected aria: AriaListBoxOptionController = new AriaListBoxOptionController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  selected?: boolean
  value?: any

  /**
   * QUERIES
   */
  rootElement!: AriaListBoxElement

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

  onClick = (): void => {
    if (this.rootElement.multiple) {
      this.selected = !this.selected
      WebElementLogger.verbose(this.uid, 'onClick', `The option has been ${this.selected ? 'selected' : 'unselected'}.`)
    }

    if (this.rootElement.single) {
      this.rootElement.selectedOptionElement?.unselect()

      this.select()
      WebElementLogger.verbose(this.uid, 'onClick', `The option has been selected.`)
    }

    this.rootElement.focusedOptionElement?.blur()

    this.focus()
    WebElementLogger.verbose(this.uid, 'onClick', `The option has been focused.`)
  }

  onMouseDown = (event: MouseEvent): void => {
    // event.preventDefault()
  }

  blur(): void {
    this.focused = false
  }

  focus(): void {
    this.focused = true
  }

  select(): void {
    this.selected = true
  }

  unselect(): void {
    this.selected = false
  }

  get name(): ElementName {
    return ElementName.ARIA_LISTBOX_OPTION
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    value: {}
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-listbox', closest: true }
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

defineCustomElement('q-aria-listbox', AriaListBoxElement)
defineCustomElement('q-aria-listbox-option', AriaListBoxOptionElement)

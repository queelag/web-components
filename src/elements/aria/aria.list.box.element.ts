import { ElementName, KeyboardEventKey, QueryDeclarations, Typeahead, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaListBoxController, AriaListBoxOptionController } from '../../controllers/aria.list.box.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-listbox': AriaListBoxElement
    'q-aria-listbox-option': AriaListBoxOptionElement
  }
}

export class AriaListBoxElement extends BaseElement {
  protected aria: AriaListBoxController = new AriaListBoxController(this)

  /**
   * PROPERTIES
   */
  selectionFollowsFocus?: boolean
  multiple?: boolean
  selectFirstOptionOnFocus?: boolean

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
    this.blurFocusedOptionElement()

    element.focused = true
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
    if (this.focusedOptionElement) {
      this.focusedOptionElement.focused = false
      WebElementLogger.verbose(this.uid, 'onBlur', `The focused option has been blurred.`)
    }
  }

  onFocus = (): void => {
    if (this.selectedOptionElement) {
      this.selectedOptionElement.focused = true
      WebElementLogger.verbose(this.uid, 'onFocus', `The selected option has been focused.`)

      return
    }

    this.optionElements[0].focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The first option has been focused.`)

    if (this.selectFirstOptionOnFocus && this.single) {
      this.optionElements[0].selected = true
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
        this.blurFocusedOptionElement()

        if (this.selectionFollowsFocus && this.single) {
          this.unselectSelectedOptionElement()
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
            element.selected = false
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option has been unselected.`)

          break
        }

        for (let element of this.optionElements) {
          element.selected = true
        }
        WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option has been selected.`)

        break
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          this.optionElements[0].focused = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The first option has been focused.`)

          if (this.selectionFollowsFocus && this.single) {
            this.optionElements[0].selected = true
          }

          break
        }

        this.optionElements[this.focusedOptionElementIndex + 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The next option has been focused.`)

        if (this.selectionFollowsFocus && this.single) {
          this.optionElements[this.focusedOptionElementIndex + 1].selected = true
        }

        if (this.multiple && event.ctrlKey && this.focusedOptionElement) {
          this.focusedOptionElement.selected = !this.focusedOptionElement.selected
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The next option has been selected.`)
        }

        break
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT:
        if (this.focusedOptionElementIndex <= 0) {
          this.optionElements[this.optionElements.length - 1].focused = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The last option has been focused.`)

          if (this.selectionFollowsFocus && this.single) {
            this.optionElements[this.optionElements.length - 1].selected = true
          }

          break
        }

        this.optionElements[this.focusedOptionElementIndex - 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous option has been focused.`)

        if (this.selectionFollowsFocus && this.single) {
          this.optionElements[this.focusedOptionElementIndex - 1].selected = true
        }

        if (this.multiple && event.ctrlKey && this.focusedOptionElement) {
          this.focusedOptionElement.selected = !this.focusedOptionElement.selected
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous option has been selected.`)
        }

        break
      case KeyboardEventKey.END:
        this.optionElements[this.optionElements.length - 1].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The last option has been focused.`)

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = this.focusedOptionElementIndex; i < this.optionElements.length; i++) {
            this.optionElements[i].selected = true
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option from the focused one to the last one has been selected.`)
        }

        break
      case KeyboardEventKey.HOME:
        this.optionElements[0].focused = true
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The first option has been focused.`)

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = 0; i < this.focusedOptionElementIndex; i++) {
            this.optionElements[i].selected = true
          }
          WebElementLogger.verbose(this.uid, 'onKeyDown', `Every option from the first one to the focused one has been selected.`)
        }

        break
      case KeyboardEventKey.SPACE:
        this.focusedOptionElement?.click()
        break
      default:
        this.typeahead.handle(event, this.optionElements)
        break
    }
  }

  blurFocusedOptionElement(): void {
    if (this.focusedOptionElement) {
      this.focusedOptionElement.focused = false
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

  isOptionElementFocused(element: AriaListBoxOptionElement): boolean {
    return element === this.focusedOptionElement
  }

  get focusedOptionElementIndex(): number {
    return this.focusedOptionElement ? this.optionElements.indexOf(this.focusedOptionElement) : -1
  }

  get name(): ElementName {
    return ElementName.LISTBOX
  }

  get single(): boolean {
    return !this.multiple
  }

  static properties: PropertyDeclarations = {
    selectionFollowsFocus: { type: Boolean, attribute: 'selection-follows-focus', reflect: true },
    multiple: { type: Boolean, reflect: true },
    selectFirstOptionOnFocus: { type: Boolean, attribute: 'select-first-option-on-focus', reflect: true }
  }

  static queries: QueryDeclarations = {
    focusedOptionElement: { selector: 'q-aria-listbox-option[focused]' },
    optionElements: { selector: 'q-aria-listbox-option', all: true },
    selectedOptionElement: { selector: 'q-aria-listbox-option[selected]' }
  }
}

export class AriaListBoxOptionElement extends BaseElement {
  protected aria: AriaListBoxOptionController = new AriaListBoxOptionController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  selected?: boolean

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
      for (let element of this.rootElement.optionElements) {
        element.selected = false
      }

      this.selected = true
      WebElementLogger.verbose(this.uid, 'onClick', `The option has been selected.`)
    }

    this.rootElement.blurFocusedOptionElement()

    this.focused = true
    WebElementLogger.verbose(this.uid, 'onClick', `The option has been focused.`)
  }

  onMouseDown = (event: MouseEvent): void => {
    // event.preventDefault()
  }

  get name(): ElementName {
    return ElementName.LISTBOX_OPTION
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true }
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

customElements.define('q-aria-listbox', AriaListBoxElement)
customElements.define('q-aria-listbox-option', AriaListBoxOptionElement)

import { type TypeaheadPredicate, isArray, removeArrayItems, typeahead } from '@aracna/core'
import { KeyboardEventKey, defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css } from 'lit'
import { AriaListBoxController, AriaListBoxOptionController } from '../../controllers/aria-list-box-controller.js'
import { DEFAULT_LISTBOX_TYPEAHEAD_PREDICATE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaListBoxElementEventMap, AriaListBoxOptionElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ListBoxOptionSelectEvent } from '../../events/list-box-option-select-event.js'
import { ListBoxOptionUnselectEvent } from '../../events/list-box-option-unselect-event.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-listbox': AriaListBoxElement
    'aracna-aria-listbox-option': AriaListBoxOptionElement
  }
}

class AriaListBoxElement<E extends AriaListBoxElementEventMap = AriaListBoxElementEventMap> extends FormControlElement<E> {
  protected aria: AriaListBoxController = new AriaListBoxController(this)

  /**
   * Properties
   */
  /** */
  multiple?: boolean
  selectFirstOptionOnFocus?: boolean
  selectionFollowsFocus?: boolean
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaListBoxOptionElement>

  /**
   * Queries
   */
  /** */
  focusedOptionElement?: AriaListBoxOptionElement
  optionElements!: AriaListBoxOptionElement[]
  selectedOptionElement?: AriaListBoxOptionElement

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
    if (!this.focusedOptionElement) {
      return
    }

    ElementLogger.verbose(this.uid, 'onBlur', `Blurring the focused option.`, this.focusedOptionElement)
    this.focusedOptionElement.blur()
  }

  onFocus = (): void => {
    let option: AriaListBoxOptionElement | undefined

    if (this.selectedOptionElement) {
      ElementLogger.verbose(this.uid, 'onFocus', `Focusing the selected option.`, this.selectedOptionElement)
      this.selectedOptionElement.focus()

      return
    }

    option = this.optionElements.find((element: AriaListBoxOptionElement) => element.selected)
    if (!option) return

    ElementLogger.verbose(this.uid, 'onFocus', `Focusing the first option.`, option)
    option.focus()

    if (this.selectFirstOptionOnFocus && this.single) {
      ElementLogger.verbose(this.uid, 'onFocus', `Selecting the first option.`, option)
      option.select()
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
        if (this.focusedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused option.`, this.focusedOptionElement)
          this.focusedOptionElement.blur()
        }

        if (this.selectionFollowsFocus && this.single && this.selectedOptionElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Unselecting the selected option.`, this.selectedOptionElement)
          this.selectedOptionElement.unselect()
        }

        break
    }

    switch (event.key) {
      case KeyboardEventKey.A:
        if (this.single || !event.ctrlKey) {
          break
        }

        if (this.optionElements.every((element: AriaListBoxOptionElement) => element.selected)) {
          for (let option of this.optionElements) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Unselecting an option.`, option)
            option.unselect()
          }

          break
        }

        for (let option of this.optionElements) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting an option.`, option)
          option.select()
        }

        break
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT: {
        let option: AriaListBoxOptionElement | undefined

        if (this.focusedOptionElementIndex >= this.optionElements.length - 1) {
          option = this.optionElements[0]
          if (!option) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first option.`, option)
          option.focus()

          if (this.selectionFollowsFocus && this.single) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the first option.`, option)
            option.select()
          }

          break
        }

        option = this.optionElements[this.focusedOptionElementIndex + 1]

        if (option) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the next option.`, option)
          option.focus()

          if (this.selectionFollowsFocus && this.single) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the next option.`, option)
            option.select()
          }
        }

        option = this.focusedOptionElement
        if (!option) break

        if (this.multiple && event.ctrlKey) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `${option.selected ? 'Unselecting' : 'Selecting'} the focused option.`, option)
          option.toggle()
        }

        break
      }
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT: {
        let option: AriaListBoxOptionElement | undefined

        if (this.focusedOptionElementIndex <= 0) {
          option = this.optionElements[this.optionElements.length - 1]
          if (!option) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last option.`, option)
          option.focus()

          if (this.selectionFollowsFocus && this.single) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the last option.`, option)
            option.select()
          }

          break
        }

        option = this.optionElements[this.focusedOptionElementIndex - 1]

        if (option) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the previous option.`, option)
          option.focus()

          if (this.selectionFollowsFocus && this.single) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the previous option.`, option)
            option.select()
          }
        }

        option = this.focusedOptionElement
        if (!option) break

        if (this.multiple && event.ctrlKey) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `${option.selected ? 'Unselecting' : 'Selecting'} the focused option.`, option)
          option.toggle()
        }

        break
      }
      case KeyboardEventKey.END: {
        let option: AriaListBoxOptionElement | undefined

        option = this.optionElements[this.optionElements.length - 1]

        if (option) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last option.`, option)
          option.focus()
        }

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = this.focusedOptionElementIndex; i < this.optionElements.length; i++) {
            option = this.optionElements[i]
            if (!option) continue

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting an option.`, option)
            option.select()
          }
        }

        break
      }
      case KeyboardEventKey.HOME: {
        let option: AriaListBoxOptionElement | undefined

        option = this.optionElements[0]

        if (option) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first option.`, option)
          option.focus()
        }

        if (this.multiple && event.ctrlKey && event.shiftKey) {
          for (let i = 0; i < this.focusedOptionElementIndex; i++) {
            option = this.optionElements[i]
            if (!option) continue

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting an option.`, option)
            option.select()
          }
        }

        break
      }
      case KeyboardEventKey.SPACE:
        if (!this.focusedOptionElement) {
          break
        }

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the focused option.`, this.focusedOptionElement)
        this.focusedOptionElement.click()

        break
      default:
        if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        typeahead<AriaListBoxOptionElement>(this.uid, event.key)
          .setDebounceTime(this.typeaheadDebounceTime)
          .setItems(this.optionElements)
          .setListeners([])
          .setPredicate(this.typeaheadPredicate ?? DEFAULT_LISTBOX_TYPEAHEAD_PREDICATE)
          .on('match', this.onTypeaheadMatch)

        break
    }
  }

  onTypeaheadMatch = (element: AriaListBoxOptionElement) => {
    if (this.focusedOptionElement) {
      ElementLogger.verbose(this.uid, 'onTypeaheadMatch', `Blurring the focused option.`, this.focusedOptionElement)
      this.focusedOptionElement.blur()
    }

    ElementLogger.verbose(this.uid, 'onTypeaheadMatch', `Focusing the matched option.`, element)
    element.focus()
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

  get value(): any {
    return super.value
  }

  set value(value: any) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    selectionFollowsFocus: {
      type: Boolean,
      attribute: 'selection-follows-focus',
      reflect: true
    },
    multiple: { type: Boolean, reflect: true },
    selectFirstOptionOnFocus: {
      type: Boolean,
      attribute: 'select-first-option-on-focus',
      reflect: true
    },
    typeaheadDebounceTime: {
      type: Number,
      attribute: 'typeahead-debounce-time',
      reflect: true
    },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    focusedOptionElement: { selector: 'aracna-aria-listbox-option[focused]' },
    optionElements: { selector: 'aracna-aria-listbox-option', all: true },
    selectedOptionElement: { selector: 'aracna-aria-listbox-option[selected]' }
  }
}

class AriaListBoxOptionElement<E extends AriaListBoxOptionElementEventMap = AriaListBoxOptionElementEventMap> extends BaseElement<E> {
  protected aria: AriaListBoxOptionController = new AriaListBoxOptionController(this)

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
    if (this.rootElement.single) {
      if (this.rootElement.selectedOptionElement) {
        ElementLogger.verbose(this.uid, 'onClick', `Unselecting the selected option.`, this.rootElement.selectedOptionElement)
        this.rootElement.selectedOptionElement.unselect()
      }

      ElementLogger.verbose(this.uid, 'onClick', `Selecting the option.`)
      this.select()
    }

    if (this.rootElement.multiple) {
      ElementLogger.verbose(this.uid, 'onClick', `${this.selected ? 'Unselecting' : 'Selecting'} the option.`)
      this.toggle()
    }

    if (this.rootElement.focusedOptionElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Blurring the focused option.`, this.rootElement.focusedOptionElement)
      this.rootElement.focusedOptionElement.blur()
    }

    ElementLogger.verbose(this.uid, 'onClick', `Focusing the option.`)
    this.focus()
  }

  onMouseDown = (event: MouseEvent): void => {
    // event.preventDefault()
  }

  blur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'blur', `The option has been blurred.`)

    this.dispatchEvent(new FocusEvent('blur'))
    ElementLogger.verbose(this.uid, 'blur', `The "blur" event has been dispatched.`)
  }

  focus(options?: FocusOptions | null): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'focus', `The option has been focused.`)

    this.dispatchEvent(new FocusEvent('focus'))
    ElementLogger.verbose(this.uid, 'focus', `The "focus" event has been dispatched.`)
  }

  toggle(): void {
    if (this.selected) {
      return this.unselect()
    }

    this.select()
  }

  select(): void {
    this.selected = true
    ElementLogger.verbose(this.uid, 'select', `The option has been selected.`)

    if (this.rootElement.single) {
      this.rootElement.value = this.value
    }

    if (this.rootElement.multiple) {
      this.rootElement.value = isArray(this.rootElement.value) ? this.rootElement.value : []
      this.rootElement.value = [...this.rootElement.value, this.value]
    }

    ElementLogger.verbose(this.uid, 'select', `The value has been set.`, this.rootElement.value)

    ElementLogger.verbose(this.uid, 'select', `Touching the listbox.`)
    this.rootElement.touch()

    this.dispatchEvent(new ListBoxOptionSelectEvent(this.value))
    ElementLogger.verbose(this.uid, 'select', `The "select" event has been dispatched.`)
  }

  unselect(): void {
    this.selected = false
    ElementLogger.verbose(this.uid, 'unselect', `The option has been unselected.`)

    if (this.rootElement.single) {
      this.rootElement.value = undefined
    }

    if (this.rootElement.multiple) {
      this.rootElement.value = isArray(this.rootElement.value) ? this.rootElement.value : []
      this.rootElement.value = removeArrayItems(this.rootElement.value, [this.value])
    }

    ElementLogger.verbose(this.uid, 'unselect', `The value has been set.`, this.rootElement.value)

    ElementLogger.verbose(this.uid, 'unselect', `Touching the listbox.`)
    this.rootElement.touch()

    this.dispatchEvent(new ListBoxOptionUnselectEvent(this.value))
    ElementLogger.verbose(this.uid, 'unselect', `The "unselect" event has been dispatched.`)
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
    rootElement: { selector: 'aracna-aria-listbox', closest: true }
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

defineCustomElement('aracna-aria-listbox', AriaListBoxElement)
defineCustomElement('aracna-aria-listbox-option', AriaListBoxOptionElement)

export { AriaListBoxElement as AracnaAriaListBoxElement, AriaListBoxOptionElement as AracnaAriaListBoxOptionElement }

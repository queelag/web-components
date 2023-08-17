import { debounce, parseNumber, Typeahead, TypeaheadPredicate } from '@aracna/core'
import {
  AriaMenuButtonElementEventMap,
  AriaMenuElementEventMap,
  AriaMenuItemElementEventMap,
  AriaMenuSubMenuElementEventMap,
  DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME,
  DEFAULT_MENU_TYPEAHEAD_PREDICATE,
  defineCustomElement,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  setImmutableElementAttribute,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaMenuButtonController, AriaMenuController, AriaMenuItemController, AriaMenuSubMenuController } from '../../controllers/aria-menu-controller.js'
import { BaseElement } from '../core/base-element.js'
import { FloatingElement } from '../core/floating-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-menu': AriaMenuElement
    'aracna-aria-menu-button': AriaMenuButtonElement
    'aracna-aria-menu-item': AriaMenuItemElement
    'aracna-aria-menu-submenu': AriaMenuSubMenuElement
  }
}

export class AriaMenuElement<E extends AriaMenuElementEventMap = AriaMenuElementEventMap> extends BaseElement<E> {
  protected aria: AriaMenuController = new AriaMenuController(this)

  /**
   * PROPERTIES
   */
  collapseDebounceTime?: number
  collapseOnMouseLeave?: boolean
  expandOnMouseEnter?: boolean
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaMenuItemElement>

  /**
   * QUERIES
   */
  buttonElement?: AriaMenuButtonElement
  expandedSubMenuElement?: AriaMenuSubMenuElement
  expandedSubMenuElements!: AriaMenuSubMenuElement[]
  focusedItemElement?: AriaMenuItemElement
  itemElements!: AriaMenuItemElement[]
  shallowFocusedItemElement?: AriaMenuItemElement
  shallowItemElements!: AriaMenuItemElement[]
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * INTERNAL
   */
  expanded?: boolean
  focused?: boolean = true
  typeahead: Typeahead<AriaMenuItemElement> = new Typeahead(this.onTypeaheadMatch, DEFAULT_MENU_TYPEAHEAD_PREDICATE)

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name === 'typeaheadPredicate') {
      this.typeahead = new Typeahead(this.onTypeaheadMatch, this.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE)
    }
  }

  onTypeaheadMatch(item: AriaMenuItemElement) {
    item.focus()
    WebElementLogger.verbose(this.uid, 'onMatch', `The matched item has been focused.`)
  }

  onFocusIn(): void {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocusIn', `The menu has been focused in.`)
  }

  onFocusOut(): void {
    this.focused = false
    WebElementLogger.verbose(this.uid, 'onFocusOut', `The menu has been focused out.`)

    debounce(this.uid, this.onFocusOutDebounce, this.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME)
  }

  onFocusOutDebounce = (): void => {
    if (this.focused) {
      return
    }

    for (let submenu of this.expandedSubMenuElements) {
      submenu.collapse()
    }

    this.expanded = false
    WebElementLogger.verbose(this.uid, 'onFocusOutDebounce', `The menu has been collapsed.`)

    if (this.buttonElement) {
      this.buttonElement.focus()
      WebElementLogger.verbose(this.uid, 'onFocusOutDebounce', `The button has been focused.`)

      return
    }

    if (this.shallowItemElements[0]) {
      setImmutableElementAttribute(this.shallowItemElements[0], 'tabindex', '0')
      WebElementLogger.verbose(this.uid, 'onFocusOutDebounce', `The first item has been made focusable.`)
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.END:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
        if (this.buttonElement) {
          break
        }

        if (this.shallowFocusedItemElementIndex <= 0) {
          this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last item has been focused.`)

          if (this.expanded) {
            this.expandedSubMenuElement?.collapse()
            this.shallowItemElements[this.shallowItemElements.length - 1]?.subMenuElement?.expand()
          }

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous item has been focused.`)

        if (this.expanded) {
          this.expandedSubMenuElement?.collapse()
          this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]?.subMenuElement?.expand()
        }

        break
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.buttonElement) {
          break
        }

        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          this.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first item has been focused.`)

          if (this.expanded) {
            this.expandedSubMenuElement?.collapse()
            this.shallowItemElements[0]?.subMenuElement?.expand()
          }

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next item has been focused.`)

        if (this.expanded) {
          this.expandedSubMenuElement?.collapse()
          this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]?.subMenuElement?.expand()
        }

        break
      case KeyboardEventKey.ARROW_DOWN:
        if (this.buttonElement && this.subMenuElement) {
          if (this.collapsed) {
            this.subMenuElement.expand()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The submenu has been expanded.`)

            this.subMenuElement.shallowItemElements[0]?.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item of the submenu has been focused.`)

            this.expanded = true
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The menu has been marked as expanded.`)

            break
          }

          this.subMenuElement.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item of the submenu has been focused.`)

          break
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          if (this.collapsed) {
            this.shallowFocusedItemElement.subMenuElement.expand()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The submenu has been expanded.`)

            this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]?.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item of the submenu has been focused.`)

            this.expanded = true

            break
          }

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item of the submenu has been focused.`)

          break
        }

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.buttonElement && this.subMenuElement) {
          if (this.collapsed) {
            this.subMenuElement.expand()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The submenu has been expanded.`)

            this.subMenuElement.shallowItemElements[this.subMenuElement.shallowItemElements.length - 1]?.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The last item of the submenu has been focused.`)

            this.expanded = true
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The menu has been marked as expanded.`)

            break
          }

          this.subMenuElement.shallowItemElements[this.subMenuElement.shallowItemElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The last item of the submenu has been focused.`)

          break
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          if (this.collapsed) {
            this.shallowFocusedItemElement.subMenuElement.expand()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The submenu has been expanded.`)

            this.shallowFocusedItemElement.subMenuElement.shallowItemElements[
              this.shallowFocusedItemElement.subMenuElement.shallowItemElements.length - 1
            ]?.focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item of the submenu has been focused.`)

            this.expanded = true

            break
          }

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[
            this.shallowFocusedItemElement.subMenuElement.shallowItemElements.length - 1
          ]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item of the submenu has been focused.`)

          break
        }

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.buttonElement && this.subMenuElement) {
          this.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The submenu has been expanded.`)

          this.expanded = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The menu has been marked as expanded.`)
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          this.shallowFocusedItemElement.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The submenu has been expanded.`)

          this.expanded = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The menu has been marked as expanded.`)

          break
        }

        this.shallowFocusedItemElement?.click()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The focused item has been clicked.`)

        break
      case KeyboardEventKey.HOME:
        this.shallowItemElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.END:
        this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      default:
        event.preventDefault()
        event.stopPropagation()

        if (this.buttonElement && this.subMenuElement) {
          this.typeahead.handle(event.key, [...this.subMenuElement.shallowItemElements], this.typeaheadDebounceTime)
          break
        }

        this.typeahead.handle(event.key, this.shallowItemElements, this.typeaheadDebounceTime)
        break
    }
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowItemElements.findIndex((item: AriaMenuItemElement) => {
      if (this.shallowFocusedItemElement) {
        return item === this.shallowFocusedItemElement
      }

      if (this.focusedItemElement) {
        return item.contains(this.focusedItemElement)
      }

      return false
    })
  }

  static properties: PropertyDeclarations = {
    collapseDebounceTime: { type: Number, attribute: 'collapse-debounce-time', reflect: true },
    collapseOnMouseLeave: { type: Boolean, attribute: 'collapse-on-mouse-leave', reflect: true },
    expandOnMouseEnter: { type: Boolean, attribute: 'expand-on-mouse-enter', reflect: true },
    typeaheadDebounceTime: { type: Number, attribute: 'typeahead-debounce-time', reflect: true },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-menu-button' },
    expandedSubMenuElement: { selector: 'aracna-aria-menu-submenu[expanded]' },
    expandedSubMenuElements: { selector: 'aracna-aria-menu-submenu[expanded]', all: true },
    focusedItemElement: { selector: 'aracna-aria-menu-item[focused]' },
    itemElements: { selector: 'aracna-aria-menu-item', all: true },
    shallowFocusedItemElement: { selector: 'aracna-aria-menu-item[depth="0"][focused]' },
    shallowItemElements: { selector: 'aracna-aria-menu-item[depth="0"]', all: true },
    subMenuElement: { selector: 'aracna-aria-menu-submenu' }
  }
}

export class AriaMenuButtonElement<E extends AriaMenuButtonElementEventMap = AriaMenuButtonElementEventMap> extends BaseElement<E> {
  protected arai: AriaMenuButtonController = new AriaMenuButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaMenuElement

  /**
   * INTERNAL
   */
  mouseEntered?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)
  }

  onClick(): void {
    if (!this.rootElement.subMenuElement) {
      return
    }

    this.rootElement.subMenuElement.expanded = !this.rootElement.subMenuElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The menu has been ${this.rootElement.subMenuElement.expanded ? 'expanded' : 'collapsed'}.`)

    if (this.rootElement.subMenuElement.expanded) {
      this.rootElement.itemElements[0]?.focus()
      WebElementLogger.verbose(this.uid, 'onClick', `The first item has been focused.`)
    }

    if (this.rootElement.subMenuElement.collapsed) {
      this.focus()
      WebElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
    }
  }

  onMouseEnter(): void {
    this.mouseEntered = true
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has entered.`)

    if (this.rootElement.expandOnMouseEnter) {
      this.rootElement.subMenuElement?.expand()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The submenu has been expanded.`)

      this.focus()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The button has been focused.`)
    }
  }

  onMouseLeave(): void {
    this.mouseEntered = false
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has left.`)

    debounce(this.uid, this.onMouseLeaveDebounce, this.rootElement.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME)
  }

  onMouseLeaveDebounce = (): void => {
    if (!this.rootElement.collapseOnMouseLeave) {
      return
    }

    if (this.mouseEntered) {
      return
    }

    if (!this.rootElement.subMenuElement) {
      return
    }

    for (let item of this.rootElement.subMenuElement.itemElements) {
      if (item.mouseEntered) {
        return
      }
    }

    this.rootElement.subMenuElement.collapse()
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The submenu has been collapsed.`)

    this.focus()
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The button has been focused.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-menu', closest: true }
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

export class AriaMenuItemElement<E extends AriaMenuItemElementEventMap = AriaMenuItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaMenuItemController = new AriaMenuItemController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  label?: string

  /**
   * QUERIES
   */
  anchorElement?: HTMLAnchorElement
  rootElement!: AriaMenuElement
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * INTERNAL
   */
  mouseEntered?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('blur', this.onBlur)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name === 'expanded') {
      this.subMenuElement?.computePosition && this.subMenuElement.computePosition()
    }
  }

  onBlur(): void {
    this.focused = false
    WebElementLogger.verbose(this.uid, 'onBlur', `The item has been blurred.`)
  }

  onFocus(): void {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The item has been focused.`)
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation()

    if (this.anchorElement) {
      this.anchorElement.click()
      WebElementLogger.verbose(this.uid, 'onClick', `The anchor has been clicked.`)

      return
    }

    if (this.deep) {
      return
    }

    if (this.subMenuElement) {
      event.preventDefault()

      this.subMenuElement.expanded ? this.subMenuElement.collapse() : this.subMenuElement.expand()
      WebElementLogger.verbose(this.uid, 'onClick', `The submenu has been ${this.subMenuElement.expanded ? 'collapsed' : 'expanded'}.`)
    }
  }

  onMouseEnter(): void {
    this.mouseEntered = true
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has entered.`)

    if (this.sameDepthExpandedSubMenuElement) {
      this.sameDepthExpandedSubMenuElement.collapse()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The same depth expanded submenu has been collapsed.`)
    }

    if (this.subMenuElement) {
      switch (true) {
        case this.rootElement.expanded:
        case this.rootElement.expandOnMouseEnter && this.shallow:
        // case this.sameDepthExpandedSubMenuElement !== null:
        case this.subMenuElement.deep:
          this.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onMouseEnter', `The submenu has been expanded.`)

          break
      }
    }

    this.focus()
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The item has been focused.`)
  }

  onMouseLeave(): void {
    this.mouseEntered = false
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The mouse has left.`)

    debounce(this.uid, this.onMouseLeaveDebounce, this.rootElement.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME)
  }

  onMouseLeaveDebounce = (): void => {
    if (!this.rootElement.collapseOnMouseLeave) {
      return
    }

    if (this.mouseEntered) {
      return
    }

    if (this.rootElement.buttonElement && this.rootElement.buttonElement.mouseEntered) {
      return
    }

    if (this.subMenuElement) {
      this.subMenuElement.collapse()
      WebElementLogger.verbose(this.uid, 'onMouseLeave', `The submenu has been collapsed.`)
    }

    if (this.deep) {
      this.blur()
      WebElementLogger.verbose(this.uid, ' onMouseLeave', `The item has been blurred.`)
    }
  }

  blur(): void {
    this.focused = false

    if (this.anchorElement) {
      this.anchorElement.blur()
      return
    }

    super.blur()
  }

  focus(options?: FocusOptions | undefined): void {
    this.rootElement.focusedItemElement?.blur()
    this.focused = true

    if (this.anchorElement) {
      this.anchorElement.focus()
      return
    }

    super.focus(options)
  }

  get deep(): boolean {
    let closest: AriaMenuItemElement | null | undefined

    closest = this.parentElement?.closest('aracna-aria-menu-item')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: AriaMenuItemElement | null | undefined

    n = this.rootElement.buttonElement ? 1 : 0
    closest = this.parentElement?.closest('aracna-aria-menu-item')

    while (typeof closest === 'object' && closest !== null && closest !== this) {
      n++
      closest = closest.parentElement?.closest('aracna-aria-menu-item')
    }

    return n
  }

  get index(): number {
    return [...this.rootElement.itemElements].indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_ITEM
  }

  get sameDepthItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement.querySelectorAll(`aracna-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElement(): AriaMenuItemElement | null {
    return this.rootElement.querySelector(`aracna-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement.querySelectorAll(`aracna-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthExpandedSubMenuElement(): AriaMenuSubMenuElement | null {
    return this.rootElement.querySelector(`aracna-aria-menu-submenu[depth="${this.depth}"][expanded]`)
  }

  get shallow(): boolean {
    return !this.deep
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: ':scope > a' },
    rootElement: { selector: 'aracna-aria-menu', closest: true },
    subMenuElement: { selector: 'aracna-aria-menu-submenu' }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
        position: relative;
      }
    `
  ]
}

export class AriaMenuSubMenuElement<E extends AriaMenuSubMenuElementEventMap = AriaMenuSubMenuElementEventMap> extends FloatingElement<E> {
  protected aria: AriaMenuSubMenuController = new AriaMenuSubMenuController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean

  /**
   * QUERIES
   */
  itemElements!: AriaMenuItemElement[]
  parentItemElement?: AriaMenuItemElement
  parentSubMenuElement?: AriaMenuSubMenuElement
  rootElement!: AriaMenuElement

  /**
   * INTERNAL
   */
  typeahead: Typeahead<AriaMenuItemElement> = new Typeahead(this.onTypeaheadMatch, DEFAULT_MENU_TYPEAHEAD_PREDICATE)

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

    if (name === 'typeaheadPredicate') {
      this.typeahead = new Typeahead(this.onTypeaheadMatch, this.rootElement.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE)
    }
  }

  onTypeaheadMatch(item: AriaMenuItemElement) {
    item.focus()
    WebElementLogger.verbose(this.uid, 'onMatch', `The matched item has been focused.`)
  }

  onKeyDown(event: KeyboardEvent): void {
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
        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          this.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next item has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.shallowFocusedItemElementIndex <= 0) {
          this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The previous item has been focused.`)

        break
      case KeyboardEventKey.ARROW_LEFT:
        if (this.shallow) {
          break
        }

        if (this.expanded) {
          event.preventDefault()
          event.stopPropagation()

          this.collapse()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The submenu has been collapsed.`)

          this.parentItemElement?.focus()
        }

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        // if (this.shallow) {
        //   break
        // }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          if (this.shallowFocusedItemElement.subMenuElement.expanded) {
            break
          }

          event.preventDefault()
          event.stopPropagation()

          this.shallowFocusedItemElement.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ENTER or SPACE', `The focused item submenu has been expanded.`)

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ENTER or SPACE', `The first item of the focused item submenu has been focused.`)

          break
        }

        if (event.key !== KeyboardEventKey.ARROW_RIGHT) {
          this.shallowFocusedItemElement?.click()
          WebElementLogger.verbose(this.uid, 'onClick', 'ENTER or SPACE', `The focused item has been clicked.`)
        }

        break
      case KeyboardEventKey.END:
        this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.shallowItemElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.ESCAPE:
        this.collapse()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The submenu has been collapsed.`)

        if (this.shallow && this.rootElement.buttonElement) {
          this.rootElement.buttonElement.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The button has been focused.`)

          break
        }

        this.parentItemElement?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The parent item has been focused.`)

        break
      default:
        event.preventDefault()
        event.stopPropagation()

        this.typeahead.handle(event.key, [...this.shallowItemElements], this.rootElement.typeaheadDebounceTime)
        break
    }
  }

  collapse(): void {
    this.expanded = false
  }

  expand(): void {
    this.expanded = true
    this.rootElement.expanded = true
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get deep(): boolean {
    let closest: AriaMenuSubMenuElement | null | undefined

    closest = this.parentElement?.closest('aracna-aria-menu-submenu')
    if (!closest) return false

    return true
  }

  get depth(): number {
    let n: number, closest: AriaMenuSubMenuElement | null | undefined

    n = 0
    closest = this.parentElement?.closest('aracna-aria-menu-submenu')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('aracna-aria-menu-submenu')
    }

    return n
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_SUBMENU
  }

  get referenceElement(): HTMLElement | undefined {
    return this === this.parentSubMenuElement ? this.parentItemElement || this.rootElement.buttonElement : this.parentSubMenuElement
  }

  get shallow(): boolean {
    return !this.deep
  }

  get shallowFocusedItemElement(): AriaMenuItemElement | null {
    return this.querySelector(`aracna-aria-menu-item[depth="${parseNumber(this.depth) + 1}"][focused]`)
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowFocusedItemElement ? [...this.shallowItemElements].indexOf(this.shallowFocusedItemElement) : -1
  }

  get shallowItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.querySelectorAll(`aracna-aria-menu-item[depth="${parseNumber(this.depth) + 1}"]`)
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    itemElements: { selector: 'aracna-aria-menu-item', all: true },
    parentItemElement: { selector: 'aracna-aria-menu-item', closest: true },
    parentSubMenuElement: { selector: 'aracna-aria-menu-submenu', closest: true },
    rootElement: { selector: 'aracna-aria-menu', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        left: 0;
        position: absolute;
        top: 0;
        z-index: 1;
      }
    `
  ]
}

defineCustomElement('aracna-aria-menu', AriaMenuElement)
defineCustomElement('aracna-aria-menu-button', AriaMenuButtonElement)
defineCustomElement('aracna-aria-menu-item', AriaMenuItemElement)
defineCustomElement('aracna-aria-menu-submenu', AriaMenuSubMenuElement)

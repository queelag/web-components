import { debounce, parseNumber } from '@queelag/core'
import {
  DEFAULT_MENU_TYPEAHEAD_PREDICATE,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  setImmutableElementAttribute,
  Typeahead,
  TypeaheadPredicate,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaMenuButtonController, AriaMenuController, AriaMenuItemController, AriaMenuSubMenuController } from '../../controllers/aria.menu.controller'
import { BaseElement } from '../core/base.element'
import { FloatingElement } from '../core/floating.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-menu': AriaMenuElement
    'q-aria-menu-button': AriaMenuButtonElement
    'q-aria-menu-item': AriaMenuItemElement
    'q-aria-menu-submenu': AriaMenuSubMenuElement
  }
}

export class AriaMenuElement extends BaseElement {
  protected aria: AriaMenuController = new AriaMenuController(this)

  /**
   * PROPERTIES
   */
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
  focusedItemElements!: AriaMenuItemElement[]
  itemElements!: AriaMenuItemElement[]
  shallowFocusedItemElement?: AriaMenuItemElement
  shallowItemElements!: AriaMenuItemElement[]
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * INTERNAL
   */
  private expanded?: boolean
  private focused?: boolean = true
  private typeahead: Typeahead<AriaMenuItemElement> = new Typeahead((item: AriaMenuItemElement) => {
    this.shallowFocusedItemElement?.blur()

    item.focus()
    WebElementLogger.verbose(this.uid, 'onMatch', `The matched item has been focused.`)
  })

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

  onFocusIn = (): void => {
    this.focused = true
  }

  onFocusOut = (): void => {
    this.focused = false
    debounce(this.uid, this.onFocusOutDebounce, 200)
  }

  onFocusOutDebounce = (): void => {
    let firstShallowItemElement: AriaMenuItemElement | undefined

    if (this.focused) {
      return
    }

    for (let submenu of this.expandedSubMenuElements) {
      submenu.collapse()
    }

    if (this.shallowItemElements.length <= 0) {
      return
    }

    firstShallowItemElement = this.shallowItemElements[0]
    if (!firstShallowItemElement) return

    setImmutableElementAttribute(firstShallowItemElement.anchorElement || firstShallowItemElement, 'tabindex', '0')
  }

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.END:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
        this.blurFocusedItemElements()

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
        this.blurFocusedItemElements()

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
        if (!this.shallowFocusedItemElement?.subMenuElement) {
          break
        }

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
      case KeyboardEventKey.ARROW_UP:
        if (!this.shallowFocusedItemElement?.subMenuElement) {
          break
        }

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

        this.shallowFocusedItemElement.subMenuElement.shallowItemElements[this.shallowFocusedItemElement.subMenuElement.shallowItemElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item of the submenu has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.shallowFocusedItemElement?.subMenuElement) {
          this.shallowFocusedItemElement.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The submenu has been expanded.`)

          this.expanded = true

          break
        }

        break
      case KeyboardEventKey.HOME:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.END:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      default:
        this.typeahead.handle(event, this.shallowItemElements, this.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE, {
          debounceTime: this.typeaheadDebounceTime
        })
        break
    }
  }

  blurFocusedItemElements(): void {
    for (let item of this.focusedItemElements) {
      item.blur()
    }
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowFocusedItemElement ? this.shallowItemElements.indexOf(this.shallowFocusedItemElement) : -1
  }

  static properties: PropertyDeclarations = {
    collapseOnMouseLeave: { type: Boolean, attribute: 'collapse-on-mouse-leave', reflect: true },
    expandOnMouseEnter: { type: Boolean, attribute: 'expand-on-mouse-enter', reflect: true },
    typeaheadDebounceTime: { type: Number, attribute: 'typeahead-debounce-time', reflect: true },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-menu-button' },
    expandedSubMenuElement: { selector: 'q-aria-menu-submenu[expanded]' },
    expandedSubMenuElements: { selector: 'q-aria-menu-submenu[expanded]', all: true },
    focusedItemElement: { selector: 'q-aria-menu-item[focused]' },
    focusedItemElements: { selector: 'q-aria-menu-item[focused]', all: true },
    itemElements: { selector: 'q-aria-menu-item', all: true },
    shallowFocusedItemElement: { selector: 'q-aria-menu-item[depth="0"][focused]' },
    shallowItemElements: { selector: 'q-aria-menu-item[depth="0"]', all: true },
    subMenuElement: { selector: 'q-aria-menu-submenu' }
  }
}

export class AriaMenuButtonElement extends BaseElement {
  protected arai: AriaMenuButtonController = new AriaMenuButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaMenuElement

  /**
   * INTERNAL
   */
  private mouseEntered?: boolean

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

    this.rootElement.focusedItemElement?.blur()

    this.rootElement.subMenuElement.expanded = !this.rootElement.subMenuElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The menu has been ${this.rootElement.subMenuElement.expanded ? 'expanded' : 'collapsed'}.`)

    if (this.rootElement.subMenuElement.expanded) {
      this.rootElement.itemElements[0]?.focus()
      WebElementLogger.verbose(this.uid, 'onClick', `The first item has been focused.`)
    }
  }

  onMouseEnter(): void {
    this.mouseEntered = true
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has entered.`)

    if (this.rootElement.expandOnMouseEnter) {
      this.rootElement.subMenuElement?.expand()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The submenu has been expanded.`)
    }
  }

  onMouseLeave(): void {
    this.mouseEntered = false
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has left.`)

    debounce(this.uid, this.onMouseLeaveDebounce, 200)
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
      if (item['mouseEntered']) {
        return
      }
    }

    this.rootElement.subMenuElement.collapse()
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The submenu has been collapsed.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-menu', closest: true }
  }
}

export class AriaMenuItemElement extends BaseElement {
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
  private mouseEntered?: boolean

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

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name === 'expanded') {
      this.subMenuElement?.computePosition && this.subMenuElement.computePosition()
    }
  }

  onClick = (event: MouseEvent): void => {
    event.stopPropagation()

    if (this.depth > 0) {
      return
    }

    if (this.subMenuElement) {
      event.preventDefault()

      this.subMenuElement?.expand()
      WebElementLogger.verbose(this.uid, 'onClick', `The submenu has been expanded.`)
    }
  }

  onMouseEnter = (): void => {
    this.mouseEntered = true
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The mouse has entered.`)

    this.sameDepthFocusedItemElement?.blur()
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The same depth focused item has been blurred.`)

    if (this.sameDepthExpandedSubMenuElement) {
      this.sameDepthExpandedSubMenuElement.collapse()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The same depth expanded submenu has been collapsed.`)
    }

    if (this.subMenuElement) {
      if ((this.rootElement.expandOnMouseEnter && this.shallow) || this.deep || this.sameDepthExpandedSubMenuElement) {
        this.subMenuElement.expand()
        WebElementLogger.verbose(this.uid, 'onMouseEnter', `The submenu has been expanded.`)
      }
    }

    this.focus()
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The item has been focused.`)
  }

  onMouseLeave = (): void => {
    this.mouseEntered = false
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The mouse has left.`)

    debounce(this.uid, this.onMouseLeaveDebounce, 200)
  }

  onMouseLeaveDebounce = (): void => {
    if (!this.rootElement.collapseOnMouseLeave) {
      return
    }

    if (this.mouseEntered) {
      return
    }

    if (this.rootElement.buttonElement && this.rootElement.buttonElement['mouseEntered']) {
      return
    }

    if (this.subMenuElement) {
      this.subMenuElement?.collapse()
      WebElementLogger.verbose(this.uid, 'onMouseLeave', `The submenu has been collapsed.`)
    }

    if (this.depth > 0) {
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
    this.focused = true

    if (this.anchorElement) {
      this.anchorElement.focus()
      return
    }

    super.focus(options)
  }

  get deep(): boolean {
    return this.closest('q-aria-menu-submenu') !== null
  }

  get depth(): number {
    let n: number, closest: AriaMenuSubMenuElement | null | undefined

    n = 0
    closest = this.closest('q-aria-menu-submenu')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('q-aria-menu-submenu')
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
    return this.rootElement.querySelectorAll(`q-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElement(): AriaMenuItemElement | null {
    return this.rootElement.querySelector(`q-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement.querySelectorAll(`q-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthExpandedSubMenuElement(): AriaMenuSubMenuElement | null {
    return this.rootElement.querySelector(`q-aria-menu-submenu[depth="${parseNumber(this.depth as any) + 1}"][expanded]`)
  }

  get shallow(): boolean {
    return this.closest('q-aria-menu-submenu') === null
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: 'a' },
    rootElement: { selector: 'q-aria-menu', closest: true },
    subMenuElement: { selector: 'q-aria-menu-submenu' }
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

export class AriaMenuSubMenuElement extends FloatingElement {
  protected aria: AriaMenuSubMenuController = new AriaMenuSubMenuController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean

  /**
   * QUERIES
   */
  itemElement?: AriaMenuItemElement
  itemElements!: AriaMenuItemElement[]
  rootElement!: AriaMenuElement
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * INTERNAL
   */
  private typeahead: Typeahead<AriaMenuItemElement> = new Typeahead((item: AriaMenuItemElement) => {
    this.shallowFocusedItemElement?.blur()

    item.focus()
    WebElementLogger.verbose(this.uid, 'onMatch', `The matched item has been focused.`)
  })

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
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
        this.shallowFocusedItemElement?.blur()

        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          this.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next item has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        this.shallowFocusedItemElement?.blur()

        if (this.shallowFocusedItemElementIndex <= 0) {
          this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_Up', `The previous item has been focused.`)

        break
      case KeyboardEventKey.ARROW_LEFT:
        if (this.depth <= 1) {
          break
        }

        if (this.expanded) {
          event.preventDefault()
          event.stopPropagation()

          this.shallowFocusedItemElement?.blur()

          this.collapse()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The submenu has been collapsed.`)

          this.itemElement?.focus()
        }

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.depth <= 0) {
          break
        }

        if (this.shallowFocusedItemElement?.subMenuElement && this.shallowFocusedItemElement.subMenuElement.collapsed) {
          event.preventDefault()
          event.stopPropagation()

          this.shallowFocusedItemElement.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ENTER or SPACE', `The focused item submenu has been expanded.`)

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ENTER or SPACE', `The first item of the focused item submenu has been expanded.`)
        }

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        this.shallowFocusedItemElement?.anchorElement?.click()
        WebElementLogger.verbose(this.uid, 'onClick', 'ENTER or SPACE', `The focused item has been clicked.`)

        break
      case KeyboardEventKey.END:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[this.shallowItemElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.ESCAPE:
        this.shallowFocusedItemElement?.blur()

        this.collapse()
        this.itemElement?.focus()

        break
      default:
        this.typeahead.handle(event, [...this.shallowItemElements], this.rootElement.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE, {
          debounceTime: this.rootElement.typeaheadDebounceTime
        })
        break
    }
  }

  collapse(): void {
    this.expanded = false
  }

  expand(): void {
    this.expanded = true
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get depth(): number {
    let n: number, closest: AriaMenuItemElement | null | undefined

    n = 0
    closest = this.closest('q-aria-menu-item')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('q-aria-menu-item')
    }

    return n
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_SUBMENU
  }

  get referenceElement(): HTMLElement | undefined {
    return this === this.subMenuElement ? this.itemElement || this.rootElement.buttonElement : this.subMenuElement
  }

  get shallow(): boolean {
    return this.closest('q-aria-menu-item') === null
  }

  get shallowFocusedItemElement(): AriaMenuItemElement | null {
    return this.querySelector(`q-aria-menu-item[depth="${this.depth}"][focused]`)
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowFocusedItemElement ? [...this.shallowItemElements].indexOf(this.shallowFocusedItemElement) : -1
  }

  get shallowItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.querySelectorAll(`q-aria-menu-item[depth="${this.depth}"]`)
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    itemElement: { selector: 'q-aria-menu-item', closest: true },
    itemElements: { selector: 'q-aria-menu-item', all: true },
    rootElement: { selector: 'q-aria-menu', closest: true },
    subMenuElement: { selector: 'q-aria-menu-submenu', closest: true }
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

customElements.define('q-aria-menu', AriaMenuElement)
customElements.define('q-aria-menu-button', AriaMenuButtonElement)
customElements.define('q-aria-menu-item', AriaMenuItemElement)
customElements.define('q-aria-menu-submenu', AriaMenuSubMenuElement)

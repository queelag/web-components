import { debounce } from '@queelag/core'
import {
  DEFAULT_MENUBAR_TYPEAHEAD_PREDICATE,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  setImmutableElementAttribute,
  Typeahead,
  TypeaheadPredicate,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaMenuBarController, AriaMenuBarItemController, AriaMenuBarSubMenuController } from '../../controllers/aria.menu.bar.controller'
import { BaseElement } from '../core/base.element'
import { FloatingElement } from '../core/floating.element'
import { AriaMenuItemElement } from './aria.menu.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-menubar': AriaMenuBarElement
    'q-aria-menubar-item': AriaMenuBarItemElement
    'q-aria-menubar-submenu': AriaMenuBarSubMenuElement
  }
}

export class AriaMenuBarElement extends BaseElement {
  protected aria: AriaMenuBarController = new AriaMenuBarController(this)

  /**
   * PROPERTIES
   */
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaMenuBarItemElement>

  /**
   * QUERIES
   */
  expandedSubMenuElement?: AriaMenuBarSubMenuElement
  expandedSubMenuElements!: AriaMenuBarSubMenuElement[]
  focusedItemElement?: AriaMenuBarItemElement
  focusedItemElements!: AriaMenuBarItemElement[]
  itemElements!: AriaMenuBarItemElement[]
  shallowFocusedItemElement?: AriaMenuBarItemElement
  shallowItemElements!: AriaMenuBarItemElement[]

  /**
   * INTERNAL
   */
  private expanded?: boolean
  private focused?: boolean = true
  private typeahead: Typeahead<AriaMenuBarItemElement> = new Typeahead((item: AriaMenuBarItemElement) => {
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
    if (this.focused) {
      return
    }

    for (let submenu of this.expandedSubMenuElements) {
      submenu.collapse()
    }

    setImmutableElementAttribute(this.shallowItemElements[0].anchorElement || this.shallowItemElements[0], 'tabindex', '0')
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
          this.shallowItemElements[this.shallowItemElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last item has been focused.`)

          if (this.expanded) {
            this.expandedSubMenuElement?.collapse()
            this.shallowItemElements[this.shallowItemElements.length - 1].subMenuElement?.expand()
          }

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous item has been focused.`)

        if (this.expanded) {
          this.expandedSubMenuElement?.collapse()
          this.shallowItemElements[this.shallowFocusedItemElementIndex - 1].subMenuElement?.expand()
        }

        break
      case KeyboardEventKey.ARROW_RIGHT:
        this.blurFocusedItemElements()

        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          this.shallowItemElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first item has been focused.`)

          if (this.expanded) {
            this.expandedSubMenuElement?.collapse()
            this.shallowItemElements[0].subMenuElement?.expand()
          }

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex + 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next item has been focused.`)

        if (this.expanded) {
          this.expandedSubMenuElement?.collapse()
          this.shallowItemElements[this.shallowFocusedItemElementIndex + 1].subMenuElement?.expand()
        }

        break
      case KeyboardEventKey.ARROW_DOWN:
        if (!this.shallowFocusedItemElement?.subMenuElement) {
          break
        }

        if (this.collapsed) {
          this.shallowFocusedItemElement.subMenuElement.expand()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The submenu has been expanded.`)

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item of the submenu has been focused.`)

          this.expanded = true

          break
        }

        this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0].focus()
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
          ].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item of the submenu has been focused.`)

          this.expanded = true

          break
        }

        this.shallowFocusedItemElement.subMenuElement.shallowItemElements[this.shallowFocusedItemElement.subMenuElement.shallowItemElements.length - 1].focus()
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

        this.shallowItemElements[0].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.END:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[this.shallowItemElements.length - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      default:
        this.typeahead.handle(event, this.shallowItemElements, this.typeaheadPredicate ?? DEFAULT_MENUBAR_TYPEAHEAD_PREDICATE, {
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
    return ElementName.ARIA_MENUBAR
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowFocusedItemElement ? this.shallowItemElements.indexOf(this.shallowFocusedItemElement) : -1
  }

  static properties: PropertyDeclarations = {
    typeaheadDebounceTime: { type: Number, attribute: 'typeahead-debounce-time', reflect: true },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    expandedSubMenuElement: { selector: 'q-aria-menubar-submenu[expanded]' },
    expandedSubMenuElements: { selector: 'q-aria-menubar-submenu[expanded]', all: true },
    focusedItemElement: { selector: 'q-aria-menubar-item[focused]' },
    focusedItemElements: { selector: 'q-aria-menubar-item[focused]', all: true },
    itemElements: { selector: 'q-aria-menubar-item', all: true },
    shallowFocusedItemElement: { selector: 'q-aria-menubar-item[depth="0"][focused]' },
    shallowItemElements: { selector: 'q-aria-menubar-item[depth="0"]', all: true }
  }
}

export class AriaMenuBarItemElement extends BaseElement {
  protected aria: AriaMenuBarItemController = new AriaMenuBarItemController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean
  label?: string

  /**
   * QUERIES
   */
  anchorElement?: HTMLAnchorElement
  rootElement!: AriaMenuBarElement
  subMenuElement?: AriaMenuBarSubMenuElement

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
      this.subMenuElement.expand()
      WebElementLogger.verbose(this.uid, 'onMouseEnter', `The submenu has been expanded.`)
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
    if (this.mouseEntered) {
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
    return this.closest('q-aria-menubar-submenu') !== null
  }

  get depth(): number {
    let n: number, closest: AriaMenuBarSubMenuElement | null | undefined

    n = 0
    closest = this.closest('q-aria-menubar-submenu')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('q-aria-menubar-submenu')
    }

    return n
  }

  get index(): number {
    return [...this.rootElement.itemElements].indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_MENUBAR_ITEM
  }

  get sameDepthItemElements(): NodeListOf<AriaMenuBarItemElement> {
    return this.rootElement.querySelectorAll(`q-aria-menubar-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElement(): AriaMenuItemElement | null {
    return this.rootElement.querySelector(`q-aria-menubar-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthFocusedItemElements(): NodeListOf<AriaMenuBarItemElement> {
    return this.rootElement.querySelectorAll(`q-aria-menubar-item[depth="${this.depth}"][focused]`)
  }

  get sameDepthExpandedSubMenuElement(): AriaMenuBarSubMenuElement | null {
    return this.rootElement.querySelector(`q-aria-menubar-submenu[depth="${this.subMenuElement?.depth}"][expanded]`)
  }

  get shallow(): boolean {
    return this.closest('q-aria-menubar-submenu') === null
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: 'a' },
    rootElement: { selector: 'q-aria-menubar', closest: true },
    subMenuElement: { selector: 'q-aria-menubar-submenu' }
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

export class AriaMenuBarSubMenuElement extends FloatingElement {
  protected aria: AriaMenuBarSubMenuController = new AriaMenuBarSubMenuController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean

  /**
   * QUERIES
   */
  itemElement!: AriaMenuBarItemElement
  rootElement!: AriaMenuBarElement
  subMenuElement?: AriaMenuBarSubMenuElement

  /**
   * INTERNAL
   */
  private typeahead: Typeahead<AriaMenuBarItemElement> = new Typeahead((item: AriaMenuBarItemElement) => {
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
          this.shallowItemElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex + 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next item has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        this.shallowFocusedItemElement?.blur()

        if (this.shallowFocusedItemElementIndex <= 0) {
          this.shallowItemElements[this.shallowItemElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item has been focused.`)

          break
        }

        this.shallowItemElements[this.shallowFocusedItemElementIndex - 1].focus()
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

          this.itemElement.focus()
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

          this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0].focus()
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

        this.shallowItemElements[this.shallowItemElements.length - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.shallowFocusedItemElement?.blur()

        this.shallowItemElements[0].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      case KeyboardEventKey.ESCAPE:
        this.shallowFocusedItemElement?.blur()

        this.collapse()
        this.itemElement.focus()

        break
      default:
        this.typeahead.handle(event, [...this.shallowItemElements], this.rootElement.typeaheadPredicate ?? DEFAULT_MENUBAR_TYPEAHEAD_PREDICATE, {
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
    let n: number, closest: AriaMenuBarItemElement | null | undefined

    n = 0
    closest = this.closest('q-aria-menubar-item')

    while (typeof closest === 'object' && closest !== null) {
      n++
      closest = closest.parentElement?.closest('q-aria-menubar-item')
    }

    return n
  }

  get name(): ElementName {
    return ElementName.ARIA_MENUBAR_SUBMENU
  }

  get referenceElement(): HTMLElement | undefined {
    return this === this.subMenuElement ? this.itemElement : this.subMenuElement
  }

  get shallowFocusedItemElement(): AriaMenuBarItemElement | null {
    return this.querySelector(`q-aria-menubar-item[depth="${this.depth}"][focused]`)
  }

  get shallowFocusedItemElementIndex(): number {
    return this.shallowFocusedItemElement ? [...this.shallowItemElements].indexOf(this.shallowFocusedItemElement) : -1
  }

  get shallowItemElements(): NodeListOf<AriaMenuBarItemElement> {
    return this.querySelectorAll(`q-aria-menubar-item[depth="${this.depth}"]`)
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    itemElement: { selector: 'q-aria-menubar-item', closest: true },
    rootElement: { selector: 'q-aria-menubar', closest: true },
    subMenuElement: { selector: 'q-aria-menubar-submenu', closest: true }
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

customElements.define('q-aria-menubar', AriaMenuBarElement)
customElements.define('q-aria-menubar-item', AriaMenuBarItemElement)
customElements.define('q-aria-menubar-submenu', AriaMenuBarSubMenuElement)

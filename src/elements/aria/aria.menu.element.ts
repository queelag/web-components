import { ElementName, KeyboardEventKey, QueryDeclarations, scrollElementIntoView, Typeahead, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaMenuButtonController, AriaMenuController, AriaMenuItemController, AriaMenuListController } from '../../controllers/aria.menu.controller'
import { BaseElement } from '../core/base.element'
import { FloatingElement } from '../core/floating.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-menu': AriaMenuElement
    'q-aria-menu-button': AriaMenuButtonElement
    'q-aria-menu-item': AriaMenuItemElement
    'q-aria-menu-list': AriaMenuListElement
  }
}

export class AriaMenuElement extends BaseElement {
  protected aria: AriaMenuController = new AriaMenuController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean
  // navigation?: boolean

  /**
   * QUERIES
   */
  buttonElement!: AriaMenuButtonElement
  focusedItemElement?: AriaMenuItemElement
  itemElements!: AriaMenuItemElement[]
  listElement?: AriaMenuListElement

  /**
   * INTERNAL
   */
  private typeahead: Typeahead<AriaMenuItemElement> = new Typeahead((element: AriaMenuItemElement) => {
    this.focusedItemElement?.blur()

    element.focus()
    WebElementLogger.verbose(this.uid, 'onMatch', `The matched item has been focused.`)
  })

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('focusout', this.onFocusOut)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('focusout', this.onFocusOut)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)
    this.listElement?.computePosition && this.listElement?.computePosition()
  }

  onFocusOut = (): void => {
    this.listElement?.scrollTo(0, 0)

    this.expanded = false
    WebElementLogger.verbose(this.uid, 'onFocusOut', `The menu has been collapsed.`)
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
      case KeyboardEventKey.END:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        this.focusedItemElement?.blur()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.collapsed) {
          this.expanded = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ENTER or SPACE', `The menu has been expanded.`)

          this.itemElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ENTER or SPACE', `The first item has been focused.`)

          break
        }

        if (event.key === KeyboardEventKey.ARROW_DOWN) {
          if (this.focusedItemElementIndex >= this.itemElements.length - 1) {
            this.itemElements[0].focus()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The first item has been focused.`)

            break
          }

          this.itemElements[this.focusedItemElementIndex + 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN', `The next item has been focused.`)

          break
        }

        this.focusedItemElement?.click()

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.collapsed) {
          this.expanded = true
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The menu has been expanded.`)

          this.itemElements[this.itemElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item has been focused.`)

          break
        }

        if (this.focusedItemElementIndex <= 0) {
          this.itemElements[this.itemElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The last item has been focused.`)

          break
        }

        this.itemElements[this.focusedItemElementIndex - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP', `The previous item has been focused.`)

        break
      case KeyboardEventKey.END:
        if (this.collapsed) {
          return
        }

        this.itemElements[this.itemElements.length - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last item has been focused.`)

        break
      case KeyboardEventKey.ESCAPE:
        this.listElement?.scrollTo(0, 0)

        this.expanded = false
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The menu has been collapsed.`)

        this.buttonElement.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ESCAPE', `The button has been focused.`)

        break
      case KeyboardEventKey.HOME:
        if (this.collapsed) {
          return
        }

        this.itemElements[0].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first item has been focused.`)

        break
      default:
        if (this.collapsed) {
          return
        }

        this.typeahead.handle(event, this.itemElements)
        break
    }
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get focusedItemElementIndex(): number {
    return this.focusedItemElement ? this.itemElements.indexOf(this.focusedItemElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
    // navigation: {type: Boolean, reflect: true}
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-menu-button' },
    focusedItemElement: { selector: 'q-aria-menu-item[focused]' },
    itemElements: { selector: 'q-aria-menu-item', all: true },
    listElement: { selector: 'q-aria-menu-list' }
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

export class AriaMenuButtonElement extends BaseElement {
  protected arai: AriaMenuButtonController = new AriaMenuButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaMenuElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    this.rootElement.focusedItemElement?.blur()

    this.rootElement.expanded = !this.rootElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The menu has been ${this.rootElement.expanded ? 'expanded' : 'collapsed'}.`)

    if (this.rootElement.expanded) {
      this.rootElement.itemElements[0].focus()
      WebElementLogger.verbose(this.uid, 'onClick', `The first item has been focused.`)
    }
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-menu', closest: true }
  }
}

export class AriaMenuListElement extends FloatingElement {
  protected aria: AriaMenuListController = new AriaMenuListController(this)

  /**
   * QUERIES
   */
  focusedItemElement?: AriaMenuItemElement
  rootElement!: AriaMenuElement

  get name(): ElementName {
    return ElementName.ARIA_MENU_ITEM
  }

  get referenceElement(): HTMLElement {
    return this.rootElement.buttonElement
  }

  static queries: QueryDeclarations = {
    focusedItemElement: { selector: 'q-aria-menu-item[focused]' },
    rootElement: { selector: 'q-aria-menu', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        left: 0;
        overflow-y: auto;
        position: absolute;
        right: 0;
        z-index: 2;
      }
    `
  ]
}

export class AriaMenuItemElement extends BaseElement {
  protected aria: AriaMenuItemController = new AriaMenuItemController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean

  /**
   * QUERIES
   */
  anchorElement?: HTMLAnchorElement
  listElement!: AriaMenuListElement
  rootElement!: AriaMenuElement

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

    if (name === 'focused') {
      scrollElementIntoView(this.listElement, this)
      WebElementLogger.verbose(this.uid, ' attributeChangedCallback', `The item has been scrolled into view.`)
    }
  }

  onClick = (): void => {
    this.rootElement.expanded = false
    WebElementLogger.verbose(this.uid, 'onClick', `The menu has been collapsed.`)

    this.anchorElement?.click()
  }

  onMouseDown = (event: MouseEvent): void => {
    event.preventDefault()
  }

  focus(): void {
    this.focused = true
    // this.anchorElement?.focus()
  }

  blur(): void {
    this.focused = false
    // this.anchorElement?.blur()
  }

  get name(): ElementName {
    return ElementName.ARIA_MENU_ITEM
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: 'a' },
    listElement: { selector: 'q-aria-menu-list', closest: true },
    rootElement: { selector: 'q-aria-menu', closest: true }
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

customElements.define('q-aria-menu', AriaMenuElement)
customElements.define('q-aria-menu-button', AriaMenuButtonElement)
customElements.define('q-aria-menu-item', AriaMenuItemElement)
customElements.define('q-aria-menu-list', AriaMenuListElement)

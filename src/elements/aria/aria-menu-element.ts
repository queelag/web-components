import { debounce, parseNumber, typeahead, type TypeaheadPredicate } from '@aracna/core'
import { defineCustomElement, KeyboardEventKey, setImmutableElementAttribute } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaMenuButtonController, AriaMenuController, AriaMenuItemController, AriaMenuSubMenuController } from '../../controllers/aria-menu-controller.js'
import { DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME, DEFAULT_MENU_TYPEAHEAD_PREDICATE } from '../../definitions/constants.js'
import { ElementSlug } from '../../definitions/enums.js'
import type {
  AriaMenuButtonElementEventMap,
  AriaMenuElementEventMap,
  AriaMenuItemElementEventMap,
  AriaMenuSubMenuElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { MenuSubMenuCollapseEvent } from '../../events/menu-sub-menu-collapse-event.js'
import { MenuSubMenuExpandEvent } from '../../events/menu-sub-menu-expand-event.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFloatingElement as FloatingElement } from '../core/floating-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-menu': AriaMenuElement
    'aracna-aria-menu-button': AriaMenuButtonElement
    'aracna-aria-menu-item': AriaMenuItemElement
    'aracna-aria-menu-submenu': AriaMenuSubMenuElement
  }
}

class AriaMenuElement<E extends AriaMenuElementEventMap = AriaMenuElementEventMap> extends BaseElement<E> {
  protected aria: AriaMenuController = new AriaMenuController(this)

  /**
   * Properties
   */
  /** */
  collapseDebounceTime?: number
  collapseOnPointerLeave?: boolean
  expandOnPointerEnter?: boolean
  label?: string
  typeaheadDebounceTime?: number
  typeaheadPredicate?: TypeaheadPredicate<AriaMenuItemElement>

  /**
   * Queries
   */
  /** */
  buttonElement?: AriaMenuButtonElement
  expandedSubMenuElement?: AriaMenuSubMenuElement
  expandedSubMenuElements!: AriaMenuSubMenuElement[]
  focusedItemElement?: AriaMenuItemElement
  itemElements!: AriaMenuItemElement[]
  shallowFocusedItemElement?: AriaMenuItemElement
  shallowItemElements!: AriaMenuItemElement[]
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * Internals
   */
  /** */
  expanded?: boolean
  focused?: boolean

  constructor() {
    super()

    this.focused = true
  }

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

  onFocusIn(): void {
    ElementLogger.verbose(this.uid, 'onFocusIn', `Marking the menu as focused.`)
    this.focus()
  }

  onFocusOut(): void {
    ElementLogger.verbose(this.uid, 'onFocusOut', `Marking the menu as blurred.`)
    this.blur()

    debounce(this.onFocusOutDebounce, this.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME, this.uid)
  }

  onFocusOutDebounce = (): void => {
    if (this.focused) {
      return ElementLogger.verbose(this.uid, 'onFocusOutDebounce', `The menu is still focused.`)
    }

    for (let submenu of this.expandedSubMenuElements) {
      ElementLogger.verbose(this.uid, 'onFocusOutDebounce', `Collapsing a submenu.`, submenu)
      submenu.collapse()
    }

    ElementLogger.verbose(this.uid, 'onFocusOutDebounce', `Marking the menu as collapsed.`)
    this.collapse()

    if (this.focusedItemElement) {
      ElementLogger.verbose(this.uid, 'onFocusOutDebounce', `Blurring the focused item.`, this.focusedItemElement)
      this.focusedItemElement.blur()
    }

    if (this.buttonElement) {
      return
    }

    if (this.shallowItemElements[0]) {
      setImmutableElementAttribute(this.shallowItemElements[0], 'tabindex', '0')
      ElementLogger.verbose(this.uid, 'onFocusOutDebounce', `The first item has been made focusable.`)
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
      case KeyboardEventKey.ESCAPE:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT: {
        let item: AriaMenuItemElement | undefined

        if (this.buttonElement) {
          break
        }

        if (this.shallowFocusedItemElementIndex <= 0) {
          item = this.shallowItemElements[this.shallowItemElements.length - 1]

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item.`, item)
            item.focus()
          }

          if (this.collapsed) {
            break
          }

          if (this.expandedSubMenuElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the expanded submenu.`, this.expandedSubMenuElement)
            this.expandedSubMenuElement.collapse()
          }

          if (item?.subMenuElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the last item submenu.`, item.subMenuElement)
            item.subMenuElement.expand()
          }

          break
        }

        item = this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]

        if (item) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the previous item.`, item)
          item.focus()
        }

        if (this.collapsed) {
          break
        }

        if (this.expandedSubMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the expanded submenu.`, this.expandedSubMenuElement)
          this.expandedSubMenuElement.collapse()
        }

        if (item?.subMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the previous item submenu.`, item.subMenuElement)
          item.subMenuElement.expand()
        }

        break
      }
      case KeyboardEventKey.ARROW_RIGHT: {
        let item: AriaMenuItemElement | undefined

        if (this.buttonElement) {
          break
        }

        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          item = this.shallowItemElements[0]

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item.`, item)
            item.focus()
          }

          if (this.collapsed) {
            break
          }

          if (this.expandedSubMenuElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the expanded submenu.`, this.expandedSubMenuElement)
            this.expandedSubMenuElement.collapse()
          }

          if (item?.subMenuElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the first item submenu.`, item.subMenuElement)
            item.subMenuElement.expand()
          }

          break
        }

        item = this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]

        if (item) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the next item.`, item)
          item.focus()
        }

        if (this.collapsed) {
          break
        }

        if (this.expandedSubMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the expanded submenu.`, this.expandedSubMenuElement)
          this.expandedSubMenuElement.collapse()
        }

        if (item?.subMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the next item submenu.`, item.subMenuElement)
          item.subMenuElement.expand()
        }

        break
      }
      case KeyboardEventKey.ARROW_DOWN: {
        let item: AriaMenuItemElement | undefined

        if (this.buttonElement && this.subMenuElement) {
          item = this.subMenuElement.shallowItemElements[0]

          if (this.collapsed) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.subMenuElement)
            this.subMenuElement.expand()

            if (item) {
              item.focus()
              ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first item of the submenu has been focused.`)
            }

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
            this.expand()

            break
          }

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item of the submenu.`, item)
            item.focus()
          }

          break
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          item = this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]

          if (this.collapsed) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.shallowFocusedItemElement.subMenuElement)
            this.shallowFocusedItemElement.subMenuElement.expand()

            if (item) {
              ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item of the submenu.`, item)
              item.focus()
            }

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
            this.expand()

            break
          }

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item of the submenu.`, item)
            item.focus()
          }

          break
        }

        break
      }
      case KeyboardEventKey.ARROW_UP: {
        let item: AriaMenuItemElement | undefined

        if (this.buttonElement && this.subMenuElement) {
          item = this.subMenuElement.shallowItemElements[this.subMenuElement.shallowItemElements.length - 1]

          if (this.collapsed) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.subMenuElement)
            this.subMenuElement.expand()

            if (item) {
              ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item of the submenu.`, item)
              item.focus()
            }

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
            this.expand()

            break
          }

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item of the submenu.`, item)
            item.focus()
          }

          break
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          item = this.shallowFocusedItemElement.subMenuElement.shallowItemElements[this.shallowFocusedItemElement.subMenuElement.shallowItemElements.length - 1]

          if (this.collapsed) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.shallowFocusedItemElement.subMenuElement)
            this.shallowFocusedItemElement.subMenuElement.expand()

            if (item) {
              ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item of the submenu.`, item)
              item.focus()
            }

            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
            this.expand()

            break
          }

          if (item) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item of the submenu.`, item)
            item.focus()
          }

          break
        }

        break
      }
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.buttonElement && this.subMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.subMenuElement)
          this.subMenuElement.expand()

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
          this.expand()
        }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the submenu.`, this.shallowFocusedItemElement.subMenuElement)
          this.shallowFocusedItemElement.subMenuElement.expand()

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as expanded.`)
          this.expand()

          break
        }

        if (this.shallowFocusedItemElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the focused item.`, this.shallowFocusedItemElement)
          this.shallowFocusedItemElement.click()
        }

        break
      case KeyboardEventKey.ESCAPE:
        if (this.collapsed) {
          break
        }

        if (this.buttonElement && this.subMenuElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the submenu.`, this.subMenuElement)
          this.subMenuElement.collapse()

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as collapsed.`)
          this.collapse()
        }

        break
      case KeyboardEventKey.HOME: {
        let item: AriaMenuItemElement | undefined

        item = this.shallowItemElements[0]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item.`, item)
        item.focus()

        break
      }
      case KeyboardEventKey.END: {
        let item: AriaMenuItemElement | undefined

        item = this.shallowItemElements[this.shallowItemElements.length - 1]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item.`, item)
        item.focus()

        break
      }
      default:
        if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        if (this.buttonElement && this.subMenuElement) {
          typeahead<AriaMenuItemElement>(this.uid, event.key)
            .setDebounceTime(this.typeaheadDebounceTime)
            .setItems([...this.subMenuElement.shallowItemElements])
            .setListeners([])
            .setPredicate(this.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE)
            .on('match', this.onTypeaheadMatch)

          break
        }

        typeahead<AriaMenuItemElement>(this.uid, event.key)
          .setDebounceTime(this.typeaheadDebounceTime)
          .setItems(this.shallowItemElements)
          .setListeners([])
          .setPredicate(this.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE)
          .on('match', this.onTypeaheadMatch)

        break
    }
  }

  onTypeaheadMatch = (item: AriaMenuItemElement) => {
    ElementLogger.verbose(this.uid, 'onTypeaheadMatch', `Focusing the matched item.`, item)
    item.focus()
  }

  collapse(): void {
    this.expanded = false
    ElementLogger.verbose(this.uid, 'collapse', `The menu has been marked as collapsed.`)
  }

  expand(): void {
    this.expanded = true
    ElementLogger.verbose(this.uid, 'expand', `The menu has been marked as expanded.`)
  }

  blur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'blur', `The menu has been marked as blurred.`)
  }

  focus(): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'focus', `The menu has been marked as focused.`)
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_MENU
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
    collapseDebounceTime: {
      type: Number,
      attribute: 'collapse-debounce-time',
      reflect: true
    },
    collapseOnPointerLeave: {
      type: Boolean,
      attribute: 'collapse-on-pointer-leave',
      reflect: true
    },
    expandOnPointerEnter: {
      type: Boolean,
      attribute: 'expand-on-pointer-enter',
      reflect: true
    },
    label: { type: String, reflect: true },
    typeaheadDebounceTime: {
      type: Number,
      attribute: 'typeahead-debounce-time',
      reflect: true
    },
    typeaheadPredicate: { type: Function, attribute: 'typeahead-predicate' }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-menu-button' },
    expandedSubMenuElement: { selector: 'aracna-aria-menu-submenu[expanded]' },
    expandedSubMenuElements: {
      selector: 'aracna-aria-menu-submenu[expanded]',
      all: true
    },
    focusedItemElement: { selector: 'aracna-aria-menu-item[focused]' },
    itemElements: { selector: 'aracna-aria-menu-item', all: true },
    shallowFocusedItemElement: {
      selector: 'aracna-aria-menu-item[depth="0"][focused]'
    },
    shallowItemElements: {
      selector: 'aracna-aria-menu-item[depth="0"]',
      all: true
    },
    subMenuElement: { selector: 'aracna-aria-menu-submenu' }
  }
}

class AriaMenuButtonElement<E extends AriaMenuButtonElementEventMap = AriaMenuButtonElementEventMap> extends BaseElement<E> {
  protected arai: AriaMenuButtonController = new AriaMenuButtonController(this)

  /**
   * Queries
   */
  /** */
  rootElement?: AriaMenuElement

  /**
   * Internals
   */
  /** */
  pointerEntered?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
  }

  onClick(): void {
    let submenu: AriaMenuSubMenuElement | undefined

    submenu = this.rootElement?.subMenuElement
    if (!submenu) return

    ElementLogger.verbose(this.uid, 'onClick', `${submenu.collapsed ? 'Expanding' : 'Collapsing'} the submenu.`, submenu)
    submenu.toggle()

    if (submenu.collapsed) {
      this.focus()
      ElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
    }

    if (submenu.expanded) {
      let item: AriaMenuItemElement | undefined

      item = this.rootElement?.itemElements[0]
      if (!item) return

      ElementLogger.verbose(this.uid, 'onClick', `Focusing the first item.`, item)
      item.focus()
    }
  }

  onPointerEnter(): void {
    this.pointerEntered = true
    ElementLogger.verbose(this.uid, 'onPointerEnter', `The pointer has entered.`)

    if (this.rootElement?.expandOnPointerEnter) {
      if (this.rootElement.subMenuElement) {
        ElementLogger.verbose(this.uid, 'onPointerEnter', `Expanding the submenu.`, this.rootElement.subMenuElement)
        this.rootElement.subMenuElement.expand()
      }

      this.focus()
      ElementLogger.verbose(this.uid, 'onPointerEnter', `The button has been focused.`)
    }
  }

  onPointerLeave(): void {
    this.pointerEntered = false
    ElementLogger.verbose(this.uid, 'onPointerEnter', `The pointer has left.`)

    debounce(this.onPointerLeaveDebounce, this.rootElement?.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME, this.uid)
  }

  onPointerLeaveDebounce = (): void => {
    if (!this.rootElement?.collapseOnPointerLeave) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The menu should not collapse on pointer leave.`)
    }

    if (this.pointerEntered) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The pointer is still inside.`)
    }

    if (!this.rootElement.subMenuElement) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The menu has no submenu.`)
    }

    for (let item of this.rootElement.subMenuElement.itemElements) {
      if (item.pointerEntered) {
        return ElementLogger.verbose(this.uid, 'onPointerLeave', `The pointer is still inside of the items.`, item)
      }
    }

    ElementLogger.verbose(this.uid, 'onPointerLeave', `Collapsing the submenu.`, this.rootElement.subMenuElement)
    this.rootElement.subMenuElement.collapse()

    this.focus()
    ElementLogger.verbose(this.uid, 'onPointerLeave', `The button has been focused.`)
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_MENU_BUTTON
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

class AriaMenuItemElement<E extends AriaMenuItemElementEventMap = AriaMenuItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaMenuItemController = new AriaMenuItemController(this)

  /**
   * Properties
   */
  /** */
  focused?: boolean
  headline?: string

  /**
   * Queries
   */
  /** */
  anchorElement?: HTMLAnchorElement
  rootElement?: AriaMenuElement
  subMenuElement?: AriaMenuSubMenuElement

  /**
   * Internals
   */
  /** */
  pointerEntered?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('blur', this.onBlur)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (name === 'expanded' && this.subMenuElement) {
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Computing the submenu position.`, this.subMenuElement)
      this.subMenuElement.computePosition()
    }
  }

  onBlur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The item has been blurred.`)
  }

  onFocus(): void {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The item has been focused.`)
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation()

    if (this.anchorElement?.href) {
      ElementLogger.verbose(this.uid, 'onClick', `Clicking the anchor.`, this.anchorElement)
      this.anchorElement.click()

      return
    }

    if (this.deep) {
      return ElementLogger.verbose(this.uid, 'onClick', `The item is deep, stopping here.`)
    }

    if (this.subMenuElement) {
      event.preventDefault()

      ElementLogger.verbose(this.uid, 'onClick', `${this.subMenuElement.expanded ? 'Collapsing' : 'Expanding'} the submenu.`, this.subMenuElement)
      this.subMenuElement.toggle()
    }
  }

  onPointerEnter(): void {
    this.pointerEntered = true
    ElementLogger.verbose(this.uid, 'onPointerEnter', `The pointer is inside.`)

    if (this.sameDepthExpandedSubMenuElement) {
      ElementLogger.verbose(this.uid, 'onPointerEnter', `Collapsing the same depth submenu.`, this.sameDepthExpandedSubMenuElement)
      this.sameDepthExpandedSubMenuElement.collapse()
    }

    if (this.subMenuElement) {
      switch (true) {
        case this.rootElement?.expanded:
        case this.rootElement?.expandOnPointerEnter && this.shallow:
        // case this.sameDepthExpandedSubMenuElement !== null:
        case this.subMenuElement.deep:
          ElementLogger.verbose(this.uid, 'onPointerEnter', `Expanding the submenu.`, this.subMenuElement)
          this.subMenuElement.expand()

          break
      }
    }

    ElementLogger.verbose(this.uid, 'onPointerEnter', `Focusing the item.`)
    this.focus()
  }

  onPointerLeave(): void {
    this.pointerEntered = false
    ElementLogger.verbose(this.uid, 'onPointerLeave', `The pointer is outside.`)

    debounce(this.onPointerLeaveDebounce, this.rootElement?.collapseDebounceTime ?? DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME, this.uid)
  }

  onPointerLeaveDebounce = (): void => {
    if (!this.rootElement?.collapseOnPointerLeave) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The menu should not collapse on pointer leave.`)
    }

    if (this.pointerEntered) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The pointer is still inside.`)
    }

    if (this.rootElement.buttonElement?.pointerEntered) {
      return ElementLogger.verbose(this.uid, 'onPointerLeave', `The pointer is inside the button.`)
    }

    if (this.subMenuElement) {
      ElementLogger.verbose(this.uid, 'onPointerLeave', `Collapsing the submenu.`, this.subMenuElement)
      this.subMenuElement.collapse()
    }

    if (this.deep) {
      ElementLogger.verbose(this.uid, 'onPointerLeave', `Blurring the item.`)
      this.blur()
    }
  }

  blur(): void {
    this.focused = false
    ElementLogger.verbose(this.uid, 'blur', `The item has been blurred.`)

    if (this.anchorElement) {
      this.anchorElement.blur()
      ElementLogger.verbose(this.uid, 'blur', `The anchor has been blurred.`, this.anchorElement)

      return
    }

    super.blur()
  }

  focus(options?: FocusOptions | undefined): void {
    if (this.rootElement?.focusedItemElement) {
      ElementLogger.verbose(this.uid, 'focus', `Blurring the focused item.`, this.rootElement.focusedItemElement)
      this.rootElement.focusedItemElement.blur()
    }

    this.focused = true
    ElementLogger.verbose(this.uid, 'focus', `The item has been focused.`)

    if (this.anchorElement) {
      this.anchorElement.focus()
      ElementLogger.verbose(this.uid, 'focus', `The anchor has been focused.`, this.anchorElement)

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

    n = this.rootElement?.buttonElement ? 1 : 0
    closest = this.parentElement?.closest('aracna-aria-menu-item')

    while (typeof closest === 'object' && closest !== null && closest !== this) {
      n++
      closest = closest.parentElement?.closest('aracna-aria-menu-item')
    }

    return n
  }

  get index(): number {
    return this.rootElement ? [...this.rootElement.itemElements].indexOf(this) : -1
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_MENU_ITEM
  }

  get sameDepthItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement?.querySelectorAll(`aracna-aria-menu-item[depth="${this.depth}"][focused]`) ?? (new NodeList() as any)
  }

  get sameDepthFocusedItemElement(): AriaMenuItemElement | null {
    return this.rootElement?.querySelector(`aracna-aria-menu-item[depth="${this.depth}"][focused]`) ?? null
  }

  get sameDepthFocusedItemElements(): NodeListOf<AriaMenuItemElement> {
    return this.rootElement?.querySelectorAll(`aracna-aria-menu-item[depth="${this.depth}"][focused]`) ?? (new NodeList() as any)
  }

  get sameDepthExpandedSubMenuElement(): AriaMenuSubMenuElement | null {
    return this.rootElement?.querySelector(`aracna-aria-menu-submenu[depth="${this.depth}"][expanded]`) ?? null
  }

  get shallow(): boolean {
    return !this.deep
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true },
    headline: { type: String, reflect: true }
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

class AriaMenuSubMenuElement<E extends AriaMenuSubMenuElementEventMap = AriaMenuSubMenuElementEventMap> extends FloatingElement<E> {
  protected aria: AriaMenuSubMenuController = new AriaMenuSubMenuController(this)

  /**
   * Properties
   */
  /** */
  expanded?: boolean

  /**
   * Queries
   */
  /** */
  itemElements!: AriaMenuItemElement[]
  parentItemElement?: AriaMenuItemElement
  parentSubMenuElement?: AriaMenuSubMenuElement
  rootElement?: AriaMenuElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
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

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN: {
        let item: AriaMenuItemElement | undefined

        if (this.shallowFocusedItemElementIndex >= this.shallowItemElements.length - 1) {
          item = this.shallowItemElements[0]
          if (!item) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item.`, item)
          item.focus()

          break
        }

        item = this.shallowItemElements[this.shallowFocusedItemElementIndex + 1]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the next item.`, item)
        item.focus()

        break
      }
      case KeyboardEventKey.ARROW_UP: {
        let item: AriaMenuItemElement | undefined

        if (this.shallowFocusedItemElementIndex <= 0) {
          item = this.shallowItemElements[this.shallowItemElements.length - 1]
          if (!item) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item.`, item)
          item.focus()

          break
        }

        item = this.shallowItemElements[this.shallowFocusedItemElementIndex - 1]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the previous item.`, item)
        item.focus()

        break
      }
      case KeyboardEventKey.ARROW_LEFT:
        if (this.shallow) {
          break
        }

        if (this.expanded) {
          event.preventDefault()
          event.stopPropagation()

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the submenu.`)
          this.collapse()

          if (this.parentItemElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the parent item.`)
            this.parentItemElement.focus()
          }
        }

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE: {
        let item: AriaMenuItemElement | undefined

        // if (this.shallow) {
        //   break
        // }

        if (this.shallowFocusedItemElement?.subMenuElement) {
          if (this.shallowFocusedItemElement.subMenuElement.expanded) {
            break
          }

          event.preventDefault()
          event.stopPropagation()

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Expanding the focused item submenu.`, this.shallowFocusedItemElement.subMenuElement)
          this.shallowFocusedItemElement.subMenuElement.expand()

          item = this.shallowFocusedItemElement.subMenuElement.shallowItemElements[0]
          if (!item) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item.`, item)
          item.focus()

          break
        }

        if (event.key !== KeyboardEventKey.ARROW_RIGHT && this.shallowFocusedItemElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the focused item.`, this.shallowFocusedItemElement)
          this.shallowFocusedItemElement.click()
        }

        break
      }
      case KeyboardEventKey.ESCAPE:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Collapsing the submenu.`)
        this.collapse()

        if (this.shallow && this.rootElement?.buttonElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Marking the menu as collapsed.`)
          this.rootElement.collapse()

          if (this.rootElement.focusedItemElement) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Blurring the focused item.`, this.rootElement.focusedItemElement)
            this.rootElement.focusedItemElement.blur()
          }

          this.rootElement.buttonElement.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The button has been focused.`)

          break
        }

        if (this.parentItemElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the parent item.`, this.parentItemElement)
          this.parentItemElement.focus()
        }

        break
      case KeyboardEventKey.HOME: {
        let item: AriaMenuItemElement | undefined

        item = this.shallowItemElements[0]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the first item.`, item)
        item.focus()

        break
      }
      case KeyboardEventKey.END: {
        let item: AriaMenuItemElement | undefined

        item = this.shallowItemElements[this.shallowItemElements.length - 1]
        if (!item) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Focusing the last item.`, item)
        item.focus()

        break
      }
      default:
        if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
          break
        }

        event.preventDefault()
        event.stopPropagation()

        typeahead<AriaMenuItemElement>(this.uid, event.key)
          .setDebounceTime(this.rootElement?.typeaheadDebounceTime)
          .setItems([...this.shallowItemElements])
          .setListeners([])
          .setPredicate(this.rootElement?.typeaheadPredicate ?? DEFAULT_MENU_TYPEAHEAD_PREDICATE)
          .on('match', this.onTypeaheadMatch)

        break
    }
  }

  onTypeaheadMatch = (item: AriaMenuItemElement) => {
    ElementLogger.verbose(this.uid, 'onMatch', `Focusing the matched item.`, item)
    item.focus()
  }

  toggle(): void {
    if (this.expanded) {
      return this.collapse()
    }

    this.expand()
  }

  collapse(): void {
    this.expanded = false
    ElementLogger.verbose(this.uid, 'collapse', `The submenu has been collapsed.`)

    this.dispatchEvent(new MenuSubMenuCollapseEvent())
    ElementLogger.verbose(this.uid, 'collapse', `The "collapse" event has been dispatched.`)
  }

  expand(): void {
    this.expanded = true
    ElementLogger.verbose(this.uid, 'expand', `The submenu has been expanded.`)

    if (this.rootElement) {
      ElementLogger.verbose(this.uid, 'expand', `Marking the menu as expanded.`)
      this.rootElement.expand()
    }

    this.dispatchEvent(new MenuSubMenuExpandEvent())
    ElementLogger.verbose(this.uid, 'expand', `The "expand" event has been dispatched.`)
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

  get slug(): ElementSlug {
    return ElementSlug.ARIA_MENU_SUBMENU
  }

  get referenceElement(): HTMLElement | undefined {
    return this === this.parentSubMenuElement ? (this.parentItemElement ?? this.rootElement?.buttonElement) : this.parentSubMenuElement
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
    parentSubMenuElement: {
      selector: 'aracna-aria-menu-submenu',
      closest: true
    },
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

export {
  AriaMenuButtonElement as AracnaAriaMenuButtonElement,
  AriaMenuElement as AracnaAriaMenuElement,
  AriaMenuItemElement as AracnaAriaMenuItemElement,
  AriaMenuSubMenuElement as AracnaAriaMenuSubMenuElement
}

import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaTabsController, AriaTabsPanelController, AriaTabsTabController } from '../../controllers/aria-tabs-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaTabsElementEventMap, AriaTabsPanelElementEventMap, AriaTabsTabElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { TabsTabSelectionEvent } from '../../events/tabs-tab-selection-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-tabs': AriaTabsElement
    'aracna-aria-tabs-panel': AriaTabsPanelElement
    'aracna-aria-tabs-tab': AriaTabsTabElement
  }
}

class AriaTabsElement<E extends AriaTabsElementEventMap = AriaTabsElementEventMap> extends BaseElement<E> {
  protected aria: AriaTabsController = new AriaTabsController(this)

  /**
   * PROPERTIES
   */
  automaticActivation?: boolean

  /**
   * QUERIES
   */
  focusedTabElement?: AriaTabsTabElement
  panelElements!: AriaTabsPanelElement[]
  selectedTabElement?: AriaTabsTabElement
  tabElements!: AriaTabsTabElement[]

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
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedTabElementIndex === 0) {
          if (this.automaticActivation) {
            this.tabElements[this.tabElements.length - 1]?.select()
            ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last tab has been selected.`)

            break
          }

          this.tabElements[this.tabElements.length - 1]?.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last tab has been focused.`)

          break
        }

        if (this.automaticActivation) {
          this.tabElements[this.focusedTabElementIndex - 1]?.select()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous tab has been selected.`)

          break
        }

        this.tabElements[this.focusedTabElementIndex - 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous tab has been focused.`)

        break
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.focusedTabElementIndex >= this.tabElements.length - 1) {
          if (this.automaticActivation) {
            this.tabElements[0]?.select()
            ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first tab has been selected.`)

            break
          }

          this.tabElements[0]?.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first tab has been focused.`)

          break
        }

        if (this.automaticActivation) {
          this.tabElements[this.focusedTabElementIndex + 1]?.select()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next tab has been selected.`)

          break
        }

        this.tabElements[this.focusedTabElementIndex + 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next tab has been focused.`)

        break
      case KeyboardEventKey.HOME:
        if (this.automaticActivation) {
          this.tabElements[0]?.select()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been selected.`)

          break
        }

        this.tabElements[0]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been focused.`)

        break
      case KeyboardEventKey.END:
        if (this.automaticActivation) {
          this.tabElements[this.tabElements.length - 1]?.select()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last tab has been selected.`)

          break
        }

        this.tabElements[this.tabElements.length - 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last tab has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.automaticActivation) {
          break
        }

        this.focusedTabElement?.select()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The focused tab has been selected.`)

        break
    }
  }

  get focusedTabElementIndex(): number {
    return this.focusedTabElement ? this.tabElements.indexOf(this.focusedTabElement) : -1
  }

  get manualActivation(): boolean {
    return !this.automaticActivation
  }

  get name(): ElementName {
    return ElementName.ARIA_TABS
  }

  get selectedTabElementIndex(): number {
    return this.selectedTabElement ? this.tabElements.indexOf(this.selectedTabElement) : -1
  }

  static properties: PropertyDeclarations = {
    automaticActivation: {
      type: Boolean,
      attribute: 'automatic-activation',
      reflect: true
    }
  }

  static queries: QueryDeclarations = {
    focusedTabElement: { selector: 'aracna-aria-tabs-tab:focus' },
    panelElements: { selector: 'aracna-aria-tabs-panel', all: true },
    selectedTabElement: { selector: 'aracna-aria-tabs-tab[selected]' },
    tabElements: { selector: 'aracna-aria-tabs-tab', all: true }
  }
}

class AriaTabsTabElement<E extends AriaTabsTabElementEventMap = AriaTabsTabElementEventMap> extends BaseElement<E> {
  protected aria: AriaTabsTabController = new AriaTabsTabController(this)

  /**
   * PROPERTIES
   */
  selected?: boolean

  /**
   * QUERIES
   */
  rootElement!: AriaTabsElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    this.select()
    ElementLogger.verbose(this.uid, 'onClick', `The tab has been selected.`)
  }

  select(): void {
    this.rootElement.selectedTabElement?.unselect()

    this.selected = true
    this.focus()

    this.rootElement.dispatchEvent(new TabsTabSelectionEvent(this, this.index))
  }

  unselect(): void {
    this.selected = false
  }

  get index(): number {
    return this.rootElement.tabElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_TABS_TAB
  }

  static properties: PropertyDeclarations = {
    selected: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-tabs', closest: true }
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

class AriaTabsPanelElement<E extends AriaTabsPanelElementEventMap = AriaTabsPanelElementEventMap> extends BaseElement<E> {
  protected aria: AriaTabsPanelController = new AriaTabsPanelController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaTabsElement

  get index(): number {
    return this.rootElement.panelElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_TABS_PANEL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-tabs', closest: true }
  }
}

defineCustomElement('aracna-aria-tabs', AriaTabsElement)
defineCustomElement('aracna-aria-tabs-tab', AriaTabsTabElement)
defineCustomElement('aracna-aria-tabs-panel', AriaTabsPanelElement)

export { AriaTabsElement as AracnaAriaTabsElement, AriaTabsPanelElement as AracnaAriaTabsPanelElement, AriaTabsTabElement as AracnaAriaTabsTabElement }

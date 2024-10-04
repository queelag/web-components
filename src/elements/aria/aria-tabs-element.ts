import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaTabsController, AriaTabsPanelController, AriaTabsTabController } from '../../controllers/aria-tabs-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaTabsElementEventMap, AriaTabsPanelElementEventMap, AriaTabsTabElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { TabsTabSelectEvent } from '../../events/tabs-tab-select-event.js'
import { TabsTabUnselectEvent } from '../../events/tabs-tab-unselect-event.js'
import { gkek } from '../../functions/gkek.js'
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
   * Properties
   */
  /** */
  automaticActivation?: boolean

  /**
   * Queries
   */
  /** */
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

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_UP: {
        let tab: AriaTabsTabElement | undefined

        if (this.focusedTabElementIndex === 0) {
          tab = this.tabElements[this.tabElements.length - 1]
          if (!tab) break

          if (this.automaticActivation) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the last tab.`, tab)
            tab.select()

            break
          }

          tab.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The last tab has been focused.`, tab)

          break
        }

        tab = this.tabElements[this.focusedTabElementIndex - 1]
        if (!tab) break

        if (this.automaticActivation) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the previous tab.`, tab)
          tab.select()

          break
        }

        tab.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The previous tab has been focused.`, tab)

        break
      }
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT: {
        let tab: AriaTabsTabElement | undefined

        if (this.focusedTabElementIndex >= this.tabElements.length - 1) {
          tab = this.tabElements[0]
          if (!tab) break

          if (this.automaticActivation) {
            ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the first tab.`, tab)
            tab.select()

            break
          }

          tab.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first tab has been focused.`, tab)

          break
        }

        tab = this.tabElements[this.focusedTabElementIndex + 1]
        if (!tab) break

        if (this.automaticActivation) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the next tab.`, tab)
          tab.select()

          break
        }

        tab.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The next tab has been focused.`, tab)

        break
      }
      case KeyboardEventKey.HOME: {
        let tab: AriaTabsTabElement | undefined

        tab = this.tabElements[0]
        if (!tab) break

        if (this.automaticActivation) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the first tab.`, tab)
          tab.select()

          break
        }

        tab.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first tab has been focused.`, tab)

        break
      }
      case KeyboardEventKey.END: {
        let tab: AriaTabsTabElement | undefined

        tab = this.tabElements[this.tabElements.length - 1]
        if (!tab) break

        if (this.automaticActivation) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the last tab.`, tab)
          tab.select()

          break
        }

        tab.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The last tab has been focused.`, tab)

        break
      }
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.automaticActivation) {
          break
        }

        if (this.focusedTabElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Selecting the focused tab.`, this.focusedTabElement)
          this.focusedTabElement.select()
        }

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
   * Properties
   */
  /** */
  selected?: boolean

  /**
   * Queries
   */
  /** */
  rootElement?: AriaTabsElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    ElementLogger.verbose(this.uid, 'onClick', `Selecting the tab.`)
    this.select()
  }

  select(): void {
    if (this.rootElement?.selectedTabElement) {
      ElementLogger.verbose(this.uid, 'select', `Unselecting the selected tab.`, this.rootElement.selectedTabElement)
      this.rootElement.selectedTabElement.unselect()
    }

    this.selected = true
    ElementLogger.verbose(this.uid, 'select', `The tab has been selected.`)

    this.focus()
    ElementLogger.verbose(this.uid, 'select', `The tab has been focused.`)

    this.dispatchEvent(new TabsTabSelectEvent())
    ElementLogger.verbose(this.uid, 'select', `The "select" event has been dispatched.`)
  }

  unselect(): void {
    this.selected = false
    ElementLogger.verbose(this.uid, 'unselect', `The tab has been unselected.`)

    this.dispatchEvent(new TabsTabUnselectEvent())
    ElementLogger.verbose(this.uid, 'unselect', `The "unselect" event has been dispatched.`)
  }

  get index(): number {
    return this.rootElement?.tabElements.indexOf(this) ?? -1
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
   * Queries
   */
  /** */
  rootElement?: AriaTabsElement

  get index(): number {
    return this.rootElement?.panelElements.indexOf(this) ?? -1
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

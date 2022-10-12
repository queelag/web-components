import { AttributeChangedEvent, ElementName, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaTabsController, AriaTabsPanelController, AriaTabsTabController } from '../../controllers/aria.tabs.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-tabs': AriaTabsElement
    'q-aria-tabs-panel': AriaTabsPanelElement
    'q-aria-tabs-tab': AriaTabsTabElement
  }
}

export class AriaTabsElement extends BaseElement {
  protected aria: AriaTabsController = new AriaTabsController(this)

  /**
   * PROPERTIES
   */
  automaticActivation?: boolean

  /**
   * QUERIES
   */
  panelElement!: AriaTabsPanelElement
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
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.END:
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
        if (this.focusedTabElementIndex < 0) {
          break
        }

        if (this.focusedTabElementIndex === 0) {
          if (this.automaticActivation) {
            this.tabElements[this.tabElements.length - 1].select()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last tab has been selected.`)

            break
          }

          this.tabElements[this.tabElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last tab has been focused.`)

          break
        }

        if (this.automaticActivation) {
          this.tabElements[this.focusedTabElementIndex - 1].select()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous tab has been selected.`)

          break
        }

        this.tabElements[this.focusedTabElementIndex - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous tab has been focused.`)

        break
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.focusedTabElementIndex < 0) {
          break
        }

        if (this.focusedTabElementIndex >= this.tabElements.length - 1) {
          if (this.automaticActivation) {
            this.tabElements[0].select()
            WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first tab has been selected.`)

            break
          }

          this.tabElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first tab has been focused.`)

          break
        }

        if (this.automaticActivation) {
          this.tabElements[this.focusedTabElementIndex + 1].select()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next tab has been selected.`)

          break
        }

        this.tabElements[this.focusedTabElementIndex + 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next tab has been focused.`)

        break
      case KeyboardEventKey.END:
        if (this.automaticActivation) {
          this.tabElements[0].select()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been selected.`)

          break
        }

        this.tabElements[0].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been focused.`)

        break
      case KeyboardEventKey.HOME:
        if (this.automaticActivation) {
          this.tabElements[this.tabElements.length - 1].select()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The last tab has been selected.`)

          break
        }

        this.tabElements[this.tabElements.length - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The last tab has been focused.`)

        break
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        if (this.automaticActivation) {
          break
        }

        this.focusedTabElement?.select()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ENTER or SPACE', `The focused tab has been selected.`)

        break
    }
  }

  get focusedTabElement(): AriaTabsTabElement | undefined {
    return this.tabElements.find((tab: AriaTabsTabElement) => tab === document.activeElement)
  }

  get focusedTabElementIndex(): number {
    return this.tabElements.indexOf(document.activeElement as AriaTabsTabElement)
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
    automaticActivation: { type: Boolean, attribute: 'automatic-activation', reflect: true }
  }

  static queries: QueryDeclarations = {
    panelElement: { selector: 'q-aria-tabs-panel' },
    selectedTabElement: { selector: 'q-aria-tabs-tab[selected]' },
    tabElements: { selector: 'q-aria-tabs-tab', all: true }
  }
}

export class AriaTabsTabElement extends BaseElement {
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

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name !== 'selected' || Object.is(_old, value)) {
      return
    }

    this.rootElement.dispatchEvent(new AttributeChangedEvent('selected', _old, value))
  }

  onClick = (): void => {
    this.select()
    WebElementLogger.verbose(this.uid, 'onClick', `The tab has been selected.`)
  }

  select(): void {
    this.rootElement.selectedTabElement?.unselect()

    this.selected = true
    this.focus()
  }

  unselect(): void {
    this.selected = false
  }

  get name(): ElementName {
    return ElementName.ARIA_TABS_TAB
  }

  static properties: PropertyDeclarations = {
    selected: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-tabs', closest: true }
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

export class AriaTabsPanelElement extends BaseElement {
  protected aria: AriaTabsPanelController = new AriaTabsPanelController(this)

  get name(): ElementName {
    return ElementName.ARIA_TABS_PANEL
  }
}

customElements.define('q-aria-tabs', AriaTabsElement)
customElements.define('q-aria-tabs-tab', AriaTabsTabElement)
customElements.define('q-aria-tabs-panel', AriaTabsPanelElement)

import {
  AriaAccordionButtonElementEventMap,
  AriaAccordionElementEventMap,
  AriaAccordionHeaderElementEventMap,
  AriaAccordionPanelElementEventMap,
  AriaAccordionSectionElementEventMap,
  defineCustomElement,
  ElementName,
  HeadingLevel,
  KeyboardEventKey,
  QueryDeclarations,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import {
  AriaAccordionButtonController,
  AriaAccordionHeaderController,
  AriaAccordionPanelController,
  AriaAccordionSectionController
} from '../../controllers/aria-accordion-controller.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-accordion': AriaAccordionElement
    'aracna-aria-accordion-button': AriaAccordionButtonElement
    'aracna-aria-accordion-header': AriaAccordionHeaderElement
    'aracna-aria-accordion-panel': AriaAccordionPanelElement
    'aracna-aria-accordion-section': AriaAccordionSectionElement
  }
}

export class AriaAccordionElement<E extends AriaAccordionElementEventMap = AriaAccordionElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  allowOnlyOneExpandedSection?: boolean

  /**
   * QUERIES
   */
  buttonElements!: AriaAccordionButtonElement[]
  expandedSectionElements!: AriaAccordionSectionElement[]

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
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.END:
        event.preventDefault()
        event.stopPropagation()

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ENTER:
      case KeyboardEventKey.SPACE:
        this.focusedButtonElement?.click()
        break
      case KeyboardEventKey.ARROW_DOWN:
        if (this.focusedButtonElementIndex < 0) {
          return
        }

        if (this.focusedButtonElementIndex >= this.buttonElements.length - 1) {
          this.buttonElements[0]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The first header button has been focused.`)

          break
        }

        this.buttonElements[this.focusedButtonElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The next header button has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedButtonElementIndex < 0) {
          return
        }

        if (this.focusedButtonElementIndex === 0) {
          this.buttonElements[this.buttonElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The last header button has been focused.`)

          break
        }

        this.buttonElements[this.focusedButtonElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous header button has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.buttonElements[0]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The first header button has been focused.`)

        break
      case KeyboardEventKey.END:
        this.buttonElements[this.buttonElements.length - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The last header button has been focused.`)

        break
    }
  }

  get focusedButtonElement(): AriaAccordionButtonElement | undefined {
    return this.buttonElements.find((button: AriaAccordionButtonElement) => button === document.activeElement)
  }

  get focusedButtonElementIndex(): number {
    return this.buttonElements.indexOf(document.activeElement as AriaAccordionButtonElement)
  }

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-aria-accordion-button', all: true },
    expandedSectionElements: {
      selector: 'aracna-aria-accordion-section[expanded]',
      all: true
    }
  }

  static properties: PropertyDeclarations = {
    allowOnlyOneExpandedSection: {
      type: Boolean,
      attribute: 'allow-only-one-expanded-section',
      reflect: true
    }
  }
}

export class AriaAccordionSectionElement<E extends AriaAccordionSectionElementEventMap = AriaAccordionSectionElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionSectionController = new AriaAccordionSectionController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean
  noncollapsible?: boolean

  /**
   * QUERIES
   */
  buttonElement?: AriaAccordionButtonElement
  panelElement?: AriaAccordionPanelElement

  collapse(): void {
    if (this.noncollapsible) {
      return
    }

    this.expanded = false
  }

  expand(): void {
    this.expanded = true
  }

  get collapsed(): boolean {
    return !this.expanded
  }

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-accordion-button' },
    panelElement: { selector: 'aracna-aria-accordion-panel' }
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true },
    noncollapsible: { type: Boolean, reflect: true }
  }
}

export class AriaAccordionHeaderElement<E extends AriaAccordionHeaderElementEventMap = AriaAccordionHeaderElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionHeaderController = new AriaAccordionHeaderController(this)

  /**
   * PROPERTIES
   */
  level?: HeadingLevel

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION_HEADER
  }

  static properties: PropertyDeclarations = {
    level: { type: Number, reflect: true }
  }
}

export class AriaAccordionButtonElement<E extends AriaAccordionButtonElementEventMap = AriaAccordionButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionButtonController = new AriaAccordionButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaAccordionElement
  sectionElement!: AriaAccordionSectionElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER && event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.click()
    WebElementLogger.verbose(this.uid, 'onKeyDown', `The button has been clicked.`)
  }

  onClick(): void {
    if (this.sectionElement.noncollapsible && this.sectionElement.expanded) {
      WebElementLogger.verbose(this.sectionElement.uid, 'onClick', `The section isn't collapsable.`)
      return
    }

    if (this.rootElement.allowOnlyOneExpandedSection && this.rootElement.expandedSectionElements.length > 0) {
      let expanded: boolean = !!this.sectionElement.expanded

      for (let section of this.rootElement.expandedSectionElements) {
        section.collapse()
      }

      if (expanded) {
        return
      }
    }

    this.sectionElement.expanded = !this.sectionElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The section has been ${this.sectionElement.expanded ? 'expanded' : 'collapsed'}.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-accordion', closest: true },
    sectionElement: {
      selector: 'aracna-aria-accordion-section',
      closest: true
    }
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

export class AriaAccordionPanelElement<E extends AriaAccordionPanelElementEventMap = AriaAccordionPanelElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionPanelController = new AriaAccordionPanelController(this)

  /**
   * QUERIES
   */
  sectionElement!: AriaAccordionSectionElement

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION_PANEL
  }

  static queries: QueryDeclarations = {
    sectionElement: {
      selector: 'aracna-aria-accordion-section',
      closest: true
    }
  }
}

defineCustomElement('aracna-aria-accordion', AriaAccordionElement)
defineCustomElement('aracna-aria-accordion-button', AriaAccordionButtonElement)
defineCustomElement('aracna-aria-accordion-header', AriaAccordionHeaderElement)
defineCustomElement('aracna-aria-accordion-panel', AriaAccordionPanelElement)
defineCustomElement('aracna-aria-accordion-section', AriaAccordionSectionElement)

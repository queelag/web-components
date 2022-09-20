import { ElementName, HeadingLevel, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import {
  AriaAccordionButtonController,
  AriaAccordionHeaderController,
  AriaAccordionPanelController,
  AriaAccordionSectionController
} from '../../controllers/aria.accordion.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-accordion': AriaAccordionElement
    'q-aria-accordion-header': AriaAccordionHeaderElement
    'q-aria-accordion-button': AriaAccordionButtonElement
    'q-aria-accordion-panel': AriaAccordionPanelElement
    'q-aria-accordion-section': AriaAccordionSectionElement
  }
}

export class AriaAccordionElement extends BaseElement {
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
          this.buttonElements[0].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The first header button has been focused.`)

          break
        }

        this.buttonElements[this.focusedButtonElementIndex + 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The next header button has been focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
        if (this.focusedButtonElementIndex < 0) {
          return
        }

        if (this.focusedButtonElementIndex === 0) {
          this.buttonElements[this.buttonElements.length - 1].focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', `The last header button has been focused.`)

          break
        }

        this.buttonElements[this.focusedButtonElementIndex - 1].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The previous header button has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.buttonElements[0].focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', `The first header button has been focused.`)

        break
      case KeyboardEventKey.END:
        this.buttonElements[this.buttonElements.length - 1].focus()
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
    return ElementName.ACCORDION
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-aria-accordion-button', all: true },
    expandedSectionElements: { selector: 'q-aria-accordion-section[expanded]', all: true }
  }

  static properties: PropertyDeclarations = {
    allowOnlyOneExpandedSection: { type: Boolean, attribute: 'allow-only-one-expanded-section', reflect: true }
  }
}

export class AriaAccordionSectionElement extends BaseElement {
  protected aria: AriaAccordionSectionController = new AriaAccordionSectionController(this)

  /**
   * PROPERTIES
   */
  collapsable?: boolean
  expanded?: boolean

  /**
   * QUERIES
   */
  buttonElement!: AriaAccordionButtonElement
  panelElement?: AriaAccordionPanelElement

  collapse(): void {
    if (!this.collapsable) {
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
    return ElementName.ACCORDION_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-accordion-button' },
    panelElement: { selector: 'q-aria-accordion-panel' }
  }

  static properties: PropertyDeclarations = {
    collapsable: { type: Boolean, reflect: true },
    expanded: { type: Boolean, reflect: true }
  }
}

export class AriaAccordionHeaderElement extends BaseElement {
  protected aria: AriaAccordionHeaderController = new AriaAccordionHeaderController(this)

  /**
   * PROPERTIES
   */
  level?: HeadingLevel

  get name(): ElementName {
    return ElementName.ACCORDION_HEADER
  }

  static properties: PropertyDeclarations = {
    level: { type: Number, reflect: true }
  }
}

export class AriaAccordionButtonElement extends BaseElement {
  protected aria: AriaAccordionButtonController = new AriaAccordionButtonController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaAccordionElement
  sectionElement!: AriaAccordionSectionElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (!this.sectionElement.collapsable && this.sectionElement.expanded) {
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
    return ElementName.ACCORDION_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-accordion', closest: true },
    sectionElement: { selector: 'q-aria-accordion-section', closest: true }
  }
}

export class AriaAccordionPanelElement extends BaseElement {
  protected aria: AriaAccordionPanelController = new AriaAccordionPanelController(this)

  get name(): ElementName {
    return ElementName.ACCORDION_PANEL
  }
}

customElements.define('q-aria-accordion', AriaAccordionElement)
customElements.define('q-aria-accordion-button', AriaAccordionButtonElement)
customElements.define('q-aria-accordion-header', AriaAccordionHeaderElement)
customElements.define('q-aria-accordion-panel', AriaAccordionPanelElement)
customElements.define('q-aria-accordion-section', AriaAccordionSectionElement)

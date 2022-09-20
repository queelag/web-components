import { ElementName, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaDisclosureButtonController, AriaDisclosurePanelController, AriaDisclosureSectionController } from '../../controllers/aria.disclosure.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-disclosure': AriaDisclosureElement
    'q-aria-disclosure-button': AriaDisclosureButtonElement
    'q-aria-disclosure-panel': AriaDisclosurePanelElement
    'q-aria-disclosure-section': AriaDisclosureSectionElement
  }
}

export class AriaDisclosureElement extends BaseElement {
  /**
   * QUERIES
   */
  buttonElements!: AriaDisclosureButtonElement[]

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
        event.preventDefault()
        event.stopPropagation()

        this.focusedButtonElement?.click()
        break
    }
  }

  get focusedButtonElement(): AriaDisclosureButtonElement | undefined {
    return this.buttonElements.find((button: AriaDisclosureButtonElement) => button === document.activeElement)
  }

  get name(): ElementName {
    return ElementName.DISCLOSURE
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-aria-disclosure-button', all: true }
  }
}

export class AriaDisclosureSectionElement extends BaseElement {
  protected aria: AriaDisclosureSectionController = new AriaDisclosureSectionController(this)

  /**
   * PROPERTIES
   */
  expanded?: boolean

  /**
   * QUERIES
   */
  buttonElement!: AriaDisclosureButtonElement
  panelElement?: AriaDisclosurePanelElement

  collapse(): void {
    this.expanded = false
  }

  expand(): void {
    this.expanded = true
  }

  get name(): ElementName {
    return ElementName.DISCLOSURE_SECTION
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-disclosure-button' },
    panelElement: { selector: 'q-aria-disclosure-panel' }
  }
}

export class AriaDisclosureButtonElement extends BaseElement {
  protected aria: AriaDisclosureButtonController = new AriaDisclosureButtonController(this)

  /**
   * QUERIES
   */
  sectionElement!: AriaDisclosureSectionElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.addEventListener('click', this.onClick)
  }

  onClick = (): void => {
    this.sectionElement.expanded = !this.sectionElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The section has been ${this.sectionElement.expanded ? 'expanded' : 'collapsed'}.`)
  }

  get name(): ElementName {
    return ElementName.DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-aria-disclosure-section', closest: true }
  }
}

export class AriaDisclosurePanelElement extends BaseElement {
  protected aria: AriaDisclosurePanelController = new AriaDisclosurePanelController(this)

  get name(): ElementName {
    return ElementName.DISCLOSURE_PANEL
  }
}

customElements.define('q-aria-disclosure', AriaDisclosureElement)
customElements.define('q-aria-disclosure-button', AriaDisclosureButtonElement)
customElements.define('q-aria-disclosure-panel', AriaDisclosurePanelElement)
customElements.define('q-aria-disclosure-section', AriaDisclosureSectionElement)

import {
  AriaDisclosureButtonElementEventMap,
  AriaDisclosureElementEventMap,
  AriaDisclosurePanelElementEventMap,
  AriaDisclosureSectionElementEventMap,
  defineCustomElement,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
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

export class AriaDisclosureElement<E extends AriaDisclosureElementEventMap = AriaDisclosureElementEventMap> extends BaseElement<E> {
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
    return ElementName.ARIA_DISCLOSURE
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-aria-disclosure-button', all: true }
  }
}

export class AriaDisclosureSectionElement<E extends AriaDisclosureSectionElementEventMap = AriaDisclosureSectionElementEventMap> extends BaseElement<E> {
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
    return ElementName.ARIA_DISCLOSURE_SECTION
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-aria-disclosure-button' },
    panelElement: { selector: 'q-aria-disclosure-panel' }
  }
}

export class AriaDisclosureButtonElement<E extends AriaDisclosureButtonElementEventMap = AriaDisclosureButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaDisclosureButtonController = new AriaDisclosureButtonController(this)

  /**
   * QUERIES
   */
  sectionElement!: AriaDisclosureSectionElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.addEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onClick(): void {
    this.sectionElement.expanded = !this.sectionElement.expanded
    WebElementLogger.verbose(this.uid, 'onClick', `The section has been ${this.sectionElement.expanded ? 'expanded' : 'collapsed'}.`)
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

  get name(): ElementName {
    return ElementName.ARIA_DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-aria-disclosure-section', closest: true }
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

export class AriaDisclosurePanelElement<E extends AriaDisclosurePanelElementEventMap = AriaDisclosurePanelElementEventMap> extends BaseElement<E> {
  protected aria: AriaDisclosurePanelController = new AriaDisclosurePanelController(this)

  get name(): ElementName {
    return ElementName.ARIA_DISCLOSURE_PANEL
  }
}

defineCustomElement('q-aria-disclosure', AriaDisclosureElement)
defineCustomElement('q-aria-disclosure-button', AriaDisclosureButtonElement)
defineCustomElement('q-aria-disclosure-panel', AriaDisclosurePanelElement)
defineCustomElement('q-aria-disclosure-section', AriaDisclosureSectionElement)

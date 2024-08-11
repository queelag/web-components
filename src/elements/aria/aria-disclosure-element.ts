import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaDisclosureButtonController, AriaDisclosurePanelController, AriaDisclosureSectionController } from '../../controllers/aria-disclosure-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaDisclosureButtonElementEventMap,
  AriaDisclosureElementEventMap,
  AriaDisclosurePanelElementEventMap,
  AriaDisclosureSectionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { DisclosureSectionCollapseEvent } from '../../events/disclosure-section-collapse-event.js'
import { DisclosureSectionExpandEvent } from '../../events/disclosure-section-expand-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-disclosure': AriaDisclosureElement
    'aracna-aria-disclosure-button': AriaDisclosureButtonElement
    'aracna-aria-disclosure-panel': AriaDisclosurePanelElement
    'aracna-aria-disclosure-section': AriaDisclosureSectionElement
  }
}

class AriaDisclosureElement<E extends AriaDisclosureElementEventMap = AriaDisclosureElementEventMap> extends BaseElement<E> {
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

        if (this.focusedButtonElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', `Clicking the focused button.`, this.focusedButtonElement)
          this.focusedButtonElement.click()
        }

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
    buttonElements: { selector: 'aracna-aria-disclosure-button', all: true }
  }
}

class AriaDisclosureSectionElement<E extends AriaDisclosureSectionElementEventMap = AriaDisclosureSectionElementEventMap> extends BaseElement<E> {
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
    ElementLogger.verbose(this.uid, 'collapse', `The section has been collapsed.`)

    this.dispatchEvent(new DisclosureSectionCollapseEvent())
    ElementLogger.verbose(this.uid, 'collapse', `The "collapse" event has been dispatched.`)
  }

  expand(): void {
    this.expanded = true
    ElementLogger.verbose(this.uid, 'expand', `The section has been expanded.`)

    this.dispatchEvent(new DisclosureSectionExpandEvent())
    ElementLogger.verbose(this.uid, 'expand', `The "expand" event has been dispatched.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_DISCLOSURE_SECTION
  }

  static properties: PropertyDeclarations = {
    expanded: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-aria-disclosure-button' },
    panelElement: { selector: 'aracna-aria-disclosure-panel' }
  }
}

class AriaDisclosureButtonElement<E extends AriaDisclosureButtonElementEventMap = AriaDisclosureButtonElementEventMap> extends BaseElement<E> {
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
    if (this.sectionElement.expanded) {
      ElementLogger.verbose(this.uid, 'onClick', `Collapsing the section.`)
      return this.sectionElement.collapse()
    }

    ElementLogger.verbose(this.uid, 'onClick', `Expanding the section.`)
    this.sectionElement.expand()
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER && event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    ElementLogger.verbose(this.uid, 'onKeyDown', `Clicking the button.`)
    this.click()
  }

  get name(): ElementName {
    return ElementName.ARIA_DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: {
      selector: 'aracna-aria-disclosure-section',
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

class AriaDisclosurePanelElement<E extends AriaDisclosurePanelElementEventMap = AriaDisclosurePanelElementEventMap> extends BaseElement<E> {
  protected aria: AriaDisclosurePanelController = new AriaDisclosurePanelController(this)

  get name(): ElementName {
    return ElementName.ARIA_DISCLOSURE_PANEL
  }
}

defineCustomElement('aracna-aria-disclosure', AriaDisclosureElement)
defineCustomElement('aracna-aria-disclosure-button', AriaDisclosureButtonElement)
defineCustomElement('aracna-aria-disclosure-panel', AriaDisclosurePanelElement)
defineCustomElement('aracna-aria-disclosure-section', AriaDisclosureSectionElement)

export {
  AriaDisclosureButtonElement as AracnaAriaDisclosureButtonElement,
  AriaDisclosureElement as AracnaAriaDisclosureElement,
  AriaDisclosurePanelElement as AracnaAriaDisclosurePanelElement,
  AriaDisclosureSectionElement as AracnaAriaDisclosureSectionElement
}

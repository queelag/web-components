import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import {
  AriaAccordionButtonController,
  AriaAccordionHeaderController,
  AriaAccordionPanelController,
  AriaAccordionSectionController
} from '../../controllers/aria-accordion-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaAccordionButtonElementEventMap,
  AriaAccordionElementEventMap,
  AriaAccordionHeaderElementEventMap,
  AriaAccordionPanelElementEventMap,
  AriaAccordionSectionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { HeadingLevel } from '../../definitions/types.js'
import { AccordionSectionCollapseEvent } from '../../events/accordion-section-collapse-event.js'
import { AccordionSectionExpandEvent } from '../../events/accordion-section-expand-event.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-accordion': AriaAccordionElement
    'aracna-aria-accordion-button': AriaAccordionButtonElement
    'aracna-aria-accordion-header': AriaAccordionHeaderElement
    'aracna-aria-accordion-panel': AriaAccordionPanelElement
    'aracna-aria-accordion-section': AriaAccordionSectionElement
  }
}

class AriaAccordionElement<E extends AriaAccordionElementEventMap = AriaAccordionElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  allowOnlyOneExpandedSection?: boolean

  /**
   * Queries
   */
  /** */
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
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the focused button element.`, this.focusedButtonElement)
        this.focusedButtonElement?.click()

        break
      case KeyboardEventKey.ARROW_DOWN: {
        let button: AriaAccordionButtonElement | undefined

        if (this.focusedButtonElementIndex < 0) {
          return ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `No button is focused.`)
        }

        if (this.focusedButtonElementIndex >= this.buttonElements.length - 1) {
          button = this.buttonElements[0]
          if (!button) break

          button.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first button has been focused.`, button)

          break
        }

        button = this.buttonElements[this.focusedButtonElementIndex + 1]
        if (!button) break

        button.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The next button has been focused.`, button)

        break
      }
      case KeyboardEventKey.ARROW_UP: {
        let button: AriaAccordionButtonElement | undefined

        if (this.focusedButtonElementIndex < 0) {
          return ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `No button is focused.`)
        }

        if (this.focusedButtonElementIndex === 0) {
          button = this.buttonElements[this.buttonElements.length - 1]
          if (!button) break

          button.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The last button has been focused.`, button)

          break
        }

        button = this.buttonElements[this.focusedButtonElementIndex - 1]
        if (!button) break

        button.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The previous header button has been focused.`, button)

        break
      }
      case KeyboardEventKey.HOME: {
        let button: AriaAccordionButtonElement | undefined

        button = this.buttonElements[0]
        if (!button) break

        button.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first button has been focused.`, button)

        break
      }
      case KeyboardEventKey.END: {
        let button: AriaAccordionButtonElement | undefined

        button = this.buttonElements[this.buttonElements.length - 1]
        if (!button) break

        button.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The last button has been focused.`, button)

        break
      }
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

class AriaAccordionSectionElement<E extends AriaAccordionSectionElementEventMap = AriaAccordionSectionElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionSectionController = new AriaAccordionSectionController(this)

  /**
   * Properties
   */
  /** */
  expanded?: boolean
  uncollapsible?: boolean

  /**
   * Queries
   */
  /** */
  buttonElement?: AriaAccordionButtonElement
  panelElement?: AriaAccordionPanelElement

  toggle(): void {
    if (this.expanded) {
      return this.collapse()
    }

    this.expand()
  }

  collapse(): void {
    if (this.uncollapsible) {
      return ElementLogger.warn(this.uid, 'collapse', `The section is not collapsible.`)
    }

    this.expanded = false
    ElementLogger.verbose(this.uid, 'collapse', `The section has been collapsed.`)

    this.dispatchEvent(new AccordionSectionCollapseEvent())
    ElementLogger.verbose(this.uid, 'collapse', `The "collapse" event has been dispatched.`)
  }

  expand(): void {
    this.expanded = true
    ElementLogger.verbose(this.uid, 'expand', `The section has been expanded.`)

    this.dispatchEvent(new AccordionSectionExpandEvent())
    ElementLogger.verbose(this.uid, 'expand', `The "expand" event has been dispatched.`)
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
    uncollapsible: { type: Boolean, reflect: true }
  }
}

class AriaAccordionHeaderElement<E extends AriaAccordionHeaderElementEventMap = AriaAccordionHeaderElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionHeaderController = new AriaAccordionHeaderController(this)

  /**
   * Properties
   */
  /** */
  level?: HeadingLevel

  get name(): ElementName {
    return ElementName.ARIA_ACCORDION_HEADER
  }

  static properties: PropertyDeclarations = {
    level: { type: Number, reflect: true }
  }
}

class AriaAccordionButtonElement<E extends AriaAccordionButtonElementEventMap = AriaAccordionButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionButtonController = new AriaAccordionButtonController(this)

  /**
   * Queries
   */
  /** */
  rootElement?: AriaAccordionElement
  sectionElement?: AriaAccordionSectionElement

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

  onClick(): void {
    if (this.sectionElement?.uncollapsible && this.sectionElement.expanded) {
      return ElementLogger.verbose(this.sectionElement.uid, 'onClick', `The section isn't collapsible once expanded.`)
    }

    if (this.rootElement?.allowOnlyOneExpandedSection && this.rootElement.expandedSectionElements.length > 0) {
      let expanded: boolean = Boolean(this.sectionElement?.expanded)

      for (let section of this.rootElement.expandedSectionElements) {
        if (section.uncollapsible) {
          continue
        }

        ElementLogger.verbose(this.uid, 'onClick', `Collapsing a section.`, section)
        section.collapse()
      }

      if (expanded) {
        return ElementLogger.verbose(this.uid, 'onClick', `The section is already expanded.`)
      }
    }

    if (this.sectionElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Toggling the section.`)
      this.sectionElement.toggle()
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER && event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the button.`)
    this.onClick()
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

class AriaAccordionPanelElement<E extends AriaAccordionPanelElementEventMap = AriaAccordionPanelElementEventMap> extends BaseElement<E> {
  protected aria: AriaAccordionPanelController = new AriaAccordionPanelController(this)

  /**
   * Queries
   */
  /** */
  sectionElement?: AriaAccordionSectionElement

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

export {
  AriaAccordionButtonElement as AracnaAriaAccordionButtonElement,
  AriaAccordionElement as AracnaAriaAccordionElement,
  AriaAccordionHeaderElement as AracnaAriaAccordionHeaderElement,
  AriaAccordionPanelElement as AracnaAriaAccordionPanelElement,
  AriaAccordionSectionElement as AracnaAriaAccordionSectionElement
}

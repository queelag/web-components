import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type {
  AccordionButtonElementEventMap,
  AccordionElementEventMap,
  AccordionHeaderElementEventMap,
  AccordionPanelElementEventMap,
  AccordionSectionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaAccordionButtonElement as AriaAccordionButtonElement,
  AracnaAriaAccordionElement as AriaAccordionElement,
  AracnaAriaAccordionHeaderElement as AriaAccordionHeaderElement,
  AracnaAriaAccordionPanelElement as AriaAccordionPanelElement,
  AracnaAriaAccordionSectionElement as AriaAccordionSectionElement
} from '../aria/aria-accordion-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-accordion': AccordionElement
    'aracna-accordion-button': AccordionButtonElement
    'aracna-accordion-header': AccordionHeaderElement
    'aracna-accordion-panel': AccordionPanelElement
    'aracna-accordion-section': AccordionSectionElement
  }
}

class AccordionElement<E extends AccordionElementEventMap = AccordionElementEventMap, T = any> extends AriaAccordionElement<E> {
  /**
   * Properties
   */
  /** */
  sections?: T[]

  get slug(): ElementSlug {
    return ElementSlug.ACCORDION
  }

  static properties: PropertyDeclarations = {
    sections: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-accordion-button', all: true },
    expandedSectionElements: {
      selector: 'aracna-accordion-section[expanded]',
      all: true
    }
  }
}

class AccordionSectionElement<E extends AccordionSectionElementEventMap = AccordionSectionElementEventMap> extends AriaAccordionSectionElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  icon?: string
  text?: string

  get slug(): ElementSlug {
    return ElementSlug.ACCORDION_SECTION
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-accordion-button' },
    panelElement: { selector: 'aracna-accordion-panel' }
  }
}

class AccordionHeaderElement<E extends AccordionHeaderElementEventMap = AccordionHeaderElementEventMap> extends AriaAccordionHeaderElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.ACCORDION_HEADER
  }
}

class AccordionButtonElement<E extends AccordionButtonElementEventMap = AccordionButtonElementEventMap> extends AriaAccordionButtonElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.ACCORDION_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-accordion', closest: true },
    sectionElement: { selector: 'aracna-accordion-section', closest: true }
  }
}

class AccordionPanelElement<E extends AccordionPanelElementEventMap = AccordionPanelElementEventMap> extends AriaAccordionPanelElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.ACCORDION_PANEL
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'aracna-accordion-section', closest: true }
  }
}

defineCustomElement('aracna-accordion', AccordionElement)
defineCustomElement('aracna-accordion-button', AccordionButtonElement)
defineCustomElement('aracna-accordion-header', AccordionHeaderElement)
defineCustomElement('aracna-accordion-panel', AccordionPanelElement)
defineCustomElement('aracna-accordion-section', AccordionSectionElement)

export {
  AccordionButtonElement as AracnaAccordionButtonElement,
  AccordionElement as AracnaAccordionElement,
  AccordionHeaderElement as AracnaAccordionHeaderElement,
  AccordionPanelElement as AracnaAccordionPanelElement,
  AccordionSectionElement as AracnaAccordionSectionElement
}

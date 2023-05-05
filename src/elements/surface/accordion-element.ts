import {
  AccordionButtonElementEventMap,
  AccordionElementEventMap,
  AccordionHeaderElementEventMap,
  AccordionPanelElementEventMap,
  AccordionSectionElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import {
  AriaAccordionButtonElement,
  AriaAccordionElement,
  AriaAccordionHeaderElement,
  AriaAccordionPanelElement,
  AriaAccordionSectionElement
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

export class AccordionElement<E extends AccordionElementEventMap = AccordionElementEventMap> extends AriaAccordionElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-accordion-button', all: true },
    expandedSectionElements: { selector: 'aracna-accordion-section[expanded]', all: true }
  }
}

export class AccordionSectionElement<E extends AccordionSectionElementEventMap = AccordionSectionElementEventMap> extends AriaAccordionSectionElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-accordion-button' },
    panelElement: { selector: 'aracna-accordion-panel' }
  }
}

export class AccordionHeaderElement<E extends AccordionHeaderElementEventMap = AccordionHeaderElementEventMap> extends AriaAccordionHeaderElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_HEADER
  }
}

export class AccordionButtonElement<E extends AccordionButtonElementEventMap = AccordionButtonElementEventMap> extends AriaAccordionButtonElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-accordion', closest: true },
    sectionElement: { selector: 'aracna-accordion-section', closest: true }
  }
}

export class AccordionPanelElement<E extends AccordionPanelElementEventMap = AccordionPanelElementEventMap> extends AriaAccordionPanelElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_PANEL
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

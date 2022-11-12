import {
  AccordionButtonElementEventMap,
  AccordionElementEventMap,
  AccordionHeaderElementEventMap,
  AccordionPanelElementEventMap,
  AccordionSectionElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@queelag/web'
import {
  AriaAccordionButtonElement,
  AriaAccordionElement,
  AriaAccordionHeaderElement,
  AriaAccordionPanelElement,
  AriaAccordionSectionElement
} from '../aria/aria.accordion.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-accordion': AriaAccordionElement
    'q-accordion-button': AriaAccordionButtonElement
    'q-accordion-header': AriaAccordionHeaderElement
    'q-accordion-panel': AriaAccordionPanelElement
    'q-accordion-section': AriaAccordionSectionElement
  }
}

export class AccordionElement<E extends AccordionElementEventMap = AccordionElementEventMap> extends AriaAccordionElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-accordion-button', all: true },
    expandedSectionElements: { selector: 'q-accordion-section[expanded]', all: true }
  }
}

export class AccordionSectionElement<E extends AccordionSectionElementEventMap = AccordionSectionElementEventMap> extends AriaAccordionSectionElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-accordion-button' },
    panelElement: { selector: 'q-accordion-panel' }
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
    rootElement: { selector: 'q-accordion', closest: true },
    sectionElement: { selector: 'q-accordion-section', closest: true }
  }
}

export class AccordionPanelElement<E extends AccordionPanelElementEventMap = AccordionPanelElementEventMap> extends AriaAccordionPanelElement<E> {
  get name(): ElementName {
    return ElementName.ACCORDION_PANEL
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-accordion-section', closest: true }
  }
}

defineCustomElement('q-accordion', AccordionElement)
defineCustomElement('q-accordion-button', AccordionButtonElement)
defineCustomElement('q-accordion-header', AccordionHeaderElement)
defineCustomElement('q-accordion-panel', AccordionPanelElement)
defineCustomElement('q-accordion-section', AccordionSectionElement)

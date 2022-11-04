import { ElementName, QueryDeclarations } from '@queelag/web'
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

export class AccordionElement extends AriaAccordionElement {
  get name(): ElementName {
    return ElementName.ACCORDION
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-accordion-button', all: true },
    expandedSectionElements: { selector: 'q-accordion-section[expanded]', all: true }
  }
}

export class AccordionSectionElement extends AriaAccordionSectionElement {
  get name(): ElementName {
    return ElementName.ACCORDION_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-accordion-button' },
    panelElement: { selector: 'q-accordion-panel' }
  }
}

export class AccordionHeaderElement extends AriaAccordionHeaderElement {
  get name(): ElementName {
    return ElementName.ACCORDION_HEADER
  }
}

export class AccordionButtonElement extends AriaAccordionButtonElement {
  get name(): ElementName {
    return ElementName.ACCORDION_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-accordion', closest: true },
    sectionElement: { selector: 'q-accordion-section', closest: true }
  }
}

export class AccordionPanelElement extends AriaAccordionPanelElement {
  get name(): ElementName {
    return ElementName.ACCORDION_PANEL
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-accordion-section', closest: true }
  }
}

customElements.define('q-accordion', AccordionElement)
customElements.define('q-accordion-button', AccordionButtonElement)
customElements.define('q-accordion-header', AriaAccordionHeaderElement)
customElements.define('q-accordion-panel', AccordionPanelElement)
customElements.define('q-accordion-section', AccordionSectionElement)

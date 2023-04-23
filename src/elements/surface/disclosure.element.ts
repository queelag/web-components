import {
  defineCustomElement,
  DisclosureButtonElementEventMap,
  DisclosureElementEventMap,
  DisclosurePanelElementEventMap,
  DisclosureSectionElementEventMap,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { AriaDisclosureButtonElement, AriaDisclosureElement, AriaDisclosurePanelElement, AriaDisclosureSectionElement } from '../aria/aria.disclosure.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-disclosure': DisclosureElement
    'aracna-disclosure-button': DisclosureButtonElement
    'aracna-disclosure-panel': DisclosurePanelElement
    'aracna-disclosure-section': DisclosureSectionElement
  }
}

export class DisclosureElement<E extends DisclosureElementEventMap = DisclosureElementEventMap> extends AriaDisclosureElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-disclosure-button', all: true }
  }
}

export class DisclosureSectionElement<E extends DisclosureSectionElementEventMap = DisclosureSectionElementEventMap> extends AriaDisclosureSectionElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-disclosure-button' },
    panelElement: { selector: 'aracna-disclosure-panel' }
  }
}

export class DisclosureButtonElement<E extends DisclosureButtonElementEventMap = DisclosureButtonElementEventMap> extends AriaDisclosureButtonElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'aracna-disclosure-section', closest: true }
  }
}

export class DisclosurePanelElement<E extends DisclosurePanelElementEventMap = DisclosurePanelElementEventMap> extends AriaDisclosurePanelElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_PANEL
  }
}

defineCustomElement('aracna-disclosure', DisclosureElement)
defineCustomElement('aracna-disclosure-button', DisclosureButtonElement)
defineCustomElement('aracna-disclosure-panel', DisclosurePanelElement)
defineCustomElement('aracna-disclosure-section', DisclosureSectionElement)

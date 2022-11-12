import {
  defineCustomElement,
  DisclosureButtonElementEventMap,
  DisclosureElementEventMap,
  DisclosurePanelElementEventMap,
  DisclosureSectionElementEventMap,
  ElementName,
  QueryDeclarations
} from '@queelag/web'
import { AriaDisclosureButtonElement, AriaDisclosureElement, AriaDisclosurePanelElement, AriaDisclosureSectionElement } from '../aria/aria.disclosure.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-disclosure': DisclosureElement
    'q-disclosure-button': DisclosureButtonElement
    'q-disclosure-panel': DisclosurePanelElement
    'q-disclosure-section': DisclosureSectionElement
  }
}

export class DisclosureElement<E extends DisclosureElementEventMap = DisclosureElementEventMap> extends AriaDisclosureElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-disclosure-button', all: true }
  }
}

export class DisclosureSectionElement<E extends DisclosureSectionElementEventMap = DisclosureSectionElementEventMap> extends AriaDisclosureSectionElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-disclosure-button' },
    panelElement: { selector: 'q-disclosure-panel' }
  }
}

export class DisclosureButtonElement<E extends DisclosureButtonElementEventMap = DisclosureButtonElementEventMap> extends AriaDisclosureButtonElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-disclosure-section', closest: true }
  }
}

export class DisclosurePanelElement<E extends DisclosurePanelElementEventMap = DisclosurePanelElementEventMap> extends AriaDisclosurePanelElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_PANEL
  }
}

defineCustomElement('q-disclosure', DisclosureElement)
defineCustomElement('q-disclosure-button', DisclosureButtonElement)
defineCustomElement('q-disclosure-panel', DisclosurePanelElement)
defineCustomElement('q-disclosure-section', DisclosureSectionElement)

import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type {
  DisclosureButtonElementEventMap,
  DisclosureElementEventMap,
  DisclosurePanelElementEventMap,
  DisclosureSectionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaDisclosureButtonElement as AriaDisclosureButtonElement,
  AracnaAriaDisclosureElement as AriaDisclosureElement,
  AracnaAriaDisclosurePanelElement as AriaDisclosurePanelElement,
  AracnaAriaDisclosureSectionElement as AriaDisclosureSectionElement
} from '../aria/aria-disclosure-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-disclosure': DisclosureElement
    'aracna-disclosure-button': DisclosureButtonElement
    'aracna-disclosure-panel': DisclosurePanelElement
    'aracna-disclosure-section': DisclosureSectionElement
  }
}

class DisclosureElement<E extends DisclosureElementEventMap = DisclosureElementEventMap, T = any> extends AriaDisclosureElement<E> {
  /**
   * Properties
   */
  /** */
  sections?: T[]

  get name(): ElementName {
    return ElementName.DISCLOSURE
  }

  static properties: PropertyDeclarations = {
    sections: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-disclosure-button', all: true }
  }
}

class DisclosureSectionElement<E extends DisclosureSectionElementEventMap = DisclosureSectionElementEventMap> extends AriaDisclosureSectionElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  icon?: string
  text?: string

  get name(): ElementName {
    return ElementName.DISCLOSURE_SECTION
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-disclosure-button' },
    panelElement: { selector: 'aracna-disclosure-panel' }
  }
}

class DisclosureButtonElement<E extends DisclosureButtonElementEventMap = DisclosureButtonElementEventMap> extends AriaDisclosureButtonElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'aracna-disclosure-section', closest: true }
  }
}

class DisclosurePanelElement<E extends DisclosurePanelElementEventMap = DisclosurePanelElementEventMap> extends AriaDisclosurePanelElement<E> {
  get name(): ElementName {
    return ElementName.DISCLOSURE_PANEL
  }
}

defineCustomElement('aracna-disclosure', DisclosureElement)
defineCustomElement('aracna-disclosure-button', DisclosureButtonElement)
defineCustomElement('aracna-disclosure-panel', DisclosurePanelElement)
defineCustomElement('aracna-disclosure-section', DisclosureSectionElement)

export {
  DisclosureButtonElement as AracnaDisclosureButtonElement,
  DisclosureElement as AracnaDisclosureElement,
  DisclosurePanelElement as AracnaDisclosurePanelElement,
  DisclosureSectionElement as AracnaDisclosureSectionElement
}

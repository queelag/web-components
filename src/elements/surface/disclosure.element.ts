import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaDisclosureButtonElement, AriaDisclosureElement, AriaDisclosurePanelElement, AriaDisclosureSectionElement } from '../aria/aria.disclosure.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-disclosure': DisclosureElement
    'q-disclosure-button': DisclosureButtonElement
    'q-disclosure-panel': DisclosurePanelElement
    'q-disclosure-section': DisclosureSectionElement
  }
}

export class DisclosureElement extends AriaDisclosureElement {
  get name(): ElementName {
    return ElementName.DISCLOSURE
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-disclosure-button', all: true }
  }
}

export class DisclosureSectionElement extends AriaDisclosureSectionElement {
  get name(): ElementName {
    return ElementName.DISCLOSURE_SECTION
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-disclosure-button' },
    panelElement: { selector: 'q-disclosure-panel' }
  }
}

export class DisclosureButtonElement extends AriaDisclosureButtonElement {
  get name(): ElementName {
    return ElementName.DISCLOSURE_BUTTON
  }

  static queries: QueryDeclarations = {
    sectionElement: { selector: 'q-disclosure-section', closest: true }
  }
}

export class DisclosurePanelElement extends AriaDisclosurePanelElement {
  get name(): ElementName {
    return ElementName.DISCLOSURE_PANEL
  }
}

customElements.define('q-disclosure', DisclosureElement)
customElements.define('q-disclosure-button', DisclosureButtonElement)
customElements.define('q-disclosure-panel', DisclosurePanelElement)
customElements.define('q-disclosure-section', DisclosureSectionElement)

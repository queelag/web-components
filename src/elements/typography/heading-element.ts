import { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { html, nothing, PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import { HeadingElementEventMap } from '../../definitions/events.js'
import { AracnaAriaHeadingElement as AriaHeadingElement } from '../aria/aria-heading-element.js'
import { AracnaTextElement as TextElement } from './text-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-heading': HeadingElement
  }
}

class HeadingElement<E extends HeadingElementEventMap = HeadingElementEventMap> extends AriaHeadingElement<E> {
  localization?: Localization
  path?: string
  variables?: LocalizationVariables

  render() {
    return html`
      ${super.render()}
      <slot>${this.path ? this.localization?.get(this.path, this.variables) : nothing}</slot>
    `
  }

  get name(): ElementName {
    return ElementName.HEADING
  }

  static properties: PropertyDeclarations = {
    ...TextElement.properties
  }
}

defineCustomElement('aracna-heading', HeadingElement)

export { HeadingElement as AracnaHeadingElement }

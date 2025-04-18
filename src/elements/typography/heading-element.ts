import type { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations, PropertyValues } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { HeadingElementEventMap } from '../../definitions/events.js'
import type { HeadingElementSanitizeConfig, QueryDeclarations } from '../../definitions/interfaces.js'
import { renderHeadingElement } from '../../utils/heading-element-utils.js'
import { AracnaAriaHeadingElement as AriaHeadingElement } from '../aria/aria-heading-element.js'
import { AracnaTextElement as TextElement } from './text-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-heading': HeadingElement
  }
}

class HeadingElement<E extends HeadingElementEventMap = HeadingElementEventMap> extends AriaHeadingElement<E> {
  /**
   * Properties
   */
  /** */
  localization?: Localization
  path?: string
  renderHTML?: boolean
  sanitize?: boolean
  sanitizeConfig?: HeadingElementSanitizeConfig
  variables?: LocalizationVariables

  /**
   * Queries
   */
  /** */
  elements!: Element[]

  updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties)

    for (let element of this.elements) {
      if (element.hasAttribute('part')) {
        continue
      }

      element.setAttribute('part', element.tagName.toLowerCase())
    }
  }

  render() {
    return renderHeadingElement.bind(this)()
  }

  get slug(): ElementSlug {
    return ElementSlug.HEADING
  }

  static queries: QueryDeclarations = {
    ...TextElement.queries
  }

  static properties: PropertyDeclarations = {
    ...TextElement.properties
  }
}

defineCustomElement('aracna-heading', HeadingElement)

export { HeadingElement as AracnaHeadingElement }

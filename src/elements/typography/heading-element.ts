import type { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { HeadingElementEventMap } from '../../definitions/events.js'
import type { HeadingElementSanitizeConfig } from '../../definitions/interfaces.js'
import { renderHeadingElement } from '../../utils/heading-element-utils.js'
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
  sanitizeConfig?: HeadingElementSanitizeConfig
  variables?: LocalizationVariables

  render() {
    return renderHeadingElement.bind(this)(super.render())
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

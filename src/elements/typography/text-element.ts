import type { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { TextElementEventMap } from '../../definitions/events.js'
import type { TextElementSanitizeConfig } from '../../definitions/interfaces.js'
import { renderTextElement } from '../../utils/text-element-utils.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-text': TextElement
  }
}

class TextElement<E extends TextElementEventMap = TextElementEventMap> extends BaseElement<E> {
  localization?: Localization
  path?: string
  sanitizeConfig?: TextElementSanitizeConfig
  variables?: LocalizationVariables

  render() {
    return renderTextElement.bind(this)(super.render())
  }

  get name(): ElementName {
    return ElementName.TEXT
  }

  static properties: PropertyDeclarations = {
    localization: { type: Object },
    path: { type: String, reflect: true },
    sanitizeConfig: { type: Object, attribute: 'sanitize-config' },
    variables: { type: Object }
  }
}

defineCustomElement('aracna-text', TextElement)

export { TextElement as AracnaTextElement }

import { Localization } from '@aracna/core'
import { html, nothing, type TemplateResult } from 'lit'
import type { AracnaTextElement as TextElement } from '../elements/typography/text-element.js'
import { renderLocalizationStringToHTML } from './localization-utils.js'

export function renderTextElement(this: TextElement, sr: TemplateResult): TemplateResult {
  return html`
    ${sr}
    <slot>
      ${this.localization instanceof Localization && typeof this.path === 'string'
        ? renderLocalizationStringToHTML(this.localization, this.path, this.variables, this.sanitizeConfig)
        : nothing}
    </slot>
  `
}

import type { TemplateResult } from 'lit'
import type { AracnaHeadingElement as HeadingElement } from '../elements/typography/heading-element.js'
import { renderTextElement } from './text-element-utils.js'

export function renderHeadingElement(this: HeadingElement): TemplateResult {
  return renderTextElement.bind(this)()
}

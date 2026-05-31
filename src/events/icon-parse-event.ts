import { IsomorphicEvent } from '@aracna/web'

export interface IconParseEventDetail {
  cache?: string
  element: SVGSVGElement
  sanitized?: string
  src: string
  string: string
}

export class IconParseEvent extends IsomorphicEvent<IconParseEventDetail> {
  constructor(src: string, string: string, element: SVGSVGElement, cache?: string, sanitized?: string) {
    super('parse', { detail: { cache, element, sanitized, src, string } })
  }
}

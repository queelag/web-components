import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  cache?: string
  element: SVGSVGElement
  sanitized?: string
  src: string
  string: string
}

/**
 * @category Event
 */
export class IconParseEvent extends IsomorphicEvent<Detail> {
  constructor(src: string, string: string, element: SVGSVGElement, cache?: string, sanitized?: string) {
    super('parse', { detail: { cache, element, sanitized, src, string } })
  }
}

import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  src: string
  text: string
}

/**
 * @category Event
 */
export class IconFetchEvent extends IsomorphicEvent<Detail> {
  constructor(src: string, text: string) {
    super('fetch', { detail: { src, text } })
  }
}

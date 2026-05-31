import { IsomorphicEvent } from '@aracna/web'

export interface IconFetchEventDetail {
  src: string
  text: string
}

export class IconFetchEvent extends IsomorphicEvent<IconFetchEventDetail> {
  constructor(src: string, text: string) {
    super('fetch', { detail: { src, text } })
  }
}

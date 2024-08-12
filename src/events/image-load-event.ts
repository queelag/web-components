import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  base64?: string
  src: string
}

/**
 * @category Event
 */
export class ImageLoadEvent extends IsomorphicEvent<Detail> {
  constructor(src: string, base64?: string) {
    super('image-load', { detail: { base64, src } })
  }
}

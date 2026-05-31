import { IsomorphicEvent } from '@aracna/web'

export interface ImageLoadEventDetail {
  base64?: string
  src: string
}

export class ImageLoadEvent extends IsomorphicEvent<ImageLoadEventDetail> {
  constructor(src: string, base64?: string) {
    super('image-load', { detail: { base64, src } })
  }
}

import { IsomorphicEvent } from '@aracna/web'

export interface ImageLoadErrorEventDetail {
  event: ErrorEvent
  src?: string
}

export class ImageLoadErrorEvent extends IsomorphicEvent<ImageLoadErrorEventDetail> {
  constructor(src: string | undefined, event: ErrorEvent) {
    super('image-load-error', { detail: { event, src } })
  }
}

import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  event: ErrorEvent
  src?: string
}

/**
 * @category Event
 */
export class ImageLoadErrorEvent extends IsomorphicEvent<Detail> {
  constructor(src: string | undefined, event: ErrorEvent) {
    super('image-load-error', { detail: { event, src } })
  }
}

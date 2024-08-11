import { IsomorphicEvent } from '@aracna/web'

interface Detail<T extends HTMLElement> {
  old?: T
}

/**
 * @category Event
 */
export class CarouselTabActivateEvent<T extends HTMLElement> extends IsomorphicEvent<Detail<T>> {
  constructor(old?: T) {
    super('activate', { detail: { old } })
  }
}

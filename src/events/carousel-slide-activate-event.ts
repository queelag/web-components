import { IsomorphicEvent } from '@aracna/web'

interface Detail<T extends HTMLElement> {
  element: T
  old?: T
}

/**
 * @category Event
 */
export class CarouselSlideActivateEvent<T extends HTMLElement> extends IsomorphicEvent<Detail<T>> {
  constructor(element: T, old?: T) {
    super('carousel-slide-activate', { detail: { element, old } })
  }
}

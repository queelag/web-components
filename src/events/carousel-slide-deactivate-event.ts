import { IsomorphicEvent } from '@aracna/web'

interface Detail<T extends HTMLElement> {
  element: T
}

/**
 * @category Event
 */
export class CarouselSlideDeactivateEvent<T extends HTMLElement> extends IsomorphicEvent<Detail<T>> {
  constructor(element: T) {
    super('carousel-slide-deactivate', { detail: { element } })
  }
}

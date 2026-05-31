import { IsomorphicEvent } from '@aracna/web'

export interface CarouselSlideActivateEventDetail<T extends HTMLElement> {
  old?: T
}

export class CarouselSlideActivateEvent<T extends HTMLElement> extends IsomorphicEvent<CarouselSlideActivateEventDetail<T>> {
  constructor(old?: T) {
    super('activate', { detail: { old } })
  }
}

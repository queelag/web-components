import { IsomorphicEvent } from '@aracna/web'

export interface CarouselTabActivateEventDetail<T extends HTMLElement> {
  old?: T
}

export class CarouselTabActivateEvent<T extends HTMLElement> extends IsomorphicEvent<CarouselTabActivateEventDetail<T>> {
  constructor(old?: T) {
    super('activate', { detail: { old } })
  }
}

import { IsomorphicEvent } from '@aracna/web'

export class CarouselSlideDeactivateEvent extends IsomorphicEvent {
  constructor() {
    super('deactivate')
  }
}

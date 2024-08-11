import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselSlideDeactivateEvent extends IsomorphicEvent {
  constructor() {
    super('deactivate')
  }
}

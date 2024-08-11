import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselTabDeactivateEvent extends IsomorphicEvent {
  constructor() {
    super('deactivate')
  }
}

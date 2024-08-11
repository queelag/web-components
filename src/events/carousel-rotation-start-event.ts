import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselRotationStartEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-start')
  }
}

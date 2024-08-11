import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselRotationStopEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-stop')
  }
}

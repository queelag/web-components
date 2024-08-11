import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselRotationPauseEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-pause')
  }
}

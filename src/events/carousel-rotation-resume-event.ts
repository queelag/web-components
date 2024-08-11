import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CarouselRotationResumeEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-resume')
  }
}

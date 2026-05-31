import { IsomorphicEvent } from '@aracna/web'

export class CarouselRotationResumeEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-resume')
  }
}

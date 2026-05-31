import { IsomorphicEvent } from '@aracna/web'

export class CarouselRotationPauseEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-pause')
  }
}

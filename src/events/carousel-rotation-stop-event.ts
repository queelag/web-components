import { IsomorphicEvent } from '@aracna/web'

export class CarouselRotationStopEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-stop')
  }
}

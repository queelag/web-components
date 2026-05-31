import { IsomorphicEvent } from '@aracna/web'

export class CarouselRotationStartEvent extends IsomorphicEvent {
  constructor() {
    super('rotation-start')
  }
}

import { IsomorphicEvent } from '@aracna/web'

export class CarouselTabDeactivateEvent extends IsomorphicEvent {
  constructor() {
    super('deactivate')
  }
}

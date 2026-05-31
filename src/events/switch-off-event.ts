import { IsomorphicEvent } from '@aracna/web'

export class SwitchOffEvent extends IsomorphicEvent {
  constructor() {
    super('switch-off')
  }
}

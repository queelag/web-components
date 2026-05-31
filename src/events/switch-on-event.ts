import { IsomorphicEvent } from '@aracna/web'

export class SwitchOnEvent extends IsomorphicEvent {
  constructor() {
    super('switch-on')
  }
}

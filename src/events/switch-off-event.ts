import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class SwitchOffEvent extends IsomorphicEvent {
  constructor() {
    super('switch-off')
  }
}

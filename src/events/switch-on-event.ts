import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class SwitchOnEvent extends IsomorphicEvent {
  constructor() {
    super('switch-on')
  }
}

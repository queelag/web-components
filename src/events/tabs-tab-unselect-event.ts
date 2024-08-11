import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class TabsTabUnselectEvent extends IsomorphicEvent {
  constructor() {
    super('unselect')
  }
}

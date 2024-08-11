import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class TabsTabSelectEvent extends IsomorphicEvent {
  constructor() {
    super('select')
  }
}

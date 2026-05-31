import { IsomorphicEvent } from '@aracna/web'

export class TabsTabUnselectEvent extends IsomorphicEvent {
  constructor() {
    super('unselect')
  }
}

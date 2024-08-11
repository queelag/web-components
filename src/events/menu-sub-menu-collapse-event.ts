import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class MenuSubMenuCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

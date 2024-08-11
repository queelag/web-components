import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class MenuSubMenuExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class DisclosureSectionExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

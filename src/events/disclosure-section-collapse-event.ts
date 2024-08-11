import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class DisclosureSectionCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

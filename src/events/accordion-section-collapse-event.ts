import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class AccordionSectionCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

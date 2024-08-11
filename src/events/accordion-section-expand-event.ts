import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class AccordionSectionExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

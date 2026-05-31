import { IsomorphicEvent } from '@aracna/web'

export class AccordionSectionCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

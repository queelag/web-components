import { IsomorphicEvent } from '@aracna/web'

export class AccordionSectionExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

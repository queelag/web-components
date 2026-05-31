import { IsomorphicEvent } from '@aracna/web'

export class DisclosureSectionCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

import { IsomorphicEvent } from '@aracna/web'

export class DisclosureSectionExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

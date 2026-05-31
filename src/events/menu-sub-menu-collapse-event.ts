import { IsomorphicEvent } from '@aracna/web'

export class MenuSubMenuCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}

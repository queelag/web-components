import { IsomorphicEvent } from '@aracna/web'

export class MenuSubMenuExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}

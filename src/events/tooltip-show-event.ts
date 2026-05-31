import { IsomorphicEvent } from '@aracna/web'

export class TooltipShowEvent extends IsomorphicEvent {
  constructor() {
    super('show')
  }
}

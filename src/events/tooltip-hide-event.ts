import { IsomorphicEvent } from '@aracna/web'

export class TooltipHideEvent extends IsomorphicEvent {
  constructor() {
    super('hide')
  }
}

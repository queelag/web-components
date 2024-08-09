import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  finalize: Function
}

/**
 * @category Event
 */
export class ButtonClickEvent extends IsomorphicEvent<Detail> {
  constructor(finalize: Function) {
    super('button-click', { detail: { finalize } })
  }
}

import { IsomorphicEvent } from '@aracna/web'
import { ButtonClickCallback } from '../definitions/types.js'

interface Detail {
  callback: Function
}

/**
 * @category Event
 */
export class ButtonClickEvent extends IsomorphicEvent<Detail> {
  constructor(callback: ButtonClickCallback) {
    super('button-click', { detail: { callback } })
  }
}

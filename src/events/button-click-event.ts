import { IsomorphicEvent } from '@aracna/web'
import { ButtonClickCallback } from '../definitions/types.js'

export interface ButtonClickEventDetail {
  callback: CallableFunction
}

export class ButtonClickEvent extends IsomorphicEvent<ButtonClickEventDetail> {
  constructor(callback: ButtonClickCallback) {
    super('button-click', { detail: { callback } })
  }
}

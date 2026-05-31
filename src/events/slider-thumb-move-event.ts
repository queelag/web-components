import { IsomorphicEvent } from '@aracna/web'
import { DEFAULT_SLIDER_THUMB_VALUE } from '../definitions/constants.js'

export interface SliderThumbMoveEventDetail {
  percentage: number
  value: number
}

export class SliderThumbMoveEvent extends IsomorphicEvent<SliderThumbMoveEventDetail> {
  constructor(value: number | undefined, percentage: number) {
    super('move', { detail: { percentage, value: value ?? DEFAULT_SLIDER_THUMB_VALUE } })
  }
}

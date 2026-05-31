import { IsomorphicEvent } from '@aracna/web'

export interface SliderChangeEventDetail {
  percentage: number | number[]
  value?: number | number[]
}

export class SliderChangeEvent extends IsomorphicEvent<SliderChangeEventDetail> {
  constructor(value: number | number[] | undefined, percentage: number | number[]) {
    super('slider-change', { detail: { percentage, value } })
  }
}

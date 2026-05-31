import { IsomorphicEvent } from '@aracna/web'

export interface StateChangeEventDetail<T = any> {
  name: string
  old?: T
  value?: T
}

export class StateChangeEvent<T = any> extends IsomorphicEvent<StateChangeEventDetail<T>> {
  constructor(name: string, old: T | undefined, value: T | undefined) {
    super('state-change', { detail: { name, old, value } })
  }
}

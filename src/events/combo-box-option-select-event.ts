import { IsomorphicEvent } from '@aracna/web'

interface Detail<T> {
  element: T
  value?: any
}

/**
 * @category Event
 */
export class ComboBoxOptionSelectEvent<T extends HTMLElement> extends IsomorphicEvent<Detail<T>> {
  constructor(element: T, value: any) {
    super('combo-box-option-select', { detail: { element, value } })
  }
}

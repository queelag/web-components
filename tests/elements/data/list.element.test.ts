import { afterEach, beforeEach, describe, it } from 'vitest'
import '../../../src/elements/data/list.element'
import type { ListElement } from '../../../src/elements/data/list.element'
import { render } from '../../../vitest/dom.utils'

describe('ListElement', () => {
  let list: ListElement

  beforeEach(() => {
    list = document.createElement('q-list')
  })

  afterEach(() => {
    list.remove()
  })

  it('renders', async () => {
    await render(list)
  })
})

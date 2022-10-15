import { afterEach, beforeEach, describe, it } from 'vitest'
import '../../src/elements/list.element'
import type { ListElement } from '../../src/elements/list.element'
import { render } from '../../vitest/utils'

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

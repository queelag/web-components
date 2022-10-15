import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../src/elements/button.group.element'
import type { ButtonGroupElement } from '../../src/elements/button.group.element'
import { render } from '../../vitest/utils'

describe('ButtonGroupElement', () => {
  let group: ButtonGroupElement

  beforeEach(() => {
    group = document.createElement('q-button-group')
  })

  afterEach(() => {
    group.remove()
  })

  it('renders', async () => {
    await render(group)
    expect(group.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

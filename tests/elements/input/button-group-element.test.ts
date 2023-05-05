import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/button-group-element'
import type { ButtonGroupElement } from '../../../src/elements/input/button-group-element'
import { render } from '../../../vitest/dom-utils'

describe('ButtonGroupElement', () => {
  let group: ButtonGroupElement

  beforeEach(() => {
    group = document.createElement('aracna-button-group')
  })

  afterEach(() => {
    group.remove()
  })

  it('renders', async () => {
    await render(group)
    expect(group.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

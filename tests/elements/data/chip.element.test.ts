import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/data/chip.element'
import type { ChipElement } from '../../../src/elements/data/chip.element'
import { render } from '../../../vitest/dom.utils'

describe('ChipElement', () => {
  let chip: ChipElement

  beforeEach(() => {
    chip = document.createElement('q-chip')
  })

  afterEach(() => {
    chip.remove()
  })

  it('renders', async () => {
    await render(chip)
    expect(chip.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

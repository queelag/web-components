import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.slider.element'
import type { AriaSliderElement } from '../../../src/elements/aria/aria.slider.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaSliderElement', () => {
  let slider: AriaSliderElement

  beforeEach(() => {
    slider = document.createElement('q-aria-slider')
  })

  afterEach(() => {
    slider.remove()
  })

  it('has correct aria', async () => {
    await render(slider)

    expect(slider.getAttribute('role')).toBe('group')
  })
})

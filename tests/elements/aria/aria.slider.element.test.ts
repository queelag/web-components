import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.slider.element'
import type { AriaSliderElement, AriaSliderThumbElement } from '../../../src/elements/aria/aria.slider.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaSliderElement', () => {
  let slider: AriaSliderElement, t1: AriaSliderThumbElement, t2: AriaSliderThumbElement

  beforeEach(() => {
    slider = document.createElement('q-aria-slider')

    t1 = document.createElement('q-aria-slider-thumb')
    t2 = document.createElement('q-aria-slider-thumb')

    slider.append(t1)
  })

  afterEach(() => {
    slider.remove()
  })

  it('has correct aria', async () => {
    await render(slider)

    // expect(slider.getAttribute('aria-labelledby')).toBe('label')
    expect(slider.getAttribute('aria-disabled')).toBe('false')
    expect(slider.getAttribute('aria-readonly')).toBe('false')
    expect(slider.getAttribute('role')).toBe('group')

    // expect(t1.getAttribute('aria-labelledby')).toBe('label')
    expect(t1.getAttribute('aria-orientation')).toBe('horizontal')
    expect(t1.getAttribute('aria-valuemax')).toBe('100')
    expect(t1.getAttribute('aria-valuemin')).toBe('0')
    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('role')).toBe('slider')
    expect(t1.getAttribute('tabindex')).toBe('0')
  })

  it('moves the thumb on click if it has a single thumb', async () => {
    await render(slider)
  })
})

import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_STEP } from '../../../src/definitions/constants'
import '../../../src/elements/input/slider-element'
import type { AracnaSliderElement as SliderElement, AracnaSliderThumbElement as SliderThumbElement } from '../../../src/elements/input/slider-element'
import { dispatchInputEvent, dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('SliderElement', () => {
  let slider: SliderElement

  beforeEach(() => {
    slider = document.createElement('aracna-slider')
  })

  afterEach(() => {
    slider.remove()
  })

  it('has aria attributes', async () => {
    await render(slider)

    expect(slider.getAttribute('aria-disabled')).toBe('false')
    expect(slider.getAttribute('aria-readonly')).toBe('false')
    expect(slider.getAttribute('role')).toBe('group')
  })

  it('works with single thumb', async () => {
    let thumb: SliderThumbElement

    thumb = document.createElement('aracna-slider-thumb')
    slider.append(thumb)

    await render(slider)
    expect(slider.value).toBeUndefined()

    dispatchKeyDownEvent(thumb, KeyboardEventKey.ARROW_RIGHT)
    await thumb.updateComplete
    expect(slider.value).toBe(1)

    slider.clear()
    await slider.updateComplete
    expect(slider.value).toBeUndefined()
  })

  it('works with multiple thumbs', async () => {
    let thumb1: SliderThumbElement, thumb2: SliderThumbElement

    thumb1 = document.createElement('aracna-slider-thumb')
    thumb2 = document.createElement('aracna-slider-thumb')

    slider.append(thumb1, thumb2)

    await render(slider)
    expect(slider.value).toBeUndefined()

    dispatchKeyDownEvent(thumb1, KeyboardEventKey.ARROW_RIGHT)
    await thumb1.updateComplete
    expect(slider.value).toStrictEqual([1])

    dispatchKeyDownEvent(thumb2, KeyboardEventKey.ARROW_RIGHT)
    await thumb2.updateComplete
    expect(slider.value).toStrictEqual([1, 1])

    slider.clear()
    await slider.updateComplete
    expect(slider.value).toBeUndefined()
  })

  it('supports native', async () => {
    let native: HTMLInputElement

    native = document.createElement('input')
    slider.append(native)

    await render(slider)

    expect(slider.value).toBeUndefined()
    expect(native.max).toBe(String(DEFAULT_SLIDER_MAX))
    expect(native.min).toBe(String(DEFAULT_SLIDER_MIN))
    expect(native.step).toBe(String(DEFAULT_SLIDER_STEP))
    expect(native.value).toBe('50')

    dispatchInputEvent(native, '1')
    await slider.updateComplete

    expect(slider.value).toBe(1)
    expect(native.value).toBe('1')

    slider.clear()
    await slider.updateComplete

    expect(slider.value).toBeUndefined()
    expect(native.value).toBe('0')
  })
})

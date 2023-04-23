import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_STEP, KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/slider.element'
import type { SliderElement, SliderThumbElement } from '../../../src/elements/input/slider.element'
import { dispatchInputEvent, dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

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
    expect(slider.value).toStrictEqual([1, 0])

    dispatchKeyDownEvent(thumb2, KeyboardEventKey.ARROW_RIGHT)
    await thumb2.updateComplete
    expect(slider.value).toStrictEqual([1, 1])

    slider.clear()
    await slider.updateComplete
    expect(slider.value).toBeUndefined()
  })

  it('supports native', async () => {
    await render(slider, { native: 'true' })

    expect(slider.value).toBeUndefined()
    expect(slider.renderRoot.querySelector('input')?.getAttribute('max')).toBe(String(DEFAULT_SLIDER_MAX))
    expect(slider.renderRoot.querySelector('input')?.getAttribute('min')).toBe(String(DEFAULT_SLIDER_MIN))
    expect(slider.renderRoot.querySelector('input')?.getAttribute('step')).toBe(String(DEFAULT_SLIDER_STEP))
    expect(slider.renderRoot.querySelector('input')?.getAttribute('value')).toBe('')

    dispatchInputEvent(slider.renderRoot.querySelector('input'), '1')
    await slider.updateComplete

    expect(slider.value).toBe(1)
    expect(slider.renderRoot.querySelector('input')?.getAttribute('value')).toBe('1')

    slider.clear()
    await slider.updateComplete

    expect(slider.value).toBeUndefined()
    expect(slider.renderRoot.querySelector('input')?.getAttribute('value')).toBe('')
  })
})

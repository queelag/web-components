import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-slider-element'
import type { AriaSliderElement, AriaSliderThumbElement } from '../../../src/elements/aria/aria-slider-element'
import {
  dispatchClickEvent,
  dispatchKeyDownEvent,
  dispatchMouseDownEvent,
  dispatchMouseMoveEvent,
  dispatchMouseUpEvent,
  dispatchTouchEndEvent,
  dispatchTouchMoveEvent,
  dispatchTouchStartEvent,
  render
} from '../../../vitest/dom-utils'

describe('AriaSliderElement', () => {
  let slider: AriaSliderElement, t1: AriaSliderThumbElement, t2: AriaSliderThumbElement

  beforeEach(() => {
    slider = document.createElement('aracna-aria-slider')
    slider.style.height = '100px'
    slider.style.width = '100px'

    t1 = document.createElement('aracna-aria-slider-thumb')
    t2 = document.createElement('aracna-aria-slider-thumb')

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

  it('moves the thumb on slider click if it has only one thumb', async () => {
    await render(slider)

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()

    dispatchClickEvent(slider, { clientX: 50, clientY: 0 })
    await slider.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('value')).toBe('50')
  })

  it('moves the thumb on mouse sequence with horizontal orientation', async () => {
    await render(slider)

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchMouseDownEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchMouseMoveEvent(document, { clientX: 25 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchMouseMoveEvent(document, { clientX: 50 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseUpEvent(document)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseDownEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseMoveEvent(document, { clientX: 25 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchMouseUpEvent(document)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('25')
  })

  it('moves the thumb on mouse sequence with vertical orientation', async () => {
    await render(slider, { orientation: 'vertical' })

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchMouseDownEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchMouseMoveEvent(document, { clientY: 25 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchMouseMoveEvent(document, { clientY: 50 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseUpEvent(document)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseDownEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchMouseMoveEvent(document, { clientY: 25 })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchMouseUpEvent(document)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('25')
  })

  it('moves the thumb on touch sequence with horizontal orientation', async () => {
    await render(slider)

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchTouchStartEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientX: 25, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientX: 50, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchEndEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchStartEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientX: 25, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchTouchEndEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('25')
  })

  it('moves the thumb on touch sequence with vertical orientation', async () => {
    await render(slider, { orientation: 'vertical' })

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchTouchStartEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBeNull()

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientY: 25, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientY: 50, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchEndEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchStartEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('50')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('50')

    dispatchTouchMoveEvent(t1, { touches: [new Touch({ clientY: 25, identifier: 0, target: t1 })] })
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).not.toBeNull()
    expect(t1.getAttribute('value')).toBe('25')

    dispatchTouchEndEvent(t1)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('25')
    expect(t1.getAttribute('movable')).toBeNull()
    expect(t1.getAttribute('value')).toBe('25')
  })

  it('supports keyboard usage', async () => {
    await render(slider)

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_LEFT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_DOWN)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_UP)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_UP)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('11')
    expect(t1.getAttribute('value')).toBe('11')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_DOWN)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_DOWN)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')

    dispatchKeyDownEvent(t1, KeyboardEventKey.END)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('100')
    expect(t1.getAttribute('value')).toBe('100')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_UP)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('100')
    expect(t1.getAttribute('value')).toBe('100')

    dispatchKeyDownEvent(t1, KeyboardEventKey.HOME)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')
  })

  it('works with multiple thumbs', async () => {
    slider.append(t2)
    await render(slider)

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()
    expect(t2.getAttribute('aria-valuenow')).toBe('0')
    expect(t2.getAttribute('value')).toBeNull()

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_RIGHT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()
    expect(t2.getAttribute('aria-valuenow')).toBe('1')
    expect(t2.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('1')
    expect(t2.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_LEFT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('0')
    expect(t2.getAttribute('value')).toBe('0')

    dispatchKeyDownEvent(t2, KeyboardEventKey.PAGE_UP)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('10')
    expect(t2.getAttribute('value')).toBe('10')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_UP)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('11')
    expect(t1.getAttribute('value')).toBe('11')
    expect(t2.getAttribute('aria-valuenow')).toBe('10')
    expect(t2.getAttribute('value')).toBe('10')
  })

  it('can disable swapping of thumbs', async () => {
    slider.append(t2)
    await render(slider, { 'disable-swap': 'true' })

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()
    expect(t2.getAttribute('aria-valuenow')).toBe('0')
    expect(t2.getAttribute('value')).toBeNull()

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()
    expect(t2.getAttribute('aria-valuenow')).toBe('0')
    expect(t2.getAttribute('value')).toBeNull()

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_RIGHT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()
    expect(t2.getAttribute('aria-valuenow')).toBe('1')
    expect(t2.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('1')
    expect(t2.getAttribute('value')).toBe('1')

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_LEFT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('1')
    expect(t2.getAttribute('value')).toBe('1')
  })

  it('supports custom min distance when disabling swap', async () => {
    slider.append(t2)
    await render(slider, { 'disable-swap': 'true', 'min-distance': '10' })

    t1.value = 0
    t2.value = 10

    await t1.updateComplete
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')
    expect(t2.getAttribute('aria-valuenow')).toBe('10')
    expect(t2.getAttribute('value')).toBe('10')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')
    expect(t2.getAttribute('aria-valuenow')).toBe('10')
    expect(t2.getAttribute('value')).toBe('10')

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_RIGHT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')
    expect(t2.getAttribute('aria-valuenow')).toBe('11')
    expect(t2.getAttribute('value')).toBe('11')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('11')
    expect(t2.getAttribute('value')).toBe('11')

    dispatchKeyDownEvent(t2, KeyboardEventKey.ARROW_LEFT)
    await t2.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
    expect(t2.getAttribute('aria-valuenow')).toBe('11')
    expect(t2.getAttribute('value')).toBe('11')
  })

  it('supports decimal values', async () => {
    await render(slider, { decimals: '1', max: '2', min: '0', step: '0.1' })

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBeNull()

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_RIGHT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0.1')
    expect(t1.getAttribute('value')).toBe('0.1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_UP)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1.1')
    expect(t1.getAttribute('value')).toBe('1.1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.PAGE_DOWN)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0.1')
    expect(t1.getAttribute('value')).toBe('0.1')

    dispatchKeyDownEvent(t1, KeyboardEventKey.END)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('2')
    expect(t1.getAttribute('value')).toBe('2')

    dispatchKeyDownEvent(t1, KeyboardEventKey.ARROW_LEFT)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1.9')
    expect(t1.getAttribute('value')).toBe('1.9')

    dispatchKeyDownEvent(t1, KeyboardEventKey.HOME)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('0')
    expect(t1.getAttribute('value')).toBe('0')

    dispatchMouseDownEvent(t1)
    await t1.updateComplete
    dispatchMouseMoveEvent(document, { clientX: 50 })
    await t1.updateComplete
    dispatchMouseUpEvent(document)
    await t1.updateComplete

    expect(t1.getAttribute('aria-valuenow')).toBe('1')
    expect(t1.getAttribute('value')).toBe('1')
  })
})

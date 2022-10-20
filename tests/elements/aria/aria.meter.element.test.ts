import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.meter.element'
import type { AriaMeterElement } from '../../../src/elements/aria/aria.meter.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaMeterElement', () => {
  let meter: AriaMeterElement

  beforeEach(() => {
    meter = document.createElement('q-aria-meter')
  })

  afterEach(() => {
    meter.remove()
  })

  it('has correct aria', async () => {
    await render(meter)

    expect(meter.getAttribute('aria-valuemax')).toBe('1')
    expect(meter.getAttribute('aria-valuemin')).toBe('0')
    expect(meter.getAttribute('aria-valuenow')).toBe('0')
    expect(meter.getAttribute('role')).toBe('meter')
  })

  it('limits value between min and max', async () => {
    await render(meter, { value: '2' })

    expect(meter.getAttribute('aria-valuenow')).toBe('1')
    expect(meter.getAttribute('value')).toBe('2')

    meter.value = -1
    await meter.updateComplete

    expect(meter.getAttribute('aria-valuenow')).toBe('0')
    expect(meter.getAttribute('value')).toBe('0')

    meter.max = 100
    meter.value = 200
    await meter.updateComplete

    expect(meter.getAttribute('aria-valuenow')).toBe('100')
    expect(meter.getAttribute('value')).toBe('100')

    meter.min = 50
    meter.value = 0
    await meter.updateComplete

    expect(meter.getAttribute('aria-valuenow')).toBe('50')
    expect(meter.getAttribute('value')).toBe('50')
  })
})

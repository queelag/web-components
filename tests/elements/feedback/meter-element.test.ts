import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_METER_MAX, DEFAULT_METER_MIN, DEFAULT_METER_VALUE } from '../../../src/definitions/constants'
import '../../../src/elements/feedback/meter-element'
import type { AracnaMeterElement as MeterElement } from '../../../src/elements/feedback/meter-element'
import { render } from '../../../vitest/dom-utils'

describe('MeterElement', () => {
  let meter: MeterElement

  beforeEach(() => {
    meter = document.createElement('aracna-meter')
  })

  afterEach(() => {
    meter.remove()
  })

  it('has aria attributes', async () => {
    await render(meter)

    expect(meter.getAttribute('aria-valuemax')).toBe('1')
    expect(meter.getAttribute('aria-valuemin')).toBe('0')
    expect(meter.getAttribute('aria-valuenow')).toBe('0')
    expect(meter.getAttribute('role')).toBe('meter')
  })

  it('supports native', async () => {
    let native: HTMLMeterElement

    native = document.createElement('meter')
    meter.append(native)

    await render(meter)

    expect(meter.getAttribute('aria-valuemax')).toBeNull()
    expect(meter.getAttribute('aria-valuemin')).toBeNull()
    expect(meter.getAttribute('aria-valuenow')).toBeNull()
    expect(meter.getAttribute('role')).toBeNull()

    expect(native.max).toBe(DEFAULT_METER_MAX)
    expect(native.min).toBe(DEFAULT_METER_MIN)
    expect(native.value).toBe(DEFAULT_METER_VALUE)

    meter.low = 0
    meter.high = 1
    meter.max = 1
    meter.min = 0
    meter.optimum = 0.5
    meter.value = 0

    await meter.updateComplete

    expect(native.low).toBe(0)
    expect(native.high).toBe(1)
    expect(native.max).toBe(1)
    expect(native.min).toBe(0)
    expect(native.optimum).toBe(0.5)
    expect(native.value).toBe(0)
  })

  it('returns percentage and optionally rounds it', async () => {
    await render(meter, { value: '0.5' })
    expect(meter.percentage).toBe(50)

    meter.round = true
    meter.value = 0.507
    await meter.updateComplete

    expect(meter.percentage).toBe(51)
  })
})

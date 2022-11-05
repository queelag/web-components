import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/feedback/meter.element'
import type { MeterElement } from '../../../src/elements/feedback/meter.element'
import { render } from '../../../vitest/dom.utils'

describe('MeterElement', () => {
  let meter: MeterElement

  beforeEach(() => {
    meter = document.createElement('q-meter')
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
    await render(meter, { native: 'true' })

    expect(meter.getAttribute('aria-valuemax')).toBeNull()
    expect(meter.getAttribute('aria-valuemin')).toBeNull()
    expect(meter.getAttribute('aria-valuenow')).toBeNull()
    expect(meter.getAttribute('role')).toBeNull()

    expect(meter.renderRoot.querySelector('meter')?.getAttribute('max')).toBeNull()
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('min')).toBeNull()
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('style')).toBe('')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('value')).toBeNull()

    meter.low = 0
    meter.high = 1
    meter.max = 1
    meter.min = 0
    meter.native = true
    meter.optimum = 0.5
    meter.value = 0
    await meter.updateComplete

    expect(meter.renderRoot.querySelector('meter')?.getAttribute('low')).toBe('0')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('high')).toBe('1')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('max')).toBe('1')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('min')).toBe('0')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('optimum')).toBe('0.5')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('style')).toBe('')
    expect(meter.renderRoot.querySelector('meter')?.getAttribute('value')).toBe('0')
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

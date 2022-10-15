import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../src/elements/meter.element'
import type { MeterElement } from '../../src/elements/meter.element'
import { render } from '../../vitest/dom.utils'

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

    meter.remove()
    await render(meter, { low: '0', high: '1', max: '1', min: '0', native: 'true', optimum: '0.5', value: '0' })

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

    await render(meter, { round: 'true', value: '0.507' })
    expect(meter.percentage).toBe(51)
  })
})

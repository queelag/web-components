import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/data/badge.element'
import type { BadgeElement } from '../../../src/elements/data/badge.element'
import { render } from '../../../vitest/dom.utils'

describe('BadgeElement', () => {
  let badge: BadgeElement

  beforeEach(() => {
    badge = document.createElement('aracna-badge')
  })

  afterEach(() => {
    badge.remove()
  })

  it('renders string value', async () => {
    await render(badge, { value: 'a' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('a')
  })

  it('renders numeric value and respects min and max attributes', async () => {
    await render(badge, { numeric: 'true', value: '0' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('0')
    await render(badge, { numeric: 'true', value: '100' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('99')
    await render(badge, { numeric: 'true', value: '-1' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('0')
    await render(badge, { min: '50', numeric: 'true', value: '0' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('50')
    await render(badge, { max: '50', numeric: 'true', value: '100' })
    expect(badge.shadowRoot?.querySelector('slot')?.textContent).toBe('50')
  })
})

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.tooltip.element'
import type { AriaTooltipElement } from '../../../src/elements/aria/aria.tooltip.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaTooltipElement', () => {
  let tooltip: AriaTooltipElement

  beforeEach(() => {
    tooltip = document.createElement('q-aria-tooltip')
  })

  afterEach(() => {
    tooltip.remove()
  })

  it('has correct aria', async () => {
    await render(tooltip)

    expect(tooltip.getAttribute('role')).toBe('tooltip')
  })
})

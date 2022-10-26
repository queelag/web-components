import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.tooltip.element'
import type {
  AriaTooltipArrowElement,
  AriaTooltipContentElement,
  AriaTooltipElement,
  AriaTooltipTriggerElement
} from '../../../src/elements/aria/aria.tooltip.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaTooltipElement', () => {
  let tooltip: AriaTooltipElement, arrow: AriaTooltipArrowElement, content: AriaTooltipContentElement, trigger: AriaTooltipTriggerElement

  beforeEach(() => {
    tooltip = document.createElement('q-aria-tooltip')

    arrow = document.createElement('q-aria-tooltip-arrow')
    content = document.createElement('q-aria-tooltip-content')
    trigger = document.createElement('q-aria-tooltip-trigger')

    tooltip.append(content, trigger)
  })

  afterEach(() => {
    tooltip.remove()
  })

  it('has correct aria', async () => {
    await render(tooltip)

    expect(tooltip.getAttribute('role')).toBe('tooltip')

    expect(content.getAttribute('id')).not.toBeNull()

    expect(trigger.getAttribute('aria-describedby')).toBe(content.id)
    expect(trigger.getAttribute('tabindex')).toBeNull()
  })

  it('shows and hides on focus events if focusable', async () => {
    await render(tooltip, { focusable: 'true' })

    expect(tooltip.getAttribute('visible')).toBeNull()
    expect(trigger.getAttribute('tabindex')).toBe('0')

    trigger.focus()
    await trigger.updateComplete

    expect(tooltip.getAttribute('visible')).not.toBeNull()
    expect(trigger.getAttribute('tabindex')).toBe('0')

    trigger.blur()
    await trigger.updateComplete

    expect(tooltip.getAttribute('visible')).toBeNull()
    expect(trigger.getAttribute('tabindex')).toBe('0')
  })

  it('does not show on focus if not focusable', async () => {
    await render(tooltip)

    expect(tooltip.getAttribute('visible')).toBeNull()
    expect(trigger.getAttribute('tabindex')).toBeNull()

    trigger.focus()
    await trigger.updateComplete

    expect(tooltip.getAttribute('visible')).toBeNull()
    expect(trigger.getAttribute('tabindex')).toBeNull()
  })
})

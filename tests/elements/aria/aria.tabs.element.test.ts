import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.tabs.element'
import type { AriaTabsElement, AriaTabsPanelElement, AriaTabsTabElement } from '../../../src/elements/aria/aria.tabs.element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

describe('AriaTabsElement', () => {
  let tabs: AriaTabsElement, t1: AriaTabsTabElement, t2: AriaTabsTabElement, p1: AriaTabsPanelElement, p2: AriaTabsPanelElement

  beforeEach(() => {
    tabs = document.createElement('q-aria-tabs')

    t1 = document.createElement('q-aria-tabs-tab')
    t2 = document.createElement('q-aria-tabs-tab')
    p1 = document.createElement('q-aria-tabs-panel')
    p2 = document.createElement('q-aria-tabs-panel')

    tabs.append(t1, t2, p1, p2)
  })

  afterEach(() => {
    tabs.remove()
  })

  it('has correct aria', async () => {
    await render(tabs)

    // expect(tabs.getAttribute('aria-labelledby')).toBe('label')
    expect(tabs.getAttribute('role')).toBe('tablist')

    expect(t1.getAttribute('aria-controls')).toBe(p1.id)
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('id')).not.toBeNull()
    expect(t1.getAttribute('role')).toBe('tab')
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-controls')).toBe(p2.id)
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('id')).not.toBeNull()
    expect(t2.getAttribute('role')).toBe('tab')
    expect(t2.getAttribute('tabindex')).toBe('-1')

    expect(p1.getAttribute('aria-labelledby')).toBe(t1.id)
    expect(p1.getAttribute('id')).not.toBeNull()
    expect(p1.getAttribute('role')).toBe('tabpanel')
    expect(p1.getAttribute('tabindex')).toBe('0')
    expect(p2.getAttribute('aria-labelledby')).toBe(t2.id)
    expect(p2.getAttribute('id')).not.toBeNull()
    expect(p2.getAttribute('role')).toBe('tabpanel')
    expect(p2.getAttribute('tabindex')).toBe('0')
  })

  it('selects tabs on click', async () => {
    await render(tabs)

    /**
     * Expect no tab to be focused or selected
     */
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(document.body)

    /**
     * Click the first tab and expect it to be focused and selected
     */
    t1.click()
    await t1.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Click the second tab and expect it to be focused and selected
     */
    t2.click()
    await t2.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)

    /**
     * Click the first tab and expect it to be focused and selected
     */
    t1.click()
    await t1.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)
  })

  it('supports keyboard usage with manual activation', async () => {
    await render(tabs)

    /**
     * Expect no tab to be focused or selected
     */
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(document.body)

    /**
     * Press ARROW_RIGHT and expect the first tab to be focused
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ENTER and expect the first tab to be selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ENTER)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ARROW_DOWN and expect the next (second) tab to be focused, press SPACE and expect it to be selected too
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_DOWN)
    dispatchKeyDownEvent(tabs, KeyboardEventKey.SPACE)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)

    /**
     * Press ARROW_LEFT and expect the previous (first) tab to be focused
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ENTER and expect the first tab to be selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ENTER)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ARROW_UP and expect the previous (second) tab to be focused, press SPACE and expect it to be selected too
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_UP)
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ENTER)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)

    /**
     * Press HOME and expect the first tab to be focused
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.HOME)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ENTER and expect the first tab to be selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ENTER)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press END and expect the last (second) tab to be focused
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.END)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t2)

    /**
     * Press ENTER and expect the second tab to be selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ENTER)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)
  })

  it('supports keyboard usage with automatic activation', async () => {
    await render(tabs, { 'automatic-activation': 'true' })

    /**
     * Expect no tab to be focused or selected
     */
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(document.body)

    /**
     * Press ARROW_RIGHT and expect the first tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ARROW_DOWN and expect the next (second) tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_DOWN)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)

    /**
     * Press ARROW_LEFT and expect the previous (first) tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press ARROW_UP and expect the previous (second) tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_UP)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)

    /**
     * Press HOME and expect the first tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.HOME)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).not.toBeNull()
    expect(t1.getAttribute('selected')).not.toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('0')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('selected')).toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(t1)

    /**
     * Press END and expect the last (second) tab to be focused and selected
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.END)
    await tabs.updateComplete

    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('selected')).toBeNull()
    expect(t1.getAttribute('tabindex')).toBe('-1')
    expect(t2.getAttribute('aria-selected')).not.toBeNull()
    expect(t2.getAttribute('selected')).not.toBeNull()
    expect(t2.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(t2)
  })
})

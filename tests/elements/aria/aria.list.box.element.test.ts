import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.list.box.element'
import type { AriaListBoxElement, AriaListBoxOptionElement } from '../../../src/elements/aria/aria.list.box.element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

describe('AriaListBoxElement', () => {
  let listbox: AriaListBoxElement, o1: AriaListBoxOptionElement, o2: AriaListBoxOptionElement

  beforeEach(() => {
    listbox = document.createElement('aracna-aria-listbox')

    o1 = document.createElement('aracna-aria-listbox-option')
    o2 = document.createElement('aracna-aria-listbox-option')

    listbox.append(o1, o2)
  })

  afterEach(() => {
    listbox.remove()
  })

  it('has correct aria', async () => {
    await render(listbox)

    expect(listbox.getAttribute('aria-activedescendant')).toBeNull()
    expect(listbox.getAttribute('aria-multiselectable')).toBe('false')
    expect(listbox.getAttribute('role')).toBe('listbox')
    expect(listbox.getAttribute('tabindex')).toBe('0')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('role')).toBe('option')
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('role')).toBe('option')
  })

  it('works in single mode', async () => {
    await render(listbox)

    expect(listbox.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    o1.click()
    await o1.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    o2.click()
    await o2.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()
  })

  it('works in multiple mode', async () => {
    await render(listbox, { multiple: 'true' })

    expect(listbox.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    o1.click()
    await o1.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    o2.click()
    await o2.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    o1.click()
    await o1.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    o2.click()
    await o2.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()
  })

  it('supports selection that follows focus', async () => {
    await render(listbox, { 'selection-follows-focus': 'true' })

    o1.click()
    await o1.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_DOWN)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_UP)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()
  })

  it('supports selection of the first option on focus', async () => {
    await render(listbox, { 'select-first-option-on-focus': 'true' })

    expect(listbox.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    listbox.focus()
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()
  })

  it('supports keyboard usage in single mode', async () => {
    await render(listbox)

    /**
     * Focus the listbox and expect the first option to be focused
     */
    listbox.focus()
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN and expect the second option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_DOWN)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_RIGHT and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_RIGHT)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_LEFT and expect the second option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_LEFT)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_UP)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press END and expect the last (second) option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.END)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press HOME and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.HOME)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press CTRL + A and nothing happens since select all is supported only in multiple mode
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.A, { ctrlKey: true })
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press SPACE and expect the first option to be selected
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.SPACE)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()
  })

  it('supports keyboard usage in single mode', async () => {
    await render(listbox, { multiple: 'true' })

    /**
     * Focus the listbox and expect the first option to be focused
     */
    listbox.focus()
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN and expect the second option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_DOWN)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_RIGHT and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_RIGHT)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_LEFT and expect the second option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_LEFT)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.ARROW_UP)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press END and expect the last (second) option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.END)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press HOME and expect the first option to be focused
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.HOME)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press SPACE and expect the first option to be selected
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.SPACE)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press SPACE again and expect the first option to be unselected
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.SPACE)
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press CTRL + A and expect all options to be selected
     */
    dispatchKeyDownEvent(listbox, KeyboardEventKey.A, { ctrlKey: true })
    await listbox.updateComplete

    expect(listbox.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()
  })
})

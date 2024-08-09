import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-radio-group-element'
import type {
  AracnaAriaRadioButtonElement as AriaRadioButtonElement,
  AracnaAriaRadioGroupElement as AriaRadioGroupElement
} from '../../../src/elements/aria/aria-radio-group-element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('AriaRadioGroupElement', () => {
  let radio: AriaRadioGroupElement, b1: AriaRadioButtonElement, b2: AriaRadioButtonElement

  beforeEach(() => {
    radio = document.createElement('aracna-aria-radio-group')

    b1 = document.createElement('aracna-aria-radio-button')
    b2 = document.createElement('aracna-aria-radio-button')

    radio.append(b1, b2)
  })

  afterEach(() => {
    radio.remove()
  })

  it('has correct aria', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-disabled')).toBe('false')
    // expect(radio.getAttribute('aria-labelledby')).toBe('label')
    expect(radio.getAttribute('aria-readonly')).toBe('false')
    expect(radio.getAttribute('role')).toBe('radiogroup')

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('id')).not.toBeNull()
    expect(b1.getAttribute('role')).toBe('radio')
    expect(b1.getAttribute('tabindex')).toBe('0')

    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('id')).not.toBeNull()
    expect(b2.getAttribute('role')).toBe('radio')
    expect(b2.getAttribute('tabindex')).toBe('-1')
  })

  it('works', async () => {
    await render(radio)

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    b1.click()
    await b1.updateComplete

    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(b1)

    b2.click()
    await b2.updateComplete

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(document.activeElement).toBe(b2)
  })

  it('focuses first button on focus and blurs focused button on blur', async () => {
    await render(radio)

    expect(document.activeElement).toBe(document.body)

    b1.focus()
    await b1.updateComplete
    expect(document.activeElement).toBe(b1)

    b1.blur()
    await b1.updateComplete
    expect(document.activeElement).toBe(document.body)
  })

  it('supports keyboard usage', async () => {
    await render(radio)

    /**
     * Focus the first button and expect it to be focused
     */
    b1.focus()
    await b1.updateComplete

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(b1)

    /**
     * Press SPACE and expect the first button to be checked
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.SPACE)
    await radio.updateComplete

    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(b1)

    /**
     * Press ARROW_DOWN and expect the second button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_DOWN)
    await radio.updateComplete

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(document.activeElement).toBe(b2)

    /**
     * Press ARROW_RIGHT and expect the first button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_RIGHT)
    await radio.updateComplete

    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(b1)

    /**
     * Press ARROW_LEFT and expect the second button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_DOWN)
    await radio.updateComplete

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(document.activeElement).toBe(b2)

    /**
     * Press ARROW_UP and expect the first button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_UP)
    await radio.updateComplete

    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(document.activeElement).toBe(b1)
  })
})

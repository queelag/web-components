import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.radio.group.element'
import type { AriaRadioButtonElement, AriaRadioGroupElement } from '../../../src/elements/aria/aria.radio.group.element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

describe('AriaRadioGroupElement', () => {
  let radio: AriaRadioGroupElement, b1: AriaRadioButtonElement, b2: AriaRadioButtonElement

  beforeEach(() => {
    radio = document.createElement('q-aria-radio-group')

    b1 = document.createElement('q-aria-radio-button')
    b2 = document.createElement('q-aria-radio-button')

    radio.append(b1, b2)
  })

  afterEach(() => {
    radio.remove()
  })

  it('has correct aria', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-activedescendant')).toBeNull()
    expect(radio.getAttribute('aria-disabled')).toBe('false')
    // expect(radio.getAttribute('aria-labelledby')).toBe('label')
    expect(radio.getAttribute('aria-readonly')).toBe('false')
    expect(radio.getAttribute('role')).toBe('radiogroup')
    expect(radio.getAttribute('tabindex')).toBe('0')

    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('id')).not.toBeNull()
    expect(b1.getAttribute('role')).toBe('radio')

    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('id')).not.toBeNull()
    expect(b2.getAttribute('role')).toBe('radio')
  })

  it('works', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-activedescendant')).toBeNull()
    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    b1.click()
    await b1.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    b2.click()
    await b2.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b2.id)
    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('focused')).not.toBeNull()
  })

  it('focuses first button on focus and blurs focused button on blur', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-activedescendant')).toBeNull()
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    radio.focus()
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    radio.blur()
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    b2.click()
    await b2.updateComplete
    radio.blur()
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b2.id)
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('focused')).not.toBeNull()
  })

  it('supports keyboard usage', async () => {
    await render(radio)

    /**
     * Focus the radio and expect the first button to be focused
     */
    radio.focus()
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    /**
     * Press SPACE and expect the first button to be checked
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.SPACE)
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    /**
     * Press ARROW_DOWN and expect the second button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_DOWN)
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b2.id)
    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('focused')).not.toBeNull()

    /**
     * Press ARROW_RIGHT and expect the first button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_RIGHT)
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()

    /**
     * Press ARROW_LEFT and expect the second button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_DOWN)
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b2.id)
    expect(b1.getAttribute('aria-checked')).toBeNull()
    expect(b1.getAttribute('checked')).toBeNull()
    expect(b1.getAttribute('focused')).toBeNull()
    expect(b2.getAttribute('aria-checked')).toBe('true')
    expect(b2.getAttribute('checked')).not.toBeNull()
    expect(b2.getAttribute('focused')).not.toBeNull()

    /**
     * Press ARROW_UP and expect the first button to be focused
     */
    dispatchKeyDownEvent(radio, KeyboardEventKey.ARROW_UP)
    await radio.updateComplete

    expect(radio.getAttribute('aria-activedescendant')).toBe(b1.id)
    expect(b1.getAttribute('aria-checked')).toBe('true')
    expect(b1.getAttribute('checked')).not.toBeNull()
    expect(b1.getAttribute('focused')).not.toBeNull()
    expect(b2.getAttribute('aria-checked')).toBeNull()
    expect(b2.getAttribute('checked')).toBeNull()
    expect(b2.getAttribute('focused')).toBeNull()
  })
})

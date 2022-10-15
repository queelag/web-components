import { RadioButton } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/inputs/radio.group.element'
import type { RadioButtonElement, RadioGroupElement } from '../../../src/elements/inputs/radio.group.element'
import { render } from '../../../vitest/dom.utils'

describe('RadioGroupElement', () => {
  let radio: RadioGroupElement

  beforeEach(() => {
    radio = document.createElement('q-radio-group')
  })

  afterEach(() => {
    radio.remove()
  })

  it('has aria attributes', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-activedescendant')).toBeNull()
    expect(radio.getAttribute('aria-disabled')).toBeNull()
    expect(radio.getAttribute('aria-readonly')).toBeNull()
    expect(radio.getAttribute('role')).toBe('radiogroup')
    expect(radio.getAttribute('tabindex')).toBe('0')
  })

  it('works with children buttons', async () => {
    let button1: RadioButtonElement, button2: RadioButtonElement

    button1 = document.createElement('q-radio-button')
    button1.value = 'cat'
    button2 = document.createElement('q-radio-button')
    button2.value = 'dog'

    radio.append(button1, button2)
    await render(radio)

    expect(radio.value).toBeUndefined()

    button1.click()
    await button1.updateComplete

    expect(radio.value).toBe('cat')
    expect(button1.checked).toBeTruthy()
    expect(button1.focused).toBeTruthy()
    expect(button2.checked).toBeFalsy()
    expect(button2.focused).toBeFalsy()

    button2.click()
    await button2.updateComplete

    expect(radio.value).toBe('dog')
    expect(button2.checked).toBeTruthy()
    expect(button2.focused).toBeTruthy()
    expect(button1.checked).toBeFalsy()
    expect(button1.focused).toBeFalsy()

    radio.clear()
    await radio.updateComplete

    expect(radio.value).toBeUndefined()
    expect(button1.checked).toBeFalsy()
    expect(button2.checked).toBeFalsy()
  })

  it('supports native', async () => {
    await render(radio, { buttons: JSON.stringify([{ value: 'cat' }, { value: 'dog' }]), native: 'true' })
    expect(radio.value).toBeUndefined()

    radio.renderRoot.querySelector('input[value="cat"]')?.dispatchEvent(new MouseEvent('click'))
    await radio.updateComplete

    expect(radio.value).toBe('cat')
    expect(radio.renderRoot.querySelector('input[value="cat"]')?.getAttribute('checked')).not.toBeNull()
    expect(radio.renderRoot.querySelector('input[value="dog"]')?.getAttribute('checked')).toBeNull()

    radio.renderRoot.querySelector('input[value="dog"]')?.dispatchEvent(new MouseEvent('click'))
    await radio.updateComplete

    expect(radio.value).toBe('dog')
    expect(radio.renderRoot.querySelector('input[value="cat"]')?.getAttribute('checked')).toBeNull()
    expect(radio.renderRoot.querySelector('input[value="dog"]')?.getAttribute('checked')).not.toBeNull()

    radio.clear()
    await radio.updateComplete

    expect(radio.value).toBeUndefined()
    expect(radio.renderRoot.querySelector('input[value="cat"]')?.getAttribute('checked')).toBeNull()
    expect(radio.renderRoot.querySelector('input[value="dog"]')?.getAttribute('checked')).toBeNull()
  })

  it('does not work if disabled or readonly', async () => {
    let button: RadioButtonElement = document.createElement('q-radio-button')

    button.value = 'cat'
    radio.append(button)

    await render(radio, { disabled: 'true' })

    expect(radio.getAttribute('aria-disabled')).toBe('true')
    button.click()
    expect(radio.value).toBeUndefined()

    radio.remove()
    await render(radio, { readonly: 'true' })

    expect(radio.getAttribute('aria-readonly')).toBe('true')
    button.click()
    expect(radio.value).toBeUndefined()
  })

  it('does not work if disabled or readonly when native', async () => {
    let button: RadioButton = { value: 'cat' }

    await render(radio, { buttons: JSON.stringify([button]), disabled: 'true', native: 'true' })

    expect(radio.renderRoot.querySelector('input')?.getAttribute('disabled')).not.toBeNull()
    radio.renderRoot.querySelector('input')?.click()
    expect(radio.value).toBeUndefined()

    radio.remove()
    await render(radio, { buttons: JSON.stringify([button]), native: 'true', readonly: 'true' })

    expect(radio.renderRoot.querySelector('input')?.getAttribute('readonly')).not.toBeNull()
    radio.renderRoot.querySelector('input')?.click()
    expect(radio.value).toBeUndefined()
  })
})

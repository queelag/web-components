import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/radio-group-element'
import type {
  AracnaRadioButtonElement as RadioButtonElement,
  AracnaRadioGroupElement as RadioGroupElement
} from '../../../src/elements/input/radio-group-element'
import { render } from '../../../vitest/dom-utils'

describe('RadioGroupElement', () => {
  let radio: RadioGroupElement

  beforeEach(() => {
    radio = document.createElement('aracna-radio-group')
  })

  afterEach(() => {
    radio.remove()
  })

  it('has aria attributes', async () => {
    await render(radio)

    expect(radio.getAttribute('aria-disabled')).toBe('false')
    expect(radio.getAttribute('aria-readonly')).toBe('false')
    expect(radio.getAttribute('role')).toBe('radiogroup')
  })

  it('works with children buttons', async () => {
    let button1: RadioButtonElement, button2: RadioButtonElement

    button1 = document.createElement('aracna-radio-button')
    button1.value = 'cat'
    button2 = document.createElement('aracna-radio-button')
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

  it('does not work if disabled or readonly', async () => {
    let button: RadioButtonElement = document.createElement('aracna-radio-button')

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
    let button = { value: 'cat' }

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

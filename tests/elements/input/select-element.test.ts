import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/select-element'
import type {
  AracnaSelectButtonElement as SelectButtonElement,
  AracnaSelectElement as SelectElement,
  AracnaSelectGroupElement as SelectGroupElement,
  AracnaSelectInputElement as SelectInputElement,
  AracnaSelectListElement as SelectListElement,
  AracnaSelectOptionElement as SelectOptionElement
} from '../../../src/elements/input/select-element'
import { dispatchChangeEvent, render } from '../../../vitest/dom-utils'

describe('SelectElement', () => {
  let select: SelectElement, group: SelectGroupElement, button: SelectButtonElement, input: SelectInputElement, list: SelectListElement

  beforeEach(() => {
    select = document.createElement('aracna-select')
    group = document.createElement('aracna-select-group')
    button = document.createElement('aracna-select-button')
    input = document.createElement('aracna-select-input')
    list = document.createElement('aracna-select-list')
  })

  afterEach(() => {
    select.remove()
  })

  it('has aria attributes', async () => {
    await render(select)

    expect(select.getAttribute('aria-disabled')).toBe('false')
    expect(select.getAttribute('aria-readonly')).toBe('false')
  })

  it('works', async () => {
    let option1: SelectOptionElement, option2: SelectOptionElement

    option1 = document.createElement('aracna-select-option')
    option2 = document.createElement('aracna-select-option')

    option1.value = 'cat'
    option2.value = 'dog'

    group.append(button)
    list.append(option1, option2)
    select.append(group, list)

    await render(select)
    expect(select.value).toBeUndefined()

    option1.click()
    await option1.updateComplete
    expect(select.value).toBe(option1.value)

    option2.click()
    await option2.updateComplete
    expect(select.value).toBe(option2.value)

    select.clear()
    await select.updateComplete
    expect(select.value).toBeUndefined()
  })

  it('supports native', async () => {
    let native: HTMLSelectElement, option1: HTMLOptionElement, option2: HTMLOptionElement

    native = document.createElement('select')
    option1 = document.createElement('option')
    option2 = document.createElement('option')

    option1.value = 'cat'
    option2.value = 'dog'

    native.append(option1, option2)
    select.append(native)

    await render(select)
    expect(select.value).toBeUndefined()

    dispatchChangeEvent(native, 'cat')
    await select.updateComplete

    expect(select.value).toBe('cat')
    expect(option1.selected).toBeTruthy()
    expect(option2.selected).toBeFalsy()

    dispatchChangeEvent(native, 'dog')
    await select.updateComplete

    expect(select.value).toBe('dog')
    expect(option1.selected).toBeFalsy()
    expect(option2.selected).toBeTruthy()

    select.clear()
    await select.updateComplete

    expect(select.value).toBeUndefined()
    expect(option1.selected).toBeFalsy()
    expect(option2.selected).toBeFalsy()
  })

  it('supports multiple mode', async () => {
    let option1: SelectOptionElement, option2: SelectOptionElement

    option1 = document.createElement('aracna-select-option')
    option2 = document.createElement('aracna-select-option')

    option1.value = 'cat'
    option2.value = 'dog'

    group.append(button)
    list.append(option1, option2)
    select.append(group, list)

    await render(select, { multiple: 'true' })
    expect(select.value).toBeUndefined()

    option1.click()
    await option1.updateComplete
    expect(select.value).toStrictEqual(['cat'])

    option2.click()
    await option2.updateComplete
    expect(select.value).toStrictEqual(['cat', 'dog'])

    option1.click()
    await option1.updateComplete
    expect(select.value).toStrictEqual(['dog'])

    select.removeOption({ value: 'dog' })
    await select.updateComplete
    expect(select.value).toStrictEqual([])

    option1.click()
    await option1.updateComplete
    expect(select.value).toStrictEqual(['cat'])

    select.clear()
    await select.updateComplete
    expect(select.value).toBeUndefined()
  })
})

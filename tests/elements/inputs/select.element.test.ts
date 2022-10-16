import ResizeObserver from 'resize-observer-polyfill'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/inputs/select.element'
import type {
  SelectButtonElement,
  SelectElement,
  SelectGroupElement,
  SelectInputElement,
  SelectListElement,
  SelectOptionElement
} from '../../../src/elements/inputs/select.element'
import { dispatchChangeEvent, render } from '../../../vitest/dom.utils'

describe('SelectElement', () => {
  let select: SelectElement, group: SelectGroupElement, button: SelectButtonElement, input: SelectInputElement, list: SelectListElement

  beforeAll(() => {
    window.ResizeObserver = ResizeObserver
  })

  beforeEach(() => {
    select = document.createElement('q-select')
    group = document.createElement('q-select-group')
    button = document.createElement('q-select-button')
    input = document.createElement('q-select-input')
    list = document.createElement('q-select-list')
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

    option1 = document.createElement('q-select-option')
    option2 = document.createElement('q-select-option')

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
    await render(select, { native: 'true', options: JSON.stringify([{ value: 'cat' }, { value: 'dog' }]) })
    expect(select.value).toBeUndefined()

    dispatchChangeEvent(select.renderRoot.querySelector('select'), 'cat')
    await select.updateComplete

    expect(select.value).toBe('cat')
    expect(select.renderRoot.querySelector('option[value="cat"]')?.getAttribute('selected')).not.toBeNull()
    expect(select.renderRoot.querySelector('option[value="dog"]')?.getAttribute('selected')).toBeNull()

    dispatchChangeEvent(select.renderRoot.querySelector('select'), 'dog')
    await select.updateComplete

    expect(select.value).toBe('dog')
    expect(select.renderRoot.querySelector('option[value="cat"]')?.getAttribute('selected')).toBeNull()
    expect(select.renderRoot.querySelector('option[value="dog"]')?.getAttribute('selected')).not.toBeNull()

    select.clear()
    await select.updateComplete

    expect(select.value).toBeUndefined()
    expect(select.renderRoot.querySelector('option[value="cat"]')?.getAttribute('selected')).toBeNull()
    expect(select.renderRoot.querySelector('option[value="dog"]')?.getAttribute('selected')).toBeNull()
  })

  it('supports multiple mode', async () => {
    let option1: SelectOptionElement, option2: SelectOptionElement

    option1 = document.createElement('q-select-option')
    option2 = document.createElement('q-select-option')

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
    expect(select.value).toStrictEqual([])
  })
})

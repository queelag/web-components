import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.combo.box.element'
import type {
  AriaComboBoxButtonElement,
  AriaComboBoxElement,
  AriaComboBoxGroupElement,
  AriaComboBoxInputElement,
  AriaComboBoxListElement,
  AriaComboBoxOptionElement
} from '../../../src/elements/aria/aria.combo.box.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaComboBoxElement', () => {
  let combobox: AriaComboBoxElement,
    group: AriaComboBoxGroupElement,
    button: AriaComboBoxButtonElement,
    input: AriaComboBoxInputElement,
    ninput: HTMLInputElement,
    list: AriaComboBoxListElement,
    o1: AriaComboBoxOptionElement,
    o2: AriaComboBoxOptionElement

  beforeEach(() => {
    combobox = document.createElement('q-aria-combobox')

    group = document.createElement('q-aria-combobox-group')
    button = document.createElement('q-aria-combobox-button')
    input = document.createElement('q-aria-combobox-input')
    ninput = document.createElement('input')
    list = document.createElement('q-aria-combobox-list')
    o1 = document.createElement('q-aria-combobox-option')
    o2 = document.createElement('q-aria-combobox-option')

    input.append(ninput)
    list.append(o1, o2)
    combobox.append(group, list)
  })

  afterEach(() => {
    combobox.remove()
  })

  it('has correct aria without autocomplete', async () => {
    group.append(button)
    await render(combobox)

    expect(combobox.getAttribute('aria-disabled')).toBe('false')
    expect(combobox.getAttribute('aria-readonly')).toBe('false')

    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(button.getAttribute('aria-controls')).toBe(list.id)
    expect(button.getAttribute('aria-disabled')).toBe('false')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    //   expect(button.getAttribute('aria-labelledby')).toBe('label')
    expect(button.getAttribute('role')).toBe('combobox')
    expect(button.getAttribute('tabindex')).toBe('0')

    expect(list.getAttribute('id')).toBeDefined()
    expect(list.getAttribute('role')).toBe('listbox')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('id')).toBeDefined()
    expect(o1.getAttribute('role')).toBe('option')
  })

  it('has correct aria with autocomplete', async () => {
    group.append(button, input)
    await render(combobox, { autocomplete: 'list' })

    expect(combobox.getAttribute('aria-disabled')).toBe('false')
    expect(combobox.getAttribute('aria-readonly')).toBe('false')

    expect(button.getAttribute('aria-controls')).toBe(list.id)
    expect(button.getAttribute('aria-disabled')).toBe('false')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-label')).toBe('Previous Searches')
    expect(button.getAttribute('role')).toBe('button')
    expect(button.getAttribute('tabindex')).toBe('-1')

    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(ninput.getAttribute('aria-autocomplete')).toBe('list')
    expect(ninput.getAttribute('aria-controls')).toBe(list.id)
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('disabled')).toBeNull()
    expect(ninput.getAttribute('id')).toBeDefined()
    expect(ninput.getAttribute('readonly')).toBeNull()
    expect(ninput.getAttribute('role')).toBe('combobox')

    expect(list.getAttribute('aria-label')).toBe('Previous Searches')
    expect(list.getAttribute('id')).toBeDefined()
    expect(list.getAttribute('role')).toBe('listbox')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('id')).toBeDefined()
    expect(o1.getAttribute('role')).toBe('option')
  })

  it('works without autocomplete', async () => {
    group.append(button)
    await render(combobox)

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    button.click()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).toBeDefined()
    expect(button.getAttribute('aria-expanded')).toBe('true')

    button.click()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    button.click()
    await button.updateComplete
    o1.click()
    await o1.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).toBeDefined()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()

    button.click()
    await button.updateComplete
    o2.click()
    await o2.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('selected')).toBeDefined()
    expect(o2.getAttribute('aria-selected')).toBe('true')
  })

  it('works with autocomplete', async () => {
    group.append(button, input)
    await render(combobox, { autocomplete: 'list' })

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    ninput.click()
    await input.updateComplete

    expect(combobox.getAttribute('expanded')).toBeDefined()
    expect(button.getAttribute('aria-expanded')).toBe('true')

    o1.click()
    await o1.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).toBeDefined()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
  })
})

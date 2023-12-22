import { sleep } from '@aracna/core'
import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-combo-box-element'
import type {
  AriaComboBoxButtonElement,
  AriaComboBoxElement,
  AriaComboBoxGroupElement,
  AriaComboBoxInputElement,
  AriaComboBoxListElement,
  AriaComboBoxOptionElement
} from '../../../src/elements/aria/aria-combo-box-element'
import { dispatchInputEvent, dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

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
    combobox = document.createElement('aracna-aria-combobox')

    group = document.createElement('aracna-aria-combobox-group')
    button = document.createElement('aracna-aria-combobox-button')
    input = document.createElement('aracna-aria-combobox-input')
    ninput = document.createElement('input')
    list = document.createElement('aracna-aria-combobox-list')
    o1 = document.createElement('aracna-aria-combobox-option')
    o2 = document.createElement('aracna-aria-combobox-option')

    o1.value = 'cat'
    o2.value = 'dog'

    input.append(ninput)
    list.append(o1, o2)
    combobox.append(group, list)
  })

  afterEach(() => {
    combobox.remove()
  })

  it('has correct aria with button', async () => {
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

    expect(list.getAttribute('id')).not.toBeNull()
    expect(list.getAttribute('role')).toBe('listbox')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('id')).not.toBeNull()
    expect(o1.getAttribute('role')).toBe('option')
  })

  it('has correct aria with input', async () => {
    group.append(input)
    await render(combobox, { autocomplete: 'list' })

    expect(combobox.getAttribute('aria-disabled')).toBe('false')
    expect(combobox.getAttribute('aria-readonly')).toBe('false')

    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(ninput.getAttribute('aria-autocomplete')).toBe('list')
    expect(ninput.getAttribute('aria-controls')).toBe(list.id)
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('disabled')).toBeNull()
    expect(ninput.getAttribute('id')).not.toBeNull()
    expect(ninput.getAttribute('readonly')).toBeNull()
    expect(ninput.getAttribute('role')).toBe('combobox')

    expect(list.getAttribute('aria-label')).toBe('Previous Searches')
    expect(list.getAttribute('id')).not.toBeNull()
    expect(list.getAttribute('role')).toBe('listbox')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('id')).not.toBeNull()
    expect(o1.getAttribute('role')).toBe('option')
  })

  it('has correct aria with button and input', async () => {
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
    expect(ninput.getAttribute('id')).not.toBeNull()
    expect(ninput.getAttribute('readonly')).toBeNull()
    expect(ninput.getAttribute('role')).toBe('combobox')

    expect(list.getAttribute('aria-label')).toBe('Previous Searches')
    expect(list.getAttribute('id')).not.toBeNull()
    expect(list.getAttribute('role')).toBe('listbox')

    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('id')).not.toBeNull()
    expect(o1.getAttribute('role')).toBe('option')
  })

  it('works with button', async () => {
    group.append(button)
    await render(combobox)

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    /**
     * Click the button and expect the combobox to be expanded
     */
    button.click()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')

    /**
     * Click the button and expect the combobox to be collapsed
     */
    button.click()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    /**
     * Click the button and expect the combobox to expand, click the first option and expect the first option to be selected, the combobox should be collapsed
     */
    button.click()
    await button.updateComplete
    o1.click()
    await o1.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()

    /**
     * Click the button and expect the combobox to expand, click the second option and expect the second option to be selected, the combobox should be collapsed
     */
    button.click()
    await button.updateComplete
    o2.click()
    await o2.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')

    /**
     * Focus the button and click it, expect the combobox to be expanded
     */
    button.focus()
    button.click()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')

    /**
     * Blur the button and expect the combobox to be collapsed
     */
    button.blur()
    await button.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('works with input', async () => {
    group.append(input)
    await render(combobox, { autocomplete: 'list' })

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')

    /**
     * Click the input and expect the combobox to be expanded
     */
    ninput.click()
    await input.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')

    /**
     * Click the first option and expect the first option to be selected
     */
    o1.click()
    await o1.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()

    /**
     * Click the input and expect the combobox to be expanded, click the second option and expect the second option to be selected, the combobox should be collapsed
     */
    ninput.click()
    await input.updateComplete
    o2.click()
    await o2.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')

    /**
     * Focus the input and click it, expect the combobox to be expanded
     */
    ninput.focus()
    ninput.click()
    await input.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')

    /**
     * Blur the input and expect the combobox to be collapsed
     */
    ninput.blur()
    await input.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')

    /**
     * Type the word "cat" and expect the combobox to be expanded
     */
    dispatchInputEvent(ninput, 'cat')
    await input.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(input.value).toBe('cat')
  })

  it('supports keyboard usage with button', async () => {
    group.append(button)
    await render(combobox)

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')

    /**
     * Press ARROW_DOWN and expect the combobox to expand, every option should be blurred and unselected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ESCAPE and expect the combobox to collapse
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ESCAPE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the combobox to expand, every option should be blurred and unselected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN again and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ENTER and expect the first option to be selected and unfocused, the combobox should be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ENTER)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the combobox to expand, the first option should be focused and selected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP again and nothing happens since there is no infinite focus
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN and expect the next option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN again and nothing happens since there is no infinite focus
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press SPACE and expect the second option to be selected and unfocused, the combobox should be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.SPACE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ENTER and expect the combobox to be expanded, the second option should be focused and selected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ENTER)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press HOME and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.HOME)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press END and expect the last option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.END)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ESCAPE and expect the combobox to be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ESCAPE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Type "c" and expect the first option to be focused, the combobox should be expanded
     */
    dispatchKeyDownEvent(combobox, 'c')
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Sleep for 100ms to let the typeahed value reset, type "dog" and expect the second option to be focused
     */
    await sleep(100)
    dispatchKeyDownEvent(combobox, 'd')
    dispatchKeyDownEvent(combobox, 'o')
    dispatchKeyDownEvent(combobox, 'g')
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()
  })

  it('supports keyboard usage with input', async () => {
    group.append(input)
    await render(combobox)

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')

    /**
     * Press ARROW_DOWN and expect the combobox to expand, the first option should be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ESCAPE and expect the combobox to collapse
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ESCAPE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the combobox to expand, the last option should be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_DOWN and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ARROW_UP and expect the second option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ENTER and expect the second option to be selected and unfocused, the combobox should be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ENTER)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ARROW_DOWN and expect the combobox to expand, the second option should be focused and selected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ARROW_DOWN again and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_DOWN)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ESCAPE and expect the combobox to collapse
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ESCAPE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ARROW_UP and expect the combobox to expand, the second option should be focused and selected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ARROW_UP again and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ARROW_UP)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBeNull()
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).toBeNull()
    expect(o2.getAttribute('aria-selected')).toBe('true')
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).not.toBeNull()

    /**
     * Press ENTER and expect the second option to be selected and unfocused, the combobox should be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ENTER)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ENTER again and expect the combobox to expand, the first option should be focused and selected
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ENTER)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press END and expect the last option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.END)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o2.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).not.toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press HOME and expect the first option to be focused
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.HOME)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).not.toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('true')
    expect(ninput.getAttribute('aria-activedescendant')).toBe(o1.id)
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).not.toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Press ESCAPE and expect the combobox to be collapsed
     */
    dispatchKeyDownEvent(combobox, KeyboardEventKey.ESCAPE)
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()

    /**
     * Type "d" and nothing happens since typeahead is disabled when there is an input
     */
    dispatchKeyDownEvent(combobox, 'd')
    await combobox.updateComplete

    expect(combobox.getAttribute('expanded')).toBeNull()
    expect(ninput.getAttribute('aria-expanded')).toBe('false')
    expect(ninput.getAttribute('aria-activedescendant')).toBeNull()
    expect(o1.getAttribute('aria-selected')).toBe('true')
    expect(o1.getAttribute('focused')).toBeNull()
    expect(o1.getAttribute('selected')).not.toBeNull()
    expect(o2.getAttribute('aria-selected')).toBeNull()
    expect(o2.getAttribute('focused')).toBeNull()
    expect(o2.getAttribute('selected')).toBeNull()
  })
})

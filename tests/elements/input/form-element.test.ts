import { sleep } from '@aracna/core'
import { FormSubmitEvent } from '@aracna/web'
import { size, string } from 'superstruct'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../../../src/elements/input/button-element'
import { ButtonElement } from '../../../src/elements/input/button-element'
import '../../../src/elements/input/check-box-element'
import { CheckBoxElement } from '../../../src/elements/input/check-box-element'
import '../../../src/elements/input/form-element'
import { FormElement } from '../../../src/elements/input/form-element'
import '../../../src/elements/input/input-element'
import { InputElement } from '../../../src/elements/input/input-element'
import '../../../src/elements/input/input-file-element'
import { InputFileElement } from '../../../src/elements/input/input-file-element'
import '../../../src/elements/input/radio-group-element'
import { RadioGroupElement } from '../../../src/elements/input/radio-group-element'
import '../../../src/elements/input/select-element'
import { SelectElement } from '../../../src/elements/input/select-element'
import '../../../src/elements/input/slider-element'
import { SliderElement } from '../../../src/elements/input/slider-element'
import '../../../src/elements/input/switch-element'
import { SwitchElement } from '../../../src/elements/input/switch-element'
import '../../../src/elements/input/text-area-element'
import { TextAreaElement } from '../../../src/elements/input/text-area-element'
import { dispatchClickEvent, dispatchSubmitEvent, render } from '../../../vitest/dom-utils'

describe('FormElement', () => {
  let form: FormElement, onSubmit: Mock

  beforeEach(() => {
    form = document.createElement('aracna-form')
    onSubmit = vi.fn()
  })

  afterEach(() => {
    form.remove()
  })

  it('has novalidate', async () => {
    await render(form)
    expect(form.shadowRoot?.querySelector('form')?.getAttribute('novalidate')).toBeDefined()
  })

  it('submits', async () => {
    await render(form, {}, { 'form-submit': onSubmit })

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('submits asynchronously', async () => {
    onSubmit = vi.fn(async (event: FormSubmitEvent) => {
      await sleep(100)
      event.detail?.finalize()
    })

    await render(form, { async: 'true' }, { 'form-submit': onSubmit })

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))

    expect(onSubmit).toBeCalledTimes(1)
    expect(form.getAttribute('disabled')).toBeDefined()
    expect(form.getAttribute('spinning')).toBeDefined()

    await sleep(200)

    expect(form.getAttribute('disabled')).toBeNull()
    expect(form.getAttribute('spinning')).toBeNull()
  })

  it('does not submit if the form is disabled', async () => {
    await render(form, { disabled: 'true' }, { 'form-submit': onSubmit })

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))
    expect(onSubmit).toBeCalledTimes(0)
  })

  it('finds all children fields', async () => {
    let checkbox: CheckBoxElement,
      input: InputElement,
      inputfile: InputFileElement,
      radiogroup: RadioGroupElement,
      select: SelectElement,
      slider: SliderElement,
      switche: SwitchElement,
      textarea: TextAreaElement

    checkbox = document.createElement('aracna-checkbox')
    input = document.createElement('aracna-input')
    inputfile = document.createElement('aracna-input-file')
    radiogroup = document.createElement('aracna-radio-group')
    select = document.createElement('aracna-select')
    slider = document.createElement('aracna-slider')
    switche = document.createElement('aracna-switch')
    textarea = document.createElement('aracna-textarea')

    form.append(checkbox, input, inputfile, radiogroup, select, slider, switche, textarea)
    await render(form, {}, { 'form-submit': onSubmit })

    expect(form.fieldElements).toHaveLength(8)

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('does not submit if one of the fields is not valid', async () => {
    let input: InputElement = document.createElement('aracna-input')

    input.schema = size(string(), 1, 1)
    form.append(input)

    await render(form, {}, { 'form-submit': onSubmit })

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))
    expect(onSubmit).toBeCalledTimes(0)

    input.value = 'a'

    dispatchSubmitEvent(form.renderRoot.querySelector('form'))
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('works with a child button of type submit', async () => {
    let button: ButtonElement = document.createElement('aracna-button')

    button.type = 'submit'
    form.append(button)

    await render(form, {}, { 'form-submit': onSubmit })
    await sleep(100)

    dispatchClickEvent(button)
    expect(onSubmit).toBeCalledTimes(1)
  })
})

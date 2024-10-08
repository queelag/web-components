import { sleep } from '@aracna/core'
import { size, string } from 'superstruct'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../../../src/elements/input/button-element'
import { AracnaButtonElement as ButtonElement } from '../../../src/elements/input/button-element'
import '../../../src/elements/input/check-box-element'
import { AracnaCheckBoxElement as CheckBoxElement } from '../../../src/elements/input/check-box-element'
import '../../../src/elements/input/form-element'
import { AracnaFormElement as FormElement } from '../../../src/elements/input/form-element'
import '../../../src/elements/input/input-element'
import { AracnaInputElement as InputElement } from '../../../src/elements/input/input-element'
import '../../../src/elements/input/input-file-element'
import { AracnaInputFileElement as InputFileElement } from '../../../src/elements/input/input-file-element'
import '../../../src/elements/input/radio-group-element'
import { AracnaRadioGroupElement as RadioGroupElement } from '../../../src/elements/input/radio-group-element'
import '../../../src/elements/input/select-element'
import { AracnaSelectElement as SelectElement } from '../../../src/elements/input/select-element'
import '../../../src/elements/input/slider-element'
import { AracnaSliderElement as SliderElement } from '../../../src/elements/input/slider-element'
import '../../../src/elements/input/switch-element'
import { AracnaSwitchElement as SwitchElement } from '../../../src/elements/input/switch-element'
import '../../../src/elements/input/text-area-element'
import { AracnaTextAreaElement as TextAreaElement } from '../../../src/elements/input/text-area-element'
import { FormSubmitEvent } from '../../../src/events/form-submit-event'
import { dispatchClickEvent, dispatchSubmitEvent, render } from '../../../vitest/dom-utils'

describe('FormElement', () => {
  let form: FormElement, native: HTMLFormElement, onSubmit: Mock

  beforeEach(() => {
    form = document.createElement('aracna-form')
    native = document.createElement('form')

    form.append(native)

    onSubmit = vi.fn()
  })

  afterEach(() => {
    form.remove()
  })

  it('has novalidate', async () => {
    await render(form)
    expect(native.noValidate).toBeTruthy()
  })

  it('submits', async () => {
    await render(form, {}, { 'form-submit': onSubmit })

    dispatchSubmitEvent(native)
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('submits asynchronously', async () => {
    onSubmit = vi.fn(async (event: FormSubmitEvent) => {
      await sleep(100)
      event.detail?.finalize()
    })

    await render(form, { async: 'true' }, { 'form-submit': onSubmit })

    dispatchSubmitEvent(native)

    expect(onSubmit).toBeCalledTimes(1)
    expect(form.getAttribute('disabled')).toBeDefined()
    expect(form.getAttribute('spinning')).toBeDefined()

    await sleep(200)

    expect(form.getAttribute('disabled')).toBeNull()
    expect(form.getAttribute('spinning')).toBeNull()
  })

  it('does not submit if the form is disabled', async () => {
    await render(form, { disabled: 'true' }, { 'form-submit': onSubmit })

    dispatchSubmitEvent(native)
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

    dispatchSubmitEvent(native)
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('does not submit if one of the fields is not valid', async () => {
    let input: InputElement = document.createElement('aracna-input')

    input.schema = size(string(), 1, 1)
    form.append(input)

    await render(form, {}, { 'form-submit': onSubmit })

    dispatchSubmitEvent(native)
    expect(onSubmit).toBeCalledTimes(0)

    input.value = 'a'

    dispatchSubmitEvent(native)
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

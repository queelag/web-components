import { sleep } from '@queelag/core'
import { FormSubmitEvent } from '@queelag/web'
import { size, string } from 'superstruct'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/input/check.box.element'
import { CheckBoxElement } from '../../../src/elements/input/check.box.element'
import '../../../src/elements/input/form.element'
import { FormElement } from '../../../src/elements/input/form.element'
import '../../../src/elements/input/input.element'
import { InputElement } from '../../../src/elements/input/input.element'
import '../../../src/elements/input/input.file.element'
import { InputFileElement } from '../../../src/elements/input/input.file.element'
import '../../../src/elements/input/radio.group.element'
import { RadioGroupElement } from '../../../src/elements/input/radio.group.element'
import '../../../src/elements/input/select.element'
import { SelectElement } from '../../../src/elements/input/select.element'
import '../../../src/elements/input/slider.element'
import { SliderElement } from '../../../src/elements/input/slider.element'
import '../../../src/elements/input/switch.element'
import { SwitchElement } from '../../../src/elements/input/switch.element'
import '../../../src/elements/input/text.area.element'
import { TextAreaElement } from '../../../src/elements/input/text.area.element'
import { render } from '../../../vitest/dom.utils'

describe('FormElement', () => {
  let form: FormElement,
    onSubmit: Mock = vi.fn()

  beforeEach(() => {
    form = document.createElement('q-form')
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

    form.renderRoot.querySelector('form')?.submit()
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('submits asynchronously', async () => {
    onSubmit = vi.fn(async (event: FormSubmitEvent) => {
      await sleep(100)
      event.detail?.finalize()
    })

    await render(form, { async: 'true' }, { 'form-submit': onSubmit })

    form.renderRoot.querySelector('form')?.submit()

    expect(onSubmit).toBeCalledTimes(1)
    expect(form.getAttribute('disabled')).toBeDefined()
    expect(form.getAttribute('spinning')).toBeDefined()

    await sleep(200)

    expect(form.getAttribute('disabled')).toBeNull()
    expect(form.getAttribute('spinning')).toBeNull()
  })

  it('does not submit if the form is disabled', async () => {
    await render(form, { disabled: 'true' }, { 'form-submit': onSubmit })

    form.renderRoot.querySelector('form')?.submit()
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

    checkbox = document.createElement('q-checkbox')
    input = document.createElement('q-input')
    inputfile = document.createElement('q-input-file')
    radiogroup = document.createElement('q-radio-group')
    select = document.createElement('q-select')
    slider = document.createElement('q-slider')
    switche = document.createElement('q-switch')
    textarea = document.createElement('q-textarea')

    form.append(checkbox, input, inputfile, radiogroup, select, slider, switche, textarea)
    await render(form, {}, { 'form-submit': onSubmit })

    expect(form.checkBoxElements).toHaveLength(1)
    expect(form.inputElements).toHaveLength(1)
    expect(form.inputFileElements).toHaveLength(1)
    expect(form.radioGroupElements).toHaveLength(1)
    expect(form.selectElements).toHaveLength(1)
    expect(form.sliderElements).toHaveLength(1)
    expect(form.switchElements).toHaveLength(1)
    expect(form.textAreaElements).toHaveLength(1)

    form.renderRoot.querySelector('form')?.submit()
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('does not submit if one of the fields is not valid', async () => {
    let input: InputElement = document.createElement('q-input')

    input.schema = size(string(), 1, 1)
    form.append(input)

    await render(form, {}, { 'form-submit': onSubmit })

    form.renderRoot.querySelector('form')?.submit()
    expect(onSubmit).toBeCalledTimes(0)

    input.value = 'a'

    form.renderRoot.querySelector('form')?.submit()
    expect(onSubmit).toBeCalledTimes(1)
  })
})

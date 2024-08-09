import { defineCustomElement } from '@aracna/web'
import { number } from 'superstruct'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FormControlElementCollector } from '../../../src/collectors/form-control-element-collector'
import '../../../src/elements/core/form-control-element'
import { AracnaFormControlElement as FormControlElement } from '../../../src/elements/core/form-control-element'
import { render } from '../../../vitest/dom-utils'

class TestElement extends FormControlElement {}
defineCustomElement('aracna-test', TestElement)

describe('FormControlElement', () => {
  let test: TestElement

  beforeEach(() => {
    test = document.createElement('aracna-test') as any
  })

  afterEach(() => {
    test.remove()
  })

  it('is collected', async () => {
    test.path = 'path'
    test.target = {}

    await render(test)
    expect(FormControlElementCollector.get(test.target, test.path)).toBe(test)

    test.remove()
    expect(FormControlElementCollector.get(test.target, test.path)).toBeUndefined()
  })

  it('is touchable', async () => {
    await render(test)
    expect(test.touched).toBeFalsy()

    test.touch()
    expect(test.touched).toBeTruthy()
  })

  it('supports schema validation', async () => {
    test.schema = number()
    await render(test)

    expect(test.validation).toBeUndefined()
    test.validate()
    expect(test.error).toBeDefined()

    test.value = 0
    expect(test.error).toBeUndefined()
  })

  it('is clearable', async () => {
    await render(test, { value: 'hello' })
    expect(test.value).toBe('hello')

    test.clear()
    expect(test.value).toBeUndefined()
  })

  it('supports reflection of value changes to a target object', async () => {
    test.path = 'path'
    test.target = {}

    await render(test)
    expect(test.value).toBeUndefined()

    test.value = 'hello'
    expect(test.target[test.path]).toBe('hello')
  })
})

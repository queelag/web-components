import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ElementCollector, FormControlElementCollector } from '../../src'
import { AracnaFormControlElement as FormControlElement } from '../../src/elements/core/form-control-element'

const TARGET: object = {}

class TestElement extends FormControlElement {}

customElements.define('test-element', TestElement)

describe('FormControlElementCollector', () => {
  let element: FormControlElement

  beforeAll(() => {
    element = new TestElement()

    element.id = 'id'
    element.path = 'path'
    element.target = TARGET
    element.uid = 'uid'
  })

  beforeEach(() => {
    ElementCollector.delete(element)
    FormControlElementCollector.delete(element)
  })

  it('gets', () => {
    expect(FormControlElementCollector.get('id')).toBeUndefined()
    expect(FormControlElementCollector.get('uid')).toBeUndefined()
    expect(FormControlElementCollector.get(TARGET, 'path')).toBeUndefined()
    FormControlElementCollector.set(element)
    expect(FormControlElementCollector.get('id')).toBe(element)
    expect(FormControlElementCollector.get('uid')).toBe(element)
    expect(FormControlElementCollector.get(TARGET, 'path')).toBe(element)
  })

  it('sets', () => {
    FormControlElementCollector.set(element)
    expect(FormControlElementCollector.get('id')).toBe(element)
    expect(FormControlElementCollector.get('uid')).toBe(element)
    expect(FormControlElementCollector.get(TARGET, 'path')).toBe(element)
  })

  it('deletes', () => {
    FormControlElementCollector.set(element)
    expect(FormControlElementCollector.get('id')).toBe(element)
    expect(FormControlElementCollector.get('uid')).toBe(element)
    expect(FormControlElementCollector.get(TARGET, 'path')).toBe(element)
    FormControlElementCollector.delete(element)
    expect(FormControlElementCollector.get('id')).toBeUndefined()
    expect(FormControlElementCollector.get('uid')).toBeUndefined()
    expect(FormControlElementCollector.get(TARGET, 'path')).toBeUndefined()
  })
})

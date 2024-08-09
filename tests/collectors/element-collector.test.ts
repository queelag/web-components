import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ElementCollector } from '../../src'
import { AracnaBaseElement as BaseElement } from '../../src/elements/core/base-element'

class TestElement extends BaseElement {}

customElements.define('test-element', TestElement)

describe('ElementCollector', () => {
  let element: BaseElement

  beforeAll(() => {
    element = new TestElement()

    element.id = 'id'
    element.uid = 'uid'
  })

  beforeEach(() => {
    ElementCollector.delete(element)
  })

  it('gets', () => {
    expect(ElementCollector.get('id')).toBeUndefined()
    expect(ElementCollector.get('uid')).toBeUndefined()
    ElementCollector.set(element)
    expect(ElementCollector.get('id')).toBe(element)
    expect(ElementCollector.get('uid')).toBe(element)
  })

  it('sets', () => {
    ElementCollector.set(element)
    expect(ElementCollector.get('id')).toBe(element)
    expect(ElementCollector.get('uid')).toBe(element)
  })

  it('deletes', () => {
    ElementCollector.set(element)
    expect(ElementCollector.get('id')).toBe(element)
    expect(ElementCollector.get('uid')).toBe(element)
    ElementCollector.delete(element)
    expect(ElementCollector.get('id')).toBeUndefined()
    expect(ElementCollector.get('uid')).toBeUndefined()
  })
})

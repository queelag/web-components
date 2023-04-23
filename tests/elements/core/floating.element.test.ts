import { defineCustomElement } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/core/floating.element'
import { FloatingElement } from '../../../src/elements/core/floating.element'
import { render } from '../../../vitest/dom.utils'

class TestElement extends FloatingElement {}
defineCustomElement('aracna-test', TestElement)

describe('FloatingElement', () => {
  let test: TestElement

  beforeEach(() => {
    test = document.createElement('aracna-test') as any
  })

  afterEach(() => {
    test.remove()
  })

  it('renders', async () => {
    await render(test)
    expect(test.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

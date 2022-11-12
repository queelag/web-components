import { defineCustomElement } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/core/focus.trap.element'
import { FocusTrapElement } from '../../../src/elements/core/focus.trap.element'
import { render } from '../../../vitest/dom.utils'

class TestElement extends FocusTrapElement {}
defineCustomElement('q-test', TestElement)

describe('FocusTrapElement', () => {
  let test: TestElement

  beforeEach(() => {
    test = document.createElement('q-test') as any
  })

  afterEach(() => {
    test.remove()
  })

  it('renders', async () => {
    await render(test)
    expect(test.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

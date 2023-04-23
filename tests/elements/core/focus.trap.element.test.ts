import { defineCustomElement } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/core/focus.trap.element'
import { FocusTrapElement } from '../../../src/elements/core/focus.trap.element'
import { render } from '../../../vitest/dom.utils'

class TestElement extends FocusTrapElement {}
defineCustomElement('aracna-test', TestElement)

describe('FocusTrapElement', () => {
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

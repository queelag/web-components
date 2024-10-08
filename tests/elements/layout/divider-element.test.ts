import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/layout/divider-element'
import type { AracnaDividerElement as DividerElement } from '../../../src/elements/layout/divider-element'
import { render } from '../../../vitest/dom-utils'

describe('DividerElement', () => {
  let divider: DividerElement

  beforeEach(() => {
    divider = document.createElement('aracna-divider')
    divider.innerHTML = '<div slot="horizontal">horizontal</div><div slot="vertical">vertical</div><div>default</div>'
  })

  afterEach(() => {
    divider.remove()
  })

  it('renders different slots based on orientation', async () => {
    await render(divider)
    expect(
      divider.shadowRoot
        ?.querySelector('slot')
        ?.assignedElements()
        .find((element: Element) => element.matches('div'))?.textContent
    ).toBe('default')

    await render(divider, { orientation: 'horizontal' })
    expect(
      divider.shadowRoot
        ?.querySelector('slot')
        ?.assignedElements()
        .find((element: Element) => element.matches('div'))?.textContent
    ).toBe('horizontal')

    await render(divider, { orientation: 'vertical' })
    expect(
      divider.shadowRoot
        ?.querySelector('slot')
        ?.assignedElements()
        .find((element: Element) => element.matches('div'))?.textContent
    ).toBe('vertical')
  })
})

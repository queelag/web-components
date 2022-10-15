import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../src/elements/navigation.bar.element'
import type { NavigationBarElement } from '../../src/elements/navigation.bar.element'
import { render } from '../../vitest/dom.utils'

describe('NavigationBarElement', () => {
  let bar: NavigationBarElement

  beforeEach(() => {
    bar = document.createElement('q-navigation-bar')
  })

  afterEach(() => {
    bar.remove()
  })

  it('renders', async () => {
    await render(bar)
    expect(bar.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../src/elements/navigation.rail.element'
import type { NavigationRailElement } from '../../src/elements/navigation.rail.element'
import { render } from '../../vitest/utils'

describe('NavigationRailElement', () => {
  let rail: NavigationRailElement

  beforeEach(() => {
    rail = document.createElement('q-navigation-rail')
  })

  afterEach(() => {
    rail.remove()
  })

  it('renders', async () => {
    await render(rail)
    expect(rail.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

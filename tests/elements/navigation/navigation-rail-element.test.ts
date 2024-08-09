import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/navigation/navigation-rail-element'
import type { AracnaNavigationRailElement as NavigationRailElement } from '../../../src/elements/navigation/navigation-rail-element'
import { render } from '../../../vitest/dom-utils'

describe('NavigationRailElement', () => {
  let rail: NavigationRailElement

  beforeEach(() => {
    rail = document.createElement('aracna-navigation-rail')
  })

  afterEach(() => {
    rail.remove()
  })

  it('renders', async () => {
    await render(rail)
    expect(rail.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

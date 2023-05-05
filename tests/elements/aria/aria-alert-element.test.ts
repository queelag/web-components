import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-alert-element'
import type { AriaAlertElement } from '../../../src/elements/aria/aria-alert-element'
import { render } from '../../../vitest/dom-utils'

describe('AriaAlertElement', () => {
  let alert: AriaAlertElement

  beforeEach(() => {
    alert = document.createElement('aracna-aria-alert')
  })

  afterEach(() => {
    alert.remove()
  })

  it('has correct aria', async () => {
    await render(alert)

    expect(alert.getAttribute('role')).toBe('alert')
  })
})

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-heading-element'
import type { AracnaAriaHeadingElement as AriaHeadingElement } from '../../../src/elements/aria/aria-heading-element'
import { render } from '../../../vitest/dom-utils'

describe('AriaHeadingElement', () => {
  let heading: AriaHeadingElement

  beforeEach(() => {
    heading = document.createElement('aracna-aria-heading')
  })

  afterEach(() => {
    heading.remove()
  })

  it('has correct aria', async () => {
    await render(heading)

    expect(heading.getAttribute('aria-level')).toBe('1')
    expect(heading.getAttribute('role')).toBe('heading')
  })

  it('has correct aria with all levels', async () => {
    for (let i = 1; i <= 6; i++) {
      heading.remove()
      await render(heading, { level: i.toString() })

      expect(heading.getAttribute('aria-level')).toBe(i.toString())
      expect(heading.getAttribute('role')).toBe('heading')
    }
  })
})

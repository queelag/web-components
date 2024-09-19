import { Localization } from '@aracna/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/typography/heading-element'
import type { AracnaHeadingElement as HeadingElement } from '../../../src/elements/typography/heading-element'
import { render } from '../../../vitest/dom-utils'

describe('HeadingElement', () => {
  let heading: HeadingElement, localization: Localization

  beforeEach(() => {
    heading = document.createElement('aracna-heading')
    localization = new Localization({ language: 'en', packs: [{ data: { html: 'Hello <b>{name}</b>', text: 'Hello {name}' }, language: 'en' }] })
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

  it('renders slot text', async () => {
    heading.append('Hello John')

    await render(heading)

    expect(heading.textContent).toBe('Hello John')
  })

  it('renders localization text', async () => {
    heading.localization = localization
    heading.path = 'text'
    heading.variables = { name: 'John' }

    await render(heading)

    expect(heading.shadowRoot?.textContent).include('Hello John')
  })

  it('renders localization text with html', async () => {
    heading.localization = localization
    heading.path = 'html'
    heading.variables = { name: 'John' }

    await render(heading)

    expect(heading.shadowRoot?.innerHTML).include('Hello <b part="b">John</b>')
    expect(heading.shadowRoot?.querySelector('b')?.textContent).toBe('John')
  })
})

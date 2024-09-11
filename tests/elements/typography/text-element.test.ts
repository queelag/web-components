import { Localization } from '@aracna/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/typography/text-element'
import type { AracnaTextElement as TextElement } from '../../../src/elements/typography/text-element'
import { render } from '../../../vitest/dom-utils'

describe('TextElement', () => {
  let text: TextElement, localization: Localization

  beforeEach(() => {
    text = document.createElement('aracna-text')
    localization = new Localization({ language: 'en', packs: [{ data: { html: 'Hello <b>{name}</b>', text: 'Hello {name}' }, language: 'en' }] })
  })

  afterEach(() => {
    text.remove()
  })

  it('renders slot text', async () => {
    text.append('Hello John')

    await render(text)

    expect(text.textContent).toBe('Hello John')
  })

  it('renders localization text', async () => {
    text.localization = localization
    text.path = 'text'
    text.variables = { name: 'John' }

    await render(text)

    expect(text.shadowRoot?.textContent).include('Hello John')
  })

  it('renders localization text with html', async () => {
    text.localization = localization
    text.path = 'html'
    text.variables = { name: 'John' }

    await render(text)

    expect(text.shadowRoot?.innerHTML).include('Hello <b>John</b>')
    expect(text.shadowRoot?.querySelector('b')?.textContent).toBe('John')
  })
})

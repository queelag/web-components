import { importNodeFetch, useNodeFetch, wf } from '@aracna/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SVG_NAMESPACE_URI } from '../../../src/definitions/constants'
import '../../../src/elements/data/icon-element'
import type { AracnaIconElement as IconElement } from '../../../src/elements/data/icon-element'
import { render } from '../../../vitest/dom-utils'

const COMPASS_SRC: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
const MALICIOUS_SRC: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/><script>window.alert('bad')</script></svg>`

describe('IconElement', () => {
  let icon: IconElement

  beforeEach(() => {
    icon = document.createElement('aracna-icon')
  })

  afterEach(() => {
    icon.remove()
  })

  it('has correct attributes', async () => {
    await render(icon)

    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('fill')).toBeNull()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('stroke')).toBeNull()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('stroke-width')).toBeNull()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('style')).toBe('')
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('viewBox')).toBeNull()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('xmlns')).toBe(SVG_NAMESPACE_URI)
  })

  it('renders from svg string', async () => {
    await render(icon, { src: COMPASS_SRC })

    expect(icon.shadowRoot?.querySelector('circle')).toBeDefined()
    expect(icon.shadowRoot?.querySelector('polygon')).toBeDefined()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  it('renders from url', async () => {
    await useNodeFetch(await importNodeFetch())

    await render(icon, { src: 'https://raw.githubusercontent.com/feathericons/feather/master/icons/compass.svg' })
    await wf(() => icon.shadowRoot?.querySelector('circle'))

    expect(icon.shadowRoot?.querySelector('circle')).toBeDefined()
    expect(icon.shadowRoot?.querySelector('polygon')).toBeDefined()
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  it('respects the fill, stroke and stroke-width attributes', async () => {
    await render(icon, { fill: 'white', stroke: 'black', 'stroke-width': '1' })

    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('fill')).toBe('white')
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('stroke')).toBe('black')
    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('stroke-width')).toBe('1')
  })

  it('respects the size attribute', async () => {
    await render(icon, { size: '24' })

    expect(icon.shadowRoot?.querySelector('svg')?.getAttribute('style')).toBe(
      'height:24px;max-height:24px;max-width:24px;min-height:24px;min-width:24px;width:24px;'
    )
  })

  it('sanitizes', async () => {
    await render(icon, { src: MALICIOUS_SRC })
    expect(icon.shadowRoot?.querySelector('script')).toBeDefined()
    await render(icon, { sanitize: 'true', src: MALICIOUS_SRC })
    expect(icon.shadowRoot?.querySelector('script')).toBeNull()
  })
})

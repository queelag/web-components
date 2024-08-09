import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/data/image-element'
import type { AracnaImageElement as ImageElement } from '../../../src/elements/data/image-element'
import { render } from '../../../vitest/dom-utils'

describe('ImageElement', () => {
  let image: ImageElement

  beforeEach(() => {
    image = document.createElement('aracna-image')
  })

  afterEach(() => {
    image.remove()
  })

  it('renders', async () => {
    await render(image)
    expect(image.shadowRoot?.querySelector('img')).toBeDefined()
  })
})

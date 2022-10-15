import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../src/elements/image.element'
import type { ImageElement } from '../../src/elements/image.element'
import { render } from '../../vitest/utils'

describe('ImageElement', () => {
  let image: ImageElement

  beforeEach(() => {
    image = document.createElement('q-image')
  })

  afterEach(() => {
    image.remove()
  })

  it('renders', async () => {
    await render(image)
    expect(image.shadowRoot?.querySelector('img')).toBeDefined()
  })
})

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/data/avatar-element'
import type { AvatarElement } from '../../../src/elements/data/avatar-element'
import { render } from '../../../vitest/dom-utils'

describe('AvatarElement', () => {
  let avatar: AvatarElement

  beforeEach(() => {
    avatar = document.createElement('aracna-avatar')
  })

  afterEach(() => {
    avatar.remove()
  })

  it('renders', async () => {
    await render(avatar)
    expect(avatar.shadowRoot?.querySelector('div')).toBeDefined()
  })
})

import { expect, fixture, html } from '@open-wc/testing'
import { IconElement } from '../../src/elements/icon.element'

const COMPASS_SRC: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`

describe('IconElement', () => {
  let icon: IconElement

  beforeEach(async () => {
    icon = await fixture(html`<q-icon src=${COMPASS_SRC} />`)
  })

  it('renders', () => {
    expect(icon).to.have.attribute('src', COMPASS_SRC)
    expect(icon).to.have.descendant('circle')
    expect(icon).to.have.descendant('polygon')
  })
})

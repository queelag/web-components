import { defineCustomElement, ElementCollector, QueryDeclarations } from '@aracna/web'
import { html } from 'lit-html'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/core/base-element'
import { BaseElement } from '../../../src/elements/core/base-element'
import { getSquircleHTML } from '../../../src/utils/squircle-utils'
import { render } from '../../../vitest/dom-utils'

class TestElement extends BaseElement {
  body: HTMLBodyElement
  div: HTMLDivElement
  lis: HTMLLIElement[]
  ol: HTMLOListElement

  render(): unknown {
    return html`<div></div>`
  }

  static queries: QueryDeclarations = {
    body: { selector: 'body', closest: true },
    div: { selector: 'div', shadow: true },
    lis: { selector: 'li', all: true },
    ol: { selector: 'ol' }
  }
}

defineCustomElement('aracna-test', TestElement)

describe('BaseElement', () => {
  let test: TestElement

  beforeEach(() => {
    test = document.createElement('aracna-test') as any
  })

  afterEach(() => {
    test.remove()
  })

  it('is collected', async () => {
    await render(test)
    expect(ElementCollector.get(test.uid)).toBe(test)

    test.remove()
    expect(ElementCollector.get(test.uid)).toBeUndefined()
  })

  it('defines queries', async () => {
    let lis: HTMLLIElement[], ol: HTMLOListElement

    lis = [document.createElement('li'), document.createElement('li')]
    ol = document.createElement('ol')

    ol.append(...lis)
    test.append(ol)

    await render(test)

    expect(test.body).toBe(document.body)
    expect(test.div).toBeInstanceOf(HTMLDivElement)
    expect(test.lis).toStrictEqual(lis)
    expect(test.ol).toBe(ol)
  })

  it('dispatches an attribute-change event on property changes', async () => {
    let listener: Mock = vi.fn()

    test.addEventListener('attribute-change', listener)
    await render(test)

    test.background = 'black'
    await test.updateComplete
    expect(listener).toBeCalledTimes(1)
  })

  it('generates the correct shape styles', async () => {
    await render(test, { shape: 'circle' })

    expect(test.shapeHTML).toBeUndefined()
    expect(test.shapeStyleInfo).toStrictEqual({ borderRadius: '9999px' })

    test.shape = 'rectangle'
    await test.updateComplete

    expect(test.shapeHTML).toBeUndefined()
    expect(test.shapeStyleInfo).toStrictEqual({ borderRadius: undefined })

    test.shapeRectangleRadius = 5
    await test.updateComplete
    expect(test.shapeStyleInfo).toStrictEqual({ borderRadius: '5px' })

    test.shape = 'square'
    await test.updateComplete

    expect(test.shapeHTML).toBeUndefined()
    expect(test.shapeStyleInfo).toStrictEqual({ borderRadius: undefined })

    test.shapeSquareRadius = 5
    await test.updateComplete
    expect(test.shapeStyleInfo).toStrictEqual({ borderRadius: '5px' })

    test.shape = 'squircle'
    await test.updateComplete

    expect(test.shapeHTML).toStrictEqual(getSquircleHTML('squircle-clip-path', 0))
    expect(test.shapeStyleInfo).toStrictEqual({ clipPath: `url(#squircle-clip-path)` })

    test.shapeSquircleCurvature = 0.5
    test.shapeSquircleSize = 24

    expect(test.shapeHTML).toStrictEqual(getSquircleHTML('squircle-clip-path', 24, 0.5))
    expect(test.shapeStyleInfo).toStrictEqual({ clipPath: `url(#squircle-clip-path)` })
  })

  it('generates the correct size styles', async () => {
    await render(test)
    expect(test.sizeStyleInfo).toStrictEqual({ height: undefined, width: undefined })

    test.size = 24
    await test.updateComplete
    expect(test.sizeStyleInfo).toStrictEqual({ height: '24px', width: '24px' })

    test.height = '32px'
    await test.updateComplete
    expect(test.sizeStyleInfo).toStrictEqual({ height: '32px', width: '24px' })

    test.width = '32px'
    await test.updateComplete
    expect(test.sizeStyleInfo).toStrictEqual({ height: '32px', width: '32px' })
  })
})

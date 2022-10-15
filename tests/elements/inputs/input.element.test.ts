import { TextCodec } from '@queelag/core'
import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/inputs/input.element'
import type { InputElement } from '../../../src/elements/inputs/input.element'
import { dispatchInputEvent, dispatchKeyUpEvent, render } from '../../../vitest/utils'

describe('InputElement', () => {
  let input: InputElement

  beforeEach(() => {
    input = document.createElement('q-input')
  })

  afterEach(() => {
    input.remove()
  })

  it('has correct attributes', async () => {
    await render(input)

    expect(input.renderRoot.querySelector('input')?.getAttribute('autofocus')).toBeNull()
    expect(input.renderRoot.querySelector('input')?.getAttribute('disabled')).toBeNull()
    expect(input.renderRoot.querySelector('input')?.getAttribute('placeholder')).toBeNull()
    expect(input.renderRoot.querySelector('input')?.getAttribute('readonly')).toBeNull()
    expect(input.renderRoot.querySelector('input')?.getAttribute('style')).toBe('')
    expect(input.renderRoot.querySelector('input')?.getAttribute('type')).toBe('text')
    expect(input.renderRoot.querySelector('input')?.value).toBe('')
  })

  it('handles blur and focus', async () => {
    await render(input)
    expect(input.focused).toBeFalsy()

    input.renderRoot.querySelector('input')?.focus()
    expect(input.focused).toBeTruthy()

    input.renderRoot.querySelector('input')?.blur()
    expect(input.focused).toBeFalsy()
  })

  it('works with type buffer', async () => {
    input.target = {}
    await render(input, { path: 'path', type: 'buffer' })

    expect(input.renderRoot.querySelector('input')?.getAttribute('type')).toBe('text')

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toStrictEqual(TextCodec.encode('hello'))

    input.clear()
    expect(input.value).toStrictEqual(new Uint8Array())
  })

  //   case 'color':
  //     case 'email':
  //     case 'month':
  //     case 'password':
  //     case 'search':
  //     case 'tel':
  //     case 'time':
  //     case 'url':
  //     case 'week':

  it('works with type color, email, month, search, tel, time, url, week', async () => {
    await render(input, { type: 'color' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '#000000')
    expect(input.renderRoot.querySelector('input')?.value).toBe('#000000')
    expect(input.value).toBe('#000000')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'email' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'john@email.com')
    expect(input.renderRoot.querySelector('input')?.value).toBe('john@email.com')
    expect(input.value).toBe('john@email.com')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'month' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '2022-01')
    expect(input.renderRoot.querySelector('input')?.value).toBe('2022-01')
    expect(input.value).toBe('2022-01')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'search' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toBe('hello')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'tel' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '202-555-0102')
    expect(input.renderRoot.querySelector('input')?.value).toBe('202-555-0102')
    expect(input.value).toBe('202-555-0102')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'time' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '00:00')
    expect(input.renderRoot.querySelector('input')?.value).toBe('00:00')
    expect(input.value).toBe('00:00')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'url' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'https://website.com')
    expect(input.renderRoot.querySelector('input')?.value).toBe('https://website.com')
    expect(input.value).toBe('https://website.com')
    input.clear()
    expect(input.value).toBe('')

    await render(input, { type: 'week' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '2022-W01')
    expect(input.renderRoot.querySelector('input')?.value).toBe('2022-W01')
    expect(input.value).toBe('2022-W01')
    input.clear()
    expect(input.value).toBe('')
  })

  it('works with type date and datetime-local', async () => {
    await render(input, { type: 'date' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '2022-01-01')
    expect(input.renderRoot.querySelector('input')?.value).toBe('2022-01-01')
    expect(input.value).toStrictEqual(new Date('2022-01-01'))
    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type text', async () => {
    await render(input)

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBe('')

    input.remove()
    input = document.createElement('q-input')

    await render(input, { multiple: 'true' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toBeUndefined()

    dispatchKeyUpEvent(input.renderRoot.querySelector('input'), KeyboardEventKey.ENTER)
    expect(input.renderRoot.querySelector('input')?.value).toBe('')
    expect(input.value).toStrictEqual(['hello'])

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'world')
    dispatchKeyUpEvent(input.renderRoot.querySelector('input'), KeyboardEventKey.ENTER)
    expect(input.value).toStrictEqual(['hello', 'world'])

    input.removeItem('hello')
    expect(input.value).toStrictEqual(['world'])

    input.clear()
    expect(input.value).toStrictEqual([])
  })
})

import { TextCodec } from '@queelag/core'
import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/input.element'
import type { InputElement } from '../../../src/elements/input/input.element'
import { dispatchInputEvent, dispatchKeyUpEvent, render } from '../../../vitest/dom.utils'

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

    await render(input, { type: 'datetime-local' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '2022-01-01T00:00')
    expect(input.renderRoot.querySelector('input')?.value).toBe('2022-01-01T00:00')
    expect(input.value).toStrictEqual(new Date('2022-01-01T00:00'))
    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type number', async () => {
    await render(input, { type: 'number' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), '1')
    expect(input.renderRoot.querySelector('input')?.value).toBe('1')
    expect(input.value).toBe(1)

    input.clear()
    expect(input.value).toBe(0)
  })

  it('works with type password', async () => {
    await render(input, { type: 'password' })

    expect(input.renderRoot.querySelector('input')?.getAttribute('type')).toBe('password')

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBe('')
  })

  it('works with type text', async () => {
    await render(input)

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.renderRoot.querySelector('input')?.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBe('')
  })

  it('supports multiple values with type text', async () => {
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

  it('can obscure the value', async () => {
    await render(input)

    expect(input.renderRoot.querySelector('input')?.getAttribute('type')).toBe('text')
    input.obscure()
    expect(input.obscured).toBeTruthy()
    expect(input.focused).toBeTruthy()

    input.remove()
    await render(input, { obscured: 'true' })

    expect(input.renderRoot.querySelector('input')?.getAttribute('type')).toBe('password')
    input.reveal()
    expect(input.obscured).toBeFalsy()
    expect(input.focused).toBeTruthy()
  })

  it('stays untouched if touch-trigger is undefined', async () => {
    await render(input)

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    input.renderRoot.querySelector('input')?.focus()
    input.renderRoot.querySelector('input')?.blur()
    expect(input.touched).toBeFalsy()
  })

  it('is touched on blur if touch-trigger is blur', async () => {
    await render(input, { 'touch-trigger': 'blur' })

    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.touched).toBeFalsy()
    input.renderRoot.querySelector('input')?.focus()
    input.renderRoot.querySelector('input')?.blur()
    expect(input.touched).toBeTruthy()
  })

  it('is touched on input if touch-trigger is input', async () => {
    await render(input, { 'touch-trigger': 'input' })

    input.renderRoot.querySelector('input')?.focus()
    input.renderRoot.querySelector('input')?.blur()
    expect(input.touched).toBeFalsy()
    dispatchInputEvent(input.renderRoot.querySelector('input'), 'hello')
    expect(input.touched).toBeTruthy()
  })

  it('has the placeholder attribute if defined', async () => {
    await render(input, { placeholder: 'placeholder' })
    expect(input.renderRoot.querySelector('input')?.getAttribute('placeholder')).toBe('placeholder')
  })

  it('supports custom internal padding', async () => {
    await render(input, { padding: '24px' })
    expect(input.renderRoot.querySelector('input')?.getAttribute('style')).toBe('padding:24px;')
  })
})

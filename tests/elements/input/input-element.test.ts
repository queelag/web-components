import { encodeText } from '@aracna/core'
import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/input-element'
import type { AracnaInputElement as InputElement } from '../../../src/elements/input/input-element'
import { dispatchBlurEvent, dispatchFocusEvent, dispatchInputEvent, dispatchKeyUpEvent, render } from '../../../vitest/dom-utils'

describe('InputElement', () => {
  let input: InputElement, native: HTMLInputElement

  beforeEach(() => {
    input = document.createElement('aracna-input')
    native = document.createElement('input')

    input.append(native)
  })

  afterEach(() => {
    input.remove()
  })

  it('has correct attributes', async () => {
    await render(input)

    expect(native.disabled).toBeFalsy()
    expect(native.readOnly).toBeFalsy()
    expect(native.type).toBe('text')
    expect(native.value).toBe('')
  })

  it('handles blur and focus', async () => {
    await render(input)
    expect(input.focused).toBeFalsy()

    dispatchFocusEvent(native)
    expect(input.focused).toBeTruthy()

    dispatchBlurEvent(native)
    expect(input.focused).toBeFalsy()
  })

  it('works with type buffer', async () => {
    input.target = {}
    await render(input, { path: 'path', type: 'buffer' })

    expect(native.type).toBe('text')

    dispatchInputEvent(native, 'hello')

    // breaks on jsdom env
    // expect(native.value).toBe('hello')
    expect(input.value).toStrictEqual(encodeText('hello'))

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type color, email, month, search, tel, time, url, week', async () => {
    await render(input, { type: 'color' })

    dispatchInputEvent(native, '#000000')

    expect(native.value).toBe('#000000')
    expect(input.value).toBe('#000000')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'email' })

    dispatchInputEvent(native, 'john@email.com')

    expect(native.value).toBe('john@email.com')
    expect(input.value).toBe('john@email.com')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'month' })

    dispatchInputEvent(native, '2022-01')

    expect(native.value).toBe('2022-01')
    expect(input.value).toBe('2022-01')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'search' })

    dispatchInputEvent(native, 'hello')

    expect(native.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'tel' })

    dispatchInputEvent(native, '202-555-0102')

    expect(native.value).toBe('202-555-0102')
    expect(input.value).toBe('202-555-0102')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'time' })

    dispatchInputEvent(native, '00:00')

    expect(native.value).toBe('00:00')
    expect(input.value).toBe('00:00')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'url' })

    dispatchInputEvent(native, 'https://website.com')

    expect(native.value).toBe('https://website.com')
    expect(input.value).toBe('https://website.com')

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'week' })

    dispatchInputEvent(native, '2022-W01')

    expect(native.value).toBe('2022-W01')
    expect(input.value).toBe('2022-W01')

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type date and datetime-local', async () => {
    await render(input, { type: 'date' })

    dispatchInputEvent(native, '2022-01-01')

    expect(native.value).toBe('2022-01-01')
    expect(input.value).toStrictEqual(new Date('2022-01-01'))

    input.clear()
    expect(input.value).toBeUndefined()

    await render(input, { type: 'datetime-local' })

    dispatchInputEvent(native, '2022-01-01T00:00')

    expect(native.value).toBe('2022-01-01T00:00')
    expect(input.value).toStrictEqual(new Date('2022-01-01T00:00'))

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type number', async () => {
    await render(input, { type: 'number' })

    dispatchInputEvent(native, '1')

    expect(native.value).toBe('1')
    expect(input.value).toBe(1)

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type password', async () => {
    await render(input, { type: 'password' })
    expect(native.type).toBe('password')

    dispatchInputEvent(native, 'hello')

    expect(native.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('works with type text', async () => {
    await render(input)

    dispatchInputEvent(native, 'hello')

    expect(native.value).toBe('hello')
    expect(input.value).toBe('hello')

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('supports multiple values with type text', async () => {
    await render(input, { multiple: 'true' })

    dispatchInputEvent(native, 'hello')

    expect(native.value).toBe('hello')
    expect(input.value).toBeUndefined()

    dispatchKeyUpEvent(native, KeyboardEventKey.ENTER)

    expect(native.value).toBe('')
    expect(input.value).toStrictEqual(['hello'])

    dispatchInputEvent(native, 'world')
    dispatchKeyUpEvent(native, KeyboardEventKey.ENTER)

    expect(input.value).toStrictEqual(['hello', 'world'])

    input.removeItem('hello')
    expect(input.value).toStrictEqual(['world'])

    input.clear()
    expect(input.value).toBeUndefined()
  })

  it('can obscure the value', async () => {
    await render(input)
    expect(native.type).toBe('text')

    input.obscure()

    expect(input.obscured).toBeTruthy()
    expect(input.focused).toBeTruthy()
    expect(native.type).toBe('password')

    input.reveal()

    expect(input.obscured).toBeFalsy()
    expect(input.focused).toBeTruthy()
  })

  it('stays untouched if touch-trigger is undefined', async () => {
    await render(input)

    dispatchInputEvent(native, 'hello')

    native.focus()
    native.blur()

    expect(input.touched).toBeFalsy()
  })

  it('is touched on blur if touch-trigger is blur', async () => {
    await render(input, { 'touch-trigger': 'blur' })

    dispatchInputEvent(native, 'hello')
    expect(input.touched).toBeFalsy()

    native.focus()
    native.blur()

    expect(input.touched).toBeTruthy()
  })

  it('is touched on input if touch-trigger is input', async () => {
    await render(input, { 'touch-trigger': 'input' })

    native.focus()
    native.blur()

    expect(input.touched).toBeFalsy()

    dispatchInputEvent(native, 'hello')
    expect(input.touched).toBeTruthy()
  })
})

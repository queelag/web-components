import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/text-area-element'
import type { AracnaTextAreaElement as TextAreaElement } from '../../../src/elements/input/text-area-element'
import { dispatchInputEvent, dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('TextAreaElement', () => {
  let textarea: TextAreaElement, native: HTMLTextAreaElement

  beforeEach(() => {
    textarea = document.createElement('aracna-textarea')
    native = document.createElement('textarea')

    textarea.append(native)
  })

  afterEach(() => {
    textarea.remove()
  })

  it('has correct attributes', async () => {
    await render(textarea)

    expect(native.disabled).toBeFalsy()
    expect(native.readOnly).toBeFalsy()
    expect(native.value).toBe('')
  })

  it('handles blur and focus', async () => {
    await render(textarea)
    expect(textarea.focused).toBeFalsy()

    native.focus()
    expect(textarea.focused).toBeTruthy()

    native.blur()
    expect(textarea.focused).toBeFalsy()
  })

  it('supports multiple values', async () => {
    await render(textarea, { multiple: 'true' })

    dispatchInputEvent(native, 'hello')
    expect(native.value).toBe('hello')
    expect(textarea.value).toBeUndefined()

    await dispatchKeyDownEvent(KeyboardEventKey.ENTER, native)
    expect(native.value).toBe('')
    expect(textarea.value).toStrictEqual(['hello'])

    dispatchInputEvent(native, 'world')
    await dispatchKeyDownEvent(KeyboardEventKey.ENTER, native)
    expect(textarea.value).toStrictEqual(['hello', 'world'])

    textarea.removeItem('hello')
    expect(textarea.value).toStrictEqual(['world'])

    textarea.clear()
    expect(textarea.value).toBeUndefined()
  })

  it('stays untouched if touch-trigger is undefined', async () => {
    await render(textarea)

    dispatchInputEvent(native, 'hello')
    native.focus()
    native.blur()
    expect(textarea.touched).toBeFalsy()
  })

  it('is touched on blur if touch-trigger is blur', async () => {
    await render(textarea, { 'touch-trigger': 'blur' })

    dispatchInputEvent(native, 'hello')
    expect(textarea.touched).toBeFalsy()
    native.focus()
    native.blur()
    expect(textarea.touched).toBeTruthy()
  })

  it('is touched on textarea if touch-trigger is input', async () => {
    await render(textarea, { 'touch-trigger': 'input' })

    native.focus()
    native.blur()
    expect(textarea.touched).toBeFalsy()
    dispatchInputEvent(native, 'hello')
    expect(textarea.touched).toBeTruthy()
  })
})

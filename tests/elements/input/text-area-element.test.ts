import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/text-area-element'
import type { TextAreaElement } from '../../../src/elements/input/text-area-element'
import { dispatchInputEvent, dispatchKeyUpEvent, render } from '../../../vitest/dom-utils'

describe('TextAreaElement', () => {
  let textarea: TextAreaElement

  beforeEach(() => {
    textarea = document.createElement('aracna-textarea')
  })

  afterEach(() => {
    textarea.remove()
  })

  it('has correct attributes', async () => {
    await render(textarea)

    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('autofocus')).toBeNull()
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('disabled')).toBeNull()
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('placeholder')).toBeNull()
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('readonly')).toBeNull()
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('style')).toBe('')
    expect(textarea.renderRoot.querySelector('textarea')?.value).toBe('')
  })

  it('handles blur and focus', async () => {
    await render(textarea)
    expect(textarea.focused).toBeFalsy()

    textarea.renderRoot.querySelector('textarea')?.focus()
    expect(textarea.focused).toBeTruthy()

    textarea.renderRoot.querySelector('textarea')?.blur()
    expect(textarea.focused).toBeFalsy()
  })

  it('supports multiple values', async () => {
    await render(textarea, { multiple: 'true' })

    dispatchInputEvent(textarea.renderRoot.querySelector('textarea'), 'hello')
    expect(textarea.renderRoot.querySelector('textarea')?.value).toBe('hello')
    expect(textarea.value).toBeUndefined()

    dispatchKeyUpEvent(textarea.renderRoot.querySelector('textarea'), KeyboardEventKey.ENTER)
    expect(textarea.renderRoot.querySelector('textarea')?.value).toBe('')
    expect(textarea.value).toStrictEqual(['hello'])

    dispatchInputEvent(textarea.renderRoot.querySelector('textarea'), 'world')
    dispatchKeyUpEvent(textarea.renderRoot.querySelector('textarea'), KeyboardEventKey.ENTER)
    expect(textarea.value).toStrictEqual(['hello', 'world'])

    textarea.removeItem('hello')
    expect(textarea.value).toStrictEqual(['world'])

    textarea.clear()
    expect(textarea.value).toStrictEqual([])
  })

  it('stays untouched if touch-trigger is undefined', async () => {
    await render(textarea)

    dispatchInputEvent(textarea.renderRoot.querySelector('textarea'), 'hello')
    textarea.renderRoot.querySelector('textarea')?.focus()
    textarea.renderRoot.querySelector('textarea')?.blur()
    expect(textarea.touched).toBeFalsy()
  })

  it('is touched on blur if touch-trigger is blur', async () => {
    await render(textarea, { 'touch-trigger': 'blur' })

    dispatchInputEvent(textarea.renderRoot.querySelector('textarea'), 'hello')
    expect(textarea.touched).toBeFalsy()
    textarea.renderRoot.querySelector('textarea')?.focus()
    textarea.renderRoot.querySelector('textarea')?.blur()
    expect(textarea.touched).toBeTruthy()
  })

  it('is touched on textarea if touch-trigger is input', async () => {
    await render(textarea, { 'touch-trigger': 'input' })

    textarea.renderRoot.querySelector('textarea')?.focus()
    textarea.renderRoot.querySelector('textarea')?.blur()
    expect(textarea.touched).toBeFalsy()
    dispatchInputEvent(textarea.renderRoot.querySelector('textarea'), 'hello')
    expect(textarea.touched).toBeTruthy()
  })

  it('has the placeholder attribute if defined', async () => {
    await render(textarea, { placeholder: 'placeholder' })
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('placeholder')).toBe('placeholder')
  })

  it('supports custom internal padding', async () => {
    await render(textarea, { padding: '24px' })
    expect(textarea.renderRoot.querySelector('textarea')?.getAttribute('style')).toBe('padding:24px;')
  })
})

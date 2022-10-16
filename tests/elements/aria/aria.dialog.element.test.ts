import { wf } from '@queelag/core'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/aria/aria.dialog.element'
import type { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from '../../../src/elements/aria/aria.dialog.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaDialogElement', () => {
  let dialog: AriaDialogElement, label: AriaDialogLabelElement, description: AriaDialogDescriptionElement, input: HTMLInputElement

  beforeEach(() => {
    dialog = document.createElement('q-aria-dialog')
    dialog.displayCheck = 'none'

    label = document.createElement('q-aria-dialog-label')
    description = document.createElement('q-aria-dialog-description')
    input = document.createElement('input')

    dialog.append(label, description, input)
  })

  afterEach(() => {
    dialog.remove()
  })

  it('has correct aria', async () => {
    await render(dialog)

    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id)
    expect(dialog.getAttribute('aria-labelledby')).toBe(label.id)
    expect(dialog.getAttribute('role')).toBe('dialog')

    expect(label.getAttribute('id')).toBeDefined()
    expect(description.getAttribute('id')).toBeDefined()
  })

  it('traps focus', async () => {
    await render(dialog)

    dialog.visible = true
    await dialog.updateComplete
    await wf(() => dialog.focusTrapState === 'activated')

    expect(document.activeElement).toBe(input)
  })

  it('fires open and close events', async () => {
    let onOpen: Mock, onClose: Mock

    onOpen = vi.fn()
    onClose = vi.fn()

    dialog.addEventListener('open', onOpen)
    dialog.addEventListener('close', onClose)

    await render(dialog)

    expect(onOpen).toBeCalledTimes(0)
    expect(onClose).toBeCalledTimes(0)

    dialog.visible = true
    await dialog.updateComplete
    await wf(() => dialog.focusTrapState === 'activated')

    expect(onOpen).toBeCalledTimes(1)
    expect(onClose).toBeCalledTimes(0)

    dialog.visible = false
    await dialog.updateComplete
    await wf(() => dialog.focusTrapState === 'deactivated')

    expect(onOpen).toBeCalledTimes(1)
    expect(onClose).toBeCalledTimes(1)
  })
})

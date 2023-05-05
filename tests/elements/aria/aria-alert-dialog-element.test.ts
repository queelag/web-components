import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-alert-dialog-element'
import type {
  AriaAlertDialogDescriptionElement,
  AriaAlertDialogElement,
  AriaAlertDialogLabelElement
} from '../../../src/elements/aria/aria-alert-dialog-element'
import { render } from '../../../vitest/dom-utils'

describe('AriaAlertDialogElement', () => {
  let dialog: AriaAlertDialogElement, label: AriaAlertDialogLabelElement, description: AriaAlertDialogDescriptionElement, input: HTMLInputElement

  beforeEach(() => {
    dialog = document.createElement('aracna-aria-alert-dialog')
    dialog.displayCheck = 'none'

    label = document.createElement('aracna-aria-alert-dialog-label')
    description = document.createElement('aracna-aria-alert-dialog-description')
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
    expect(dialog.getAttribute('role')).toBe('alertdialog')

    expect(label.getAttribute('id')).toBeDefined()
    expect(description.getAttribute('id')).toBeDefined()
  })

  // it('traps focus', async () => {
  //   await render(dialog)

  //   dialog.visible = true
  //   await dialog.updateComplete
  //   await wf(() => dialog.focusTrapState === 'activated')

  //   expect(document.activeElement).toBe(input)
  // })

  // it('fires open and close events', async () => {
  //   let onOpen: Mock, onClose: Mock

  //   onOpen = vi.fn()
  //   onClose = vi.fn()

  //   dialog.addEventListener('open', onOpen)
  //   dialog.addEventListener('close', onClose)

  //   await render(dialog)

  //   expect(onOpen).toBeCalledTimes(0)
  //   expect(onClose).toBeCalledTimes(0)

  //   dialog.visible = true
  //   await dialog.updateComplete
  //   await wf(() => dialog.focusTrapState === 'activated')

  //   expect(onOpen).toBeCalledTimes(1)
  //   expect(onClose).toBeCalledTimes(0)

  //   dialog.visible = false
  //   await dialog.updateComplete
  //   await wf(() => dialog.focusTrapState === 'deactivated')

  //   expect(onOpen).toBeCalledTimes(1)
  //   expect(onClose).toBeCalledTimes(1)
  // })
})

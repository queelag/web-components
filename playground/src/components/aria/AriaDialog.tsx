import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaDialogDescriptionElement,
  AriaDialogDescriptionElementAttributes,
  AriaDialogElement,
  AriaDialogElementAttributes,
  AriaDialogLabelElement,
  AriaDialogLabelElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.dialog.element'
import { useEventListener } from '../../hooks/use.event.listener'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-dialog': AriaDialogProps
      'q-aria-dialog-description': AriaDialogDescriptionProps
      'q-aria-dialog-label': AriaDialogLabelProps
    }
  }
}

interface AriaDialogProps extends AriaDialogElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaDialogElement>, AriaDialogElement> {}

interface AriaDialogDescriptionProps
  extends AriaDialogDescriptionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaDialogDescriptionElement>, AriaDialogLabelElement> {}

interface AriaDialogLabelProps
  extends AriaDialogLabelElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaDialogLabelElement>, AriaDialogDescriptionElement> {}

export function AriaDialog() {
  const { element, ref } = useQueelagElement('q-aria-dialog')
  const [props] = useState<AriaDialogProps>({})
  const [visible, setVisible] = useState<boolean>(false)

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  useEventListener(ref, 'close', close)

  return (
    <div>
      <q-button onClick={open} native>
        Open ARIA Dialog
      </q-button>
      <q-aria-dialog
        {...props}
        ref={ref}
        className={joinElementClasses('fixed z-40 w-64 flex flex-col gap-2 p-2 rounded-sm border border-gray-300 bg-white', !visible && 'hidden')}
        visible={visible}
      >
        <q-aria-dialog-label>ARIA Dialog</q-aria-dialog-label>
        <q-aria-dialog-description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </q-aria-dialog-description>
        <q-input placeholder='input inside dialog' type='text' />
        <div className='self-end flex gap-2'>
          <q-button onClick={close} native>
            Close
          </q-button>
          <q-button onClick={close} native>
            Ok
          </q-button>
        </div>
      </q-aria-dialog>
    </div>
  )
}

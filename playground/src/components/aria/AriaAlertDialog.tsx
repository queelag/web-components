import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaAlertDialogDescriptionElement,
  AriaAlertDialogDescriptionElementAttributes,
  AriaAlertDialogElement,
  AriaAlertDialogElementAttributes,
  AriaAlertDialogLabelElement,
  AriaAlertDialogLabelElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.alert.dialog.element'
import { useEventListener } from '../../hooks/use.event.listener'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-alert-dialog': AriaAlertDialogProps
      'q-aria-alert-dialog-description': AriaAlertDialogDescriptionProps
      'q-aria-alert-dialog-label': AriaAlertDialogLabelProps
    }
  }
}

interface AriaAlertDialogProps extends AriaAlertDialogElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaAlertDialogElement>, AriaAlertDialogElement> {}

interface AriaAlertDialogDescriptionProps
  extends AriaAlertDialogDescriptionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaAlertDialogDescriptionElement>, AriaAlertDialogLabelElement> {}

interface AriaAlertDialogLabelProps
  extends AriaAlertDialogLabelElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaAlertDialogLabelElement>, AriaAlertDialogDescriptionElement> {}

export function AriaAlertDialog() {
  const { element, ref } = useQueelagElement('q-aria-alert-dialog')
  const [props] = useState<AriaAlertDialogProps>({})
  const [visible, setVisible] = useState<boolean>(false)

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  useEventListener(ref, 'close', close)

  return (
    <div>
      <q-button onClick={open} native>
        Open ARIA Alert Dialog
      </q-button>
      <q-aria-alert-dialog
        {...props}
        ref={ref}
        className={joinElementClasses('fixed z-40 w-64 flex flex-col gap-2 p-2 rounded-sm border border-gray-300 bg-white', !visible && 'hidden')}
        visible={visible}
        has-description
        has-label
      >
        <q-aria-alert-dialog-label>ARIA Alert Dialog</q-aria-alert-dialog-label>
        <q-aria-alert-dialog-description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </q-aria-alert-dialog-description>
        <div className='self-end flex gap-2'>
          <q-button onClick={close} native>
            Close
          </q-button>
          <q-button onClick={close} native>
            Ok
          </q-button>
        </div>
      </q-aria-alert-dialog>
    </div>
  )
}

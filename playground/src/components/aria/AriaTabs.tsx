import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaTabsElement,
  AriaTabsElementAttributes,
  AriaTabsPanelElement,
  AriaTabsPanelElementAttributes,
  AriaTabsTabElement,
  AriaTabsTabElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.tabs.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-tabs': AriaTabsProps
      'q-aria-tabs-panel': AriaTabsPanelProps
      'q-aria-tabs-tab': AriaTabsTabProps
    }
  }
}

interface AriaTabsProps extends AriaTabsElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaTabsElement>, AriaTabsElement> {}
interface AriaTabsPanelProps extends AriaTabsPanelElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaTabsPanelElement>, AriaTabsPanelElement> {}
interface AriaTabsTabProps extends AriaTabsTabElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaTabsTabElement>, AriaTabsTabElement> {}

export function AriaTabs() {
  const { element, ref } = useQueelagElement('q-aria-tabs', { attribute: { dispatch: true } })
  const [props] = useState<AriaTabsProps>({})
  const [tabs] = useState<number[]>([1, 2, 3])

  return (
    <div>
      <q-aria-tabs {...props} ref={ref} className='flex flex-col items-start gap-2'>
        <div className='flex border divide-x border-gray-400 divide-gray-400'>
          {tabs.map((number: number) => (
            <AriaTabsTab number={number} />
          ))}
        </div>
        <q-aria-tabs-panel className='w-96 h-32 p-2 border border-gray-400'>
          <span className='text-xs'>Content of ARIA Tab {tabs[element?.selectedTabElementIndex || 0]}</span>
        </q-aria-tabs-panel>
      </q-aria-tabs>
    </div>
  )
}

export function AriaTabsTab({ number }: any) {
  const { element, ref } = useQueelagElement('q-aria-tabs-tab', { attribute: { dispatch: true } })

  return (
    <q-aria-tabs-tab ref={ref} className={joinElementClasses('px-3 py-2', element?.selected && 'bg-gray-200')} selected={number === 1}>
      <span className='text-xs'>ARIA Tab {number}</span>
    </q-aria-tabs-tab>
  )
}

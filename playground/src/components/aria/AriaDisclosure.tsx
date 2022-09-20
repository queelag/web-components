import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaDisclosureButtonElement,
  AriaDisclosureButtonElementAttributes,
  AriaDisclosureElement,
  AriaDisclosureElementAttributes,
  AriaDisclosurePanelElement,
  AriaDisclosurePanelElementAttributes,
  AriaDisclosureSectionElement,
  AriaDisclosureSectionElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.disclosure.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-disclosure': AriaDisclosureProps
      'q-aria-disclosure-button': AriaDisclosureButtonProps
      'q-aria-disclosure-panel': AriaDisclosurePanelProps
      'q-aria-disclosure-section': AriaDisclosureSectionProps
    }
  }
}

interface AriaDisclosureProps extends AriaDisclosureElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaDisclosureElement>, AriaDisclosureElement> {}

interface AriaDisclosureButtonProps
  extends AriaDisclosureButtonElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaDisclosureButtonElement>, AriaDisclosureButtonElement> {}

interface AriaDisclosurePanelProps
  extends AriaDisclosurePanelElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaDisclosurePanelElement>, AriaDisclosurePanelElement> {}

interface AriaDisclosureSectionProps
  extends AriaDisclosureSectionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaDisclosureSectionElement>, AriaDisclosureSectionElement> {}

export function AriaDisclosure() {
  const { element, ref } = useQueelagElement('q-aria-disclosure')
  const [props] = useState<AriaDisclosureProps>({})
  const [sections] = useState<number[]>([1, 2, 3])

  return (
    <div>
      <q-aria-disclosure
        {...props}
        ref={ref}
        allow-only-one-expanded-section
        className='w-64 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400'
      >
        {sections.map((section: number) => (
          <AriaDisclosureSection number={section} />
        ))}
      </q-aria-disclosure>
    </div>
  )
}

function AriaDisclosureSection({ number }: any) {
  const { element, ref } = useQueelagElement('q-aria-disclosure-section', { attribute: { dispatch: true } })
  const [props] = useState<AriaDisclosureSectionProps>({})

  return (
    <q-aria-disclosure-section {...props} ref={ref} className='group flex flex-col py-2 gap-1 text-xs focus:outline'>
      <q-aria-disclosure-button className='w-full flex justify-between items-center px-2'>
        <span>ARIA Disclosure Header {number}</span>
        <q-icon
          fill='none'
          size={16}
          src={`https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-${element?.expanded ? 'up' : 'down'}.svg`}
          stroke='black'
          stroke-width={2}
        />
      </q-aria-disclosure-button>
      <q-aria-disclosure-panel className={joinElementClasses('px-2 pt-2 border-t text-gray-400', !element?.expanded && 'hidden')}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </q-aria-disclosure-panel>
    </q-aria-disclosure-section>
  )
}

import {
  AriaAccordionButtonElementAttributes,
  AriaAccordionElementAttributes,
  AriaAccordionHeaderElementAttributes,
  AriaAccordionPanelElementAttributes,
  AriaAccordionSectionElementAttributes,
  joinElementClasses
} from '@queelag/web'
import { useState } from 'preact/hooks'
import type {
  AriaAccordionButtonElement,
  AriaAccordionElement,
  AriaAccordionHeaderElement,
  AriaAccordionPanelElement,
  AriaAccordionSectionElement
} from '../../../../src'
import '../../../../src/elements/aria/aria.accordion.element'
import type { ElementProps } from '../../definitions/types'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      'q-aria-accordion': AriaAccordionProps
      'q-aria-accordion-header': AriaAccordionHeaderProps
      'q-aria-accordion-button': AriaAccordionButtonProps
      'q-aria-accordion-panel': AriaAccordionPanelProps
      'q-aria-accordion-section': AriaAccordionSectionProps
    }
  }
}

interface AriaAccordionProps extends ElementProps<AriaAccordionElement, AriaAccordionElementAttributes> {}
interface AriaAccordionHeaderProps extends ElementProps<AriaAccordionHeaderElement, AriaAccordionHeaderElementAttributes> {}
interface AriaAccordionButtonProps extends ElementProps<AriaAccordionButtonElement, AriaAccordionButtonElementAttributes> {}
interface AriaAccordionPanelProps extends ElementProps<AriaAccordionPanelElement, AriaAccordionPanelElementAttributes> {}
interface AriaAccordionSectionProps extends ElementProps<AriaAccordionSectionElement, AriaAccordionSectionElementAttributes> {}

export function AriaAccordion() {
  const { element, ref } = useQueelagElement('q-aria-accordion')
  const [props] = useState<AriaAccordionProps>({})
  const [sections] = useState<number[]>([1, 2, 3])

  return (
    <div>
      <q-aria-accordion
        {...props}
        ref={ref}
        allow-only-one-expanded-section
        className='w-64 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400'
      >
        {sections.map((section: number) => (
          <AriaAccordionSection number={section} />
        ))}
      </q-aria-accordion>
    </div>
  )
}

function AriaAccordionSection({ number }: any) {
  const { element, ref } = useQueelagElement('q-aria-accordion-section', { attribute: { dispatch: true } })
  const [props] = useState<AriaAccordionSectionProps>({})

  return (
    <q-aria-accordion-section {...props} ref={ref} className='group flex flex-col py-2 gap-1 text-xs focus:outline' collapsable={number !== 2}>
      <q-aria-accordion-header>
        <q-aria-accordion-button className='w-full flex justify-between items-center px-2'>
          <span>ARIA Accordion Header {number}</span>
          <q-icon
            fill='none'
            size={16}
            src={`https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-${element?.expanded ? 'up' : 'down'}.svg`}
            stroke='black'
            stroke-width={2}
          />
        </q-aria-accordion-button>
      </q-aria-accordion-header>
      <q-aria-accordion-panel className={joinElementClasses('px-2 pt-2 border-t text-gray-400', !element?.expanded && 'hidden')}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </q-aria-accordion-panel>
    </q-aria-accordion-section>
  )
}

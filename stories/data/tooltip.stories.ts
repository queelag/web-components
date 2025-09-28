import { ICON_F_INFO } from '@aracna-icons/feather'
import { autoPlacement, offset } from '@floating-ui/dom'
import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../../src/elements/data/icon-element'
import '../../src/elements/data/tooltip-element'
import './tooltip.css'

const meta: Meta = {
  args: {
    focusable: true,
    showOnPointerEnter: true,
    visible: false
  },
  title: 'Tooltip',
  component: 'aracna-tooltip'
}
export default meta

type Story = StoryObj

export const Primary: Story = {
  render: ({ focusable, showOnPointerEnter, visible }) => html`
    <aracna-tooltip ?focusable=${focusable} ?show-on-pointer-enter=${showOnPointerEnter} ?visible=${visible}>
      <aracna-tooltip-trigger>
        <aracna-icon fill="none" size=${16} src=${ICON_F_INFO} stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width=${2}></aracna-icon>
      </aracna-tooltip-trigger>
      <aracna-tooltip-arrow></aracna-tooltip-arrow>
      <aracna-tooltip-content .middlewares=${[autoPlacement(), offset(10)]}>Lorem ipsum</aracna-tooltip-content>
    </aracna-tooltip>
  `
}

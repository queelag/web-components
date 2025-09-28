import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../src/elements/input/radio-group-element'
import './radio-group.css'

const meta: Meta = {
  title: 'Radio Group',
  component: 'aracna-radio-group',
  subcomponents: { RadioButton: 'aracna-radio-button' }
}
export default meta

type Story = StoryObj

export const Primary: Story = {
  render: () => html`
    <aracna-radio-group>
      <aracna-radio-button value="apple">Apple</aracna-radio-button>
      <aracna-radio-button value="banana">Banana</aracna-radio-button>
      <aracna-radio-button value="cherry">Cherry</aracna-radio-button>
    </aracna-radio-group>
  `
}

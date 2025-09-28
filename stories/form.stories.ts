import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../src/elements/input/form-element'
import './form.css'

const meta: Meta = {
  title: 'Form',
  component: 'aracna-form'
}
export default meta

type Story = StoryObj

export const Primary: Story = {
  render: () => html`
    <aracna-form>
      <form>
        <button type="submit">Submit</button>
      </form>
    </aracna-form>
  `
}

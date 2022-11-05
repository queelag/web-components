import { offset } from '@floating-ui/dom'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/tooltip.element'
import '../../../../src/elements/input/button.element'

export default class Tooltip extends LitElement {
  protected render(): unknown {
    return html`
      <q-tooltip focusable>
        <q-tooltip-content .middlewares=${[offset(8)]}>
          <span>ARIA Tooltip Content</span>
          <q-tooltip-arrow></q-tooltip-arrow>
        </q-tooltip-content>
        <q-tooltip-trigger>
          <q-button tabindex="-1" native> ARIA Tooltip Trigger </q-button>
        </q-tooltip-trigger>
      </q-tooltip>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    q-tooltip-content {
      padding: 4px 8px;
      border-radius: 4px;
      background: lightgray;
    }

    q-tooltip:not([visible]) q-tooltip-content {
      opacity: 0;
      pointer-events: none;
    }

    q-tooltip-content span {
      font-size: 12px;
      white-space: nowrap;
    }

    q-tooltip-arrow {
      height: 0px;
      width: 0px;

      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid lightgray;
    }
  `
}

customElements.define('my-tooltip', Tooltip)

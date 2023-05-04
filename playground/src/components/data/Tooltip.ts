import { defineCustomElement } from '@aracna/web'
import { offset } from '@floating-ui/dom'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/tooltip.element'
import '../../../../src/elements/input/button.element'

export default class Tooltip extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-tooltip focusable>
        <aracna-tooltip-content .middlewares=${[offset(8)]}>
          <span>ARIA Tooltip Content</span>
          <aracna-tooltip-arrow></aracna-tooltip-arrow>
        </aracna-tooltip-content>
        <aracna-tooltip-trigger>
          <aracna-button tabindex="-1" native> ARIA Tooltip Trigger </aracna-button>
        </aracna-tooltip-trigger>
      </aracna-tooltip>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-tooltip-content {
      padding: 4px 8px;
      border-radius: 4px;
      background: lightgray;
    }

    aracna-tooltip:not([visible]) aracna-tooltip-content {
      opacity: 0;
      pointer-events: none;
    }

    aracna-tooltip-content span {
      font-size: 12px;
      white-space: nowrap;
    }

    aracna-tooltip-arrow {
      height: 0px;
      width: 0px;

      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid lightgray;
    }
  `
}

defineCustomElement('my-tooltip', Tooltip)

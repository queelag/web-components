import { Middleware, offset } from '@floating-ui/dom'
import { CSSResultGroup, LitElement, css, html } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/navigation/menu.element'

class IconChevronRight extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-icon
        fill="none"
        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-right.svg"
        size="16"
        stroke="black"
        stroke-width="2"
      ></aracna-icon>
    `
  }
}

defineCustomElement('my-menu-icon-chevron-right', IconChevronRight)

export default class Menu extends LitElement {
  button: boolean = true
  middlewares: Middleware[] = [offset(4)]

  protected render(): unknown {
    if (this.button) {
      return html`
        <aracna-menu>
          <aracna-menu-button>Menu Button</aracna-menu-button>
          <aracna-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <aracna-menu-item>
              <a href="#">Home</a>
            </aracna-menu-item>
            <aracna-menu-item>
              <span>About</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <aracna-menu-item>
                  <a href="#">Overview</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">Administration</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <span>Facts</span>
                  <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
                  <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                    <aracna-menu-item>
                      <a href="#">History</a>
                    </aracna-menu-item>
                    <aracna-menu-item>
                      <a href="#">Current Statistics</a>
                    </aracna-menu-item>
                    <aracna-menu-item>
                      <a href="#">Awards</a>
                    </aracna-menu-item>
                  </aracna-menu-submenu>
                </aracna-menu-item>
                <aracna-menu-item>
                  <span>Campus Tours</span>
                  <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
                  <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                    <aracna-menu-item>
                      <a href="#">For prospective students</a>
                    </aracna-menu-item>
                    <aracna-menu-item>
                      <a href="#">For alumni</a>
                    </aracna-menu-item>
                    <aracna-menu-item>
                      <a href="#">For visitors</a>
                    </aracna-menu-item>
                  </aracna-menu-submenu>
                </aracna-menu-item>
              </aracna-menu-submenu>
            </aracna-menu-item>
            <aracna-menu-item>
              <span>Admissions</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <aracna-menu-item>
                  <a href="#">Apply</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">Tuition</a>
                </aracna-menu-item>
              </aracna-menu-submenu>
            </aracna-menu-item>
          </aracna-menu-submenu>
        </aracna-menu>
      `
    }

    return html`
      <aracna-menu>
        <aracna-menu-item>
          <a href="#">Home</a>
        </aracna-menu-item>
        <span class="divider">•</span>
        <aracna-menu-item>
          <span>About</span>
          <aracna-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <aracna-menu-item>
              <a href="#">Overview</a>
            </aracna-menu-item>
            <aracna-menu-item>
              <a href="#">Administration</a>
            </aracna-menu-item>
            <aracna-menu-item>
              <span>Facts</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <aracna-menu-item>
                  <a href="#">History</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">Current Statistics</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">Awards</a>
                </aracna-menu-item>
              </aracna-menu-submenu>
            </aracna-menu-item>
            <aracna-menu-item>
              <span>Campus Tours</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <aracna-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <aracna-menu-item>
                  <a href="#">For prospective students</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">For alumni</a>
                </aracna-menu-item>
                <aracna-menu-item>
                  <a href="#">For visitors</a>
                </aracna-menu-item>
              </aracna-menu-submenu>
            </aracna-menu-item>
          </aracna-menu-submenu>
        </aracna-menu-item>
        <span class="divider">•</span>
        <aracna-menu-item>
          <span>Admissions</span>
          <aracna-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <aracna-menu-item>
              <a href="#">Apply</a>
            </aracna-menu-item>
            <aracna-menu-item>
              <a href="#">Tuition</a>
            </aracna-menu-item>
          </aracna-menu-submenu>
        </aracna-menu-item>
      </aracna-menu>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-menu {
      display: flex;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-menu-button {
      width: 196px;

      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-menu-submenu {
      width: 196px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;

      background: white;
    }

    aracna-menu-submenu:not([expanded]) {
      opacity: 0;
      pointer-events: none;
    }

    aracna-menu-submenu > * + * {
      border-top: 1px solid gray;
    }

    aracna-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      outline: none;
    }

    aracna-menu-item a {
      outline: none;
    }

    aracna-menu-item a,
    aracna-menu-item span {
      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-menu-item[focused] {
      background: lightgray;
    }

    aracna-menu-item a {
      color: black;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
    }
  `
}

defineCustomElement('my-menu', Menu)

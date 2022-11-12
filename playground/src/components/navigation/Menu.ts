import { Middleware, offset } from '@floating-ui/dom'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/navigation/menu.element'

class IconChevronRight extends LitElement {
  protected render(): unknown {
    return html`
      <q-icon
        fill="none"
        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-right.svg"
        size="16"
        stroke="black"
        stroke-width="2"
      ></q-icon>
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
        <q-menu>
          <q-menu-button>Menu Button</q-menu-button>
          <q-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <q-menu-item>
              <a href="#">Home</a>
            </q-menu-item>
            <q-menu-item>
              <span>About</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <q-menu-item>
                  <a href="#">Overview</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">Administration</a>
                </q-menu-item>
                <q-menu-item>
                  <span>Facts</span>
                  <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
                  <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                    <q-menu-item>
                      <a href="#">History</a>
                    </q-menu-item>
                    <q-menu-item>
                      <a href="#">Current Statistics</a>
                    </q-menu-item>
                    <q-menu-item>
                      <a href="#">Awards</a>
                    </q-menu-item>
                  </q-menu-submenu>
                </q-menu-item>
                <q-menu-item>
                  <span>Campus Tours</span>
                  <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
                  <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                    <q-menu-item>
                      <a href="#">For prospective students</a>
                    </q-menu-item>
                    <q-menu-item>
                      <a href="#">For alumni</a>
                    </q-menu-item>
                    <q-menu-item>
                      <a href="#">For visitors</a>
                    </q-menu-item>
                  </q-menu-submenu>
                </q-menu-item>
              </q-menu-submenu>
            </q-menu-item>
            <q-menu-item>
              <span>Admissions</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <q-menu-item>
                  <a href="#">Apply</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">Tuition</a>
                </q-menu-item>
              </q-menu-submenu>
            </q-menu-item>
          </q-menu-submenu>
        </q-menu>
      `
    }

    return html`
      <q-menu>
        <q-menu-item>
          <a href="#">Home</a>
        </q-menu-item>
        <span class="divider">•</span>
        <q-menu-item>
          <span>About</span>
          <q-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <q-menu-item>
              <a href="#">Overview</a>
            </q-menu-item>
            <q-menu-item>
              <a href="#">Administration</a>
            </q-menu-item>
            <q-menu-item>
              <span>Facts</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <q-menu-item>
                  <a href="#">History</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">Current Statistics</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">Awards</a>
                </q-menu-item>
              </q-menu-submenu>
            </q-menu-item>
            <q-menu-item>
              <span>Campus Tours</span>
              <my-menu-icon-chevron-right></my-menu-icon-chevron-right>
              <q-menu-submenu .middlewares=${this.middlewares} placement="right-start">
                <q-menu-item>
                  <a href="#">For prospective students</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">For alumni</a>
                </q-menu-item>
                <q-menu-item>
                  <a href="#">For visitors</a>
                </q-menu-item>
              </q-menu-submenu>
            </q-menu-item>
          </q-menu-submenu>
        </q-menu-item>
        <span class="divider">•</span>
        <q-menu-item>
          <span>Admissions</span>
          <q-menu-submenu .middlewares=${this.middlewares} placement="bottom-start">
            <q-menu-item>
              <a href="#">Apply</a>
            </q-menu-item>
            <q-menu-item>
              <a href="#">Tuition</a>
            </q-menu-item>
          </q-menu-submenu>
        </q-menu-item>
      </q-menu>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-menu {
      display: flex;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-menu-button {
      width: 196px;

      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    q-menu-submenu {
      width: 196px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;

      background: white;
    }

    q-menu-submenu:not([expanded]) {
      opacity: 0;
      pointer-events: none;
    }

    q-menu-submenu > * + * {
      border-top: 1px solid gray;
    }

    q-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      outline: none;
    }

    q-menu-item a {
      outline: none;
    }

    q-menu-item a,
    q-menu-item span {
      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    q-menu-item[focused] {
      background: lightgray;
    }

    q-menu-item a {
      color: black;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
    }
  `
}

defineCustomElement('my-menu', Menu)

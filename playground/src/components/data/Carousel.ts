import { css, CSSResultGroup, html, LitElement } from 'lit'
import { when } from 'lit-html/directives/when.js'
import '../../../../src/elements/data/carousel.element'
import '../../../../src/elements/data/image.element'

export default class Carousel extends LitElement {
  tabs?: boolean = true

  protected render(): unknown {
    return html`
      <q-carousel automatic-rotation-interval-time="2000" infinite-rotation>
        <q-carousel-slides>
          <q-carousel-slide active>
            <q-image src="https://images.unsplash.com/photo-1533883355737-25ab4d1fbefb?w=768"></q-image>
          </q-carousel-slide>
          <q-carousel-slide>
            <q-image src="https://images.unsplash.com/photo-1462688681110-15bc88b1497c?w=768"></q-image>
          </q-carousel-slide>
          <q-carousel-slide>
            <q-image src="https://images.unsplash.com/photo-1571774367564-5037461020a3?w=768"></q-image>
          </q-carousel-slide>
        </q-carousel-slides>
        ${when(
          this.tabs,
          () => html`
            <q-carousel-tabs>
              <q-carousel-tab active>
                <q-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
                <q-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-carousel-tab>
              <q-carousel-tab>
                <q-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
                <q-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-carousel-tab>
              <q-carousel-tab>
                <q-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
                <q-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></q-icon>
              </q-carousel-tab>
            </q-carousel-tabs>
          `
        )}
        ${when(
          !this.tabs,
          () => html`
            <div class="controls">
              <q-carousel-rotation-control>{element?.automaticRotation ? 'Stop' : 'Start'}</q-carousel-rotation-control>
              <q-carousel-previous-slide-control>Prev</q-carousel-previous-slide-control>
              <q-carousel-next-slide-control>Next</q-carousel-next-slide-control>
            </div>
          `
        )}
      </q-carousel>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    q-carousel {
      width: 384px;
      aspect-ratio: 16/9;

      display: flex;
      justify-content: center;

      position: relative;
    }

    q-carousel-slides {
      width: 100%;

      border-radius: 4px;
      overflow: hidden;

      position: relative;
    }

    q-carousel-slide {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    q-carousel-slide:not([active]) {
      display: none;
    }

    q-carousel-slide q-image {
      width: 100%;
    }

    div.controls {
      position: absolute;
      bottom: 0;
      right: 0;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      gap: 8px;

      font-size: 12px;
    }

    q-carousel-next-slide-control,
    q-carousel-previous-slide-control,
    q-carousel-rotation-control {
      padding: 4px 8px;
      background: lightgray;

      border-radius: 4px;

      text-transform: uppercase;
    }

    q-carousel-tabs {
      position: absolute;
      bottom: 8px;
    }

    q-carousel-tab[active] q-icon.circle {
      display: none;
    }

    q-carousel-tab:not([active]) q-icon.disc {
      display: none;
    }
  `
}

customElements.define('my-carousel', Carousel)

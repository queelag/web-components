import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import { when } from 'lit-html/directives/when.js'
import '../../../../src/elements/data/carousel.element'
import '../../../../src/elements/data/image.element'

export default class Carousel extends LitElement {
  tabs?: boolean = true

  protected render(): unknown {
    return html`
      <aracna-carousel automatic-rotation-interval-time="2000" infinite-rotation>
        <aracna-carousel-slides>
          <aracna-carousel-slide active>
            <aracna-image src="https://images.unsplash.com/photo-1533883355737-25ab4d1fbefb?w=768"></aracna-image>
          </aracna-carousel-slide>
          <aracna-carousel-slide>
            <aracna-image src="https://images.unsplash.com/photo-1462688681110-15bc88b1497c?w=768"></aracna-image>
          </aracna-carousel-slide>
          <aracna-carousel-slide>
            <aracna-image src="https://images.unsplash.com/photo-1571774367564-5037461020a3?w=768"></aracna-image>
          </aracna-carousel-slide>
        </aracna-carousel-slides>
        ${when(
          this.tabs,
          () => html`
            <aracna-carousel-tabs>
              <aracna-carousel-tab active>
                <aracna-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
                <aracna-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-carousel-tab>
              <aracna-carousel-tab>
                <aracna-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
                <aracna-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-carousel-tab>
              <aracna-carousel-tab>
                <aracna-icon
                  class="circle"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
                <aracna-icon
                  class="disc"
                  fill="white"
                  size="14"
                  src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
                  stroke="black"
                  stroke-width="2"
                ></aracna-icon>
              </aracna-carousel-tab>
            </aracna-carousel-tabs>
          `
        )}
        ${when(
          !this.tabs,
          () => html`
            <div class="controls">
              <aracna-carousel-rotation-control>{element?.automaticRotation ? 'Stop' : 'Start'}</aracna-carousel-rotation-control>
              <aracna-carousel-previous-slide-control>Prev</aracna-carousel-previous-slide-control>
              <aracna-carousel-next-slide-control>Next</aracna-carousel-next-slide-control>
            </div>
          `
        )}
      </aracna-carousel>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-carousel {
      width: 384px;
      aspect-ratio: 16/9;

      display: flex;
      justify-content: center;

      position: relative;
    }

    aracna-carousel-slides {
      width: 100%;

      border-radius: 4px;
      overflow: hidden;

      position: relative;
    }

    aracna-carousel-slide {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    aracna-carousel-slide:not([active]) {
      display: none;
    }

    aracna-carousel-slide aracna-image {
      filter: invert(1);
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

    aracna-carousel-next-slide-control,
    aracna-carousel-previous-slide-control,
    aracna-carousel-rotation-control {
      padding: 4px 8px;
      background: lightgray;

      border-radius: 4px;

      text-transform: uppercase;
    }

    aracna-carousel-tabs {
      position: absolute;
      bottom: 8px;
    }

    aracna-carousel-tab[active] aracna-icon.circle {
      display: none;
    }

    aracna-carousel-tab:not([active]) aracna-icon.disc {
      display: none;
    }
  `
}

defineCustomElement('my-carousel', Carousel)

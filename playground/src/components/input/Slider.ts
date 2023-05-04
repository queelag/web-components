import { getLowestNumber, getNumberPercentage, getNumbersDistance } from '@aracna/core'
import type { SliderChangeEvent } from '@aracna/web'
import { defineCustomElement } from '@aracna/web'
import { CSSResultGroup, LitElement, css, html } from 'lit'
import { when } from 'lit-html/directives/when.js'
import '../../../../src/elements/input/slider.element'

export default class Slider extends LitElement {
  multiple: boolean = true
  percentages: number[] = [getNumberPercentage(25), getNumberPercentage(75)]

  onChange(event: SliderChangeEvent): void {
    if (event.detail?.percentages) {
      this.percentages = event.detail?.percentages
      this.requestUpdate()
    }
  }

  protected render(): unknown {
    return html`
      <aracna-slider orientation="horizontal" @slider-change=${this.onChange}>
        <div class="background"></div>
        <aracna-slider-thumb background="green" shape="circle" size="20" value="25"></aracna-slider-thumb>
        ${when(
          this.multiple,
          () => html`
            <aracna-slider-thumb background="green" shape="circle" size="20" value="75"></aracna-slider-thumb>
            <div
              class="foreground"
              style="left: ${getLowestNumber(this.percentages) + '%'}; width: ${getNumbersDistance(this.percentages[0], this.percentages[1]) + '%'}"
            ></div>
          `
        )}
      </aracna-slider>
    `
  }

  // get foregroundStyleMap(): DirectiveResult {
  //   return styleMap({
  //     left: getLowestNumber(this.percentages) + '%',
  //     width: getNumbersDistance(this.percentages[0], this.percentages[1]) + '%'
  //   })
  // }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-slider {
      position: relative;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    aracna-slider[orientation='horizontal'] {
      width: 256px;
      height: 20px;
    }

    aracna-slider[orientation='vertical'] {
      width: 20px;
      height: 256px;
    }

    div.background {
      background: lightgray;
      border-radius: 4px;
    }

    aracna-slider[orientation='horizontal'] div.background {
      width: 100%;
      height: 4px;
    }

    aracna-slider[orientation='vertical'] div.background {
      width: 4px;
      height: 100%;
    }

    div.foreground {
      position: absolute;
      background: green;
    }

    aracna-slider[orientation='horizontal'] div.foreground {
      height: 4px;
    }

    aracna-slider[orientation='vertical'] div.foreground {
      width: 4px;
    }

    aracna-slider-thumb {
      width: 20px;
      height: 20px;

      border-radius: 20px;
    }
  `
}

defineCustomElement('my-slider', Slider)

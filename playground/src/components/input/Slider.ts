import { getLowestNumber, getNumberPercentage, getNumbersDistance } from '@queelag/core'
import type { SliderChangeEvent } from '@queelag/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import type { DirectiveResult } from 'lit-html/directive'
import { styleMap } from 'lit-html/directives/style-map.js'
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
      <q-slider orientation="horizontal" @slider-change=${this.onChange}>
        <div class="background"></div>
        <q-slider-thumb background="green" shape="circle" size="20" value="25"></q-slider-thumb>
        ${when(
          this.multiple,
          () => html`
            <q-slider-thumb background="green" shape="circle" size="20" value="75"></q-slider-thumb>
            <div class="foreground" style=${this.foregroundStyleMap}></div>
          `
        )}
      </q-slider>
    `
  }

  get foregroundStyleMap(): DirectiveResult {
    return styleMap({
      left: getLowestNumber(this.percentages) + '%',
      width: getNumbersDistance(this.percentages[0], this.percentages[1]) + '%'
    })
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-slider {
      position: relative;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    q-slider[orientation='horizontal'] {
      width: 256px;
      height: 20px;
    }

    q-slider[orientation='vertical'] {
      width: 20px;
      height: 256px;
    }

    div.background {
      background: lightgray;
      border-radius: 4px;
    }

    q-slider[orientation='horizontal'] div.background {
      width: 100%;
      height: 4px;
    }

    q-slider[orientation='vertical'] div.background {
      width: 4px;
      height: 100%;
    }

    div.foreground {
      position: absolute;
      background: green;
    }

    q-slider[orientation='horizontal'] div.foreground {
      height: 4px;
    }

    q-slider[orientation='vertical'] div.foreground {
      width: 4px;
    }

    q-slider-thumb {
      width: 20px;
      height: 20px;

      border-radius: 20px;
    }
  `
}

defineCustomElement('my-slider', Slider)

import type { QueelagFile } from '@queelag/core'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import { map } from 'lit-html/directives/map.js'
import { createRef, Ref, ref } from 'lit-html/directives/ref.js'
import { when } from 'lit-html/directives/when.js'
import type { InputFileElement } from '../../../../src'
import '../../../../src/elements/input/input.file.element'

export default class InputFile extends LitElement {
  ref: Ref<InputFileElement> = createRef()

  onStateChange(): void {
    this.requestUpdate()
  }

  protected render(): unknown {
    return html`
      <q-input-file ${ref(this.ref)} @state-change=${this.onStateChange} multiple>
        <div class="dropzone">File Dropzone</div>
      </q-input-file>
      ${when(
        this.ref.value?.isFilesNotEmpty,
        () => html`
          <div class="files">
            ${map(
              this.ref.value?.files,
              (file: QueelagFile) => html`
                <div class="file" key="${file.id}">
                  <span class="name">${file.name}</span>
                  <q-button @click=${() => this.ref.value?.removeFile(file)}>
                    <q-icon
                      fill="none"
                      size="12"
                      src="https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg"
                      stroke="black"
                      stroke-width="2"
                    ></q-icon>
                  </q-button>
                </div>
              `
            )}
            <q-button @click=${() => this.ref.value?.clear()} native>Clear</q-button>
          </div>
        `
      )}
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    div.dropzone {
      width: 256px;
      height: 128px;

      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px dashed gray;
      border-radius: 4px;
    }

    div.files {
      display: flex;
      gap: 4px;
      padding: 4px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    div.file {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;

      border: 1px solid gray;
    }

    div.file span.name {
      font-size: 12px;
      font-weight: 500;
    }
  `
}

defineCustomElement('my-input-file', InputFile)

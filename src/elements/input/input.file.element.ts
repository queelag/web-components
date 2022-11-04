import { deserializeFile, DeserializeFileOptions, QueelagFile, removeArrayItems } from '@queelag/core'
import { ElementName, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-input-file': InputFileElement
  }
}

export class InputFileElement extends FormFieldElement {
  /**
   * PROPERTIES
   */
  deserializeFileResolveArrayBuffer?: boolean
  deserializeFileResolveText?: boolean
  multiple?: boolean

  /**
   * QUERIES
   */
  private inputElement!: HTMLInputElement

  private async onChange(): Promise<void> {
    let files: QueelagFile[] = []

    for (let file of this.inputElement.files || []) {
      files.push(await deserializeFile(file, this.deserializeFileOptions))
      WebElementLogger.verbose(this.uid, 'onChange', `The file have been deserialized.`, files)
    }

    if (this.multiple) {
      this.value = files
      WebElementLogger.verbose(this.uid, 'onChange', `The files have been set as the value.`, files, this.value)
    }

    if (this.single && files.length <= 0) {
      this.value = QueelagFile.EMPTY
      WebElementLogger.verbose(this.id, 'onChange', `The files are empty, setting empty file as the value.`, files, this.value)
    }

    if (this.single && files.length > 0) {
      this.value = files[0] || QueelagFile.EMPTY
      WebElementLogger.verbose(this.id, 'onChange', `The first file has been set as the value.`, files, this.value)
    }

    this.touch()
  }

  removeFile(file: QueelagFile): void {
    this.inputElement.value = ''
    WebElementLogger.verbose(this.uid, 'removeFile', `The input element value has been reset.`)

    if (this.multiple) {
      this.value = this.value || []
      this.value = removeArrayItems(this.value as QueelagFile[], (_, { id }: QueelagFile) => id === file.id)
      WebElementLogger.verbose(this.uid, 'onClickRemoveFile', `The file has been removed.`, file, this.value)
    }

    if (this.single) {
      this.value = QueelagFile.EMPTY
      WebElementLogger.verbose(this.uid, 'onClickRemoveFile', `The value has been emptied.`, this.value)
    }

    this.touch()
  }

  open = (): void => {
    this.inputElement.click()
  }

  clear = (): void => {
    this.value = this.multiple ? [] : QueelagFile.EMPTY
    WebElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, this.value)

    this.inputElement.value = ''
    WebElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`)

    this.touch()
  }

  render() {
    if (this.native) {
      return html`<input @change=${this.onChange} ?disabled=${this.disabled} ?multiple=${this.multiple} ?readonly=${this.readonly} type="file" />`
    }

    return html`
      <input @change=${this.onChange} ?disabled=${this.disabled} ?multiple=${this.multiple} ?readonly=${this.readonly} type="file" />
      <slot></slot>
    `
  }

  private get deserializeFileOptions(): DeserializeFileOptions {
    return {
      resolveArrayBuffer: this.deserializeFileResolveArrayBuffer,
      resolveText: this.deserializeFileResolveText
    }
  }

  get name(): ElementName {
    return ElementName.INPUT_FILE
  }

  get file(): QueelagFile | undefined {
    if (this.multiple) {
      return undefined
    }

    return this.value as QueelagFile | undefined
  }

  get files(): QueelagFile[] {
    if (this.multiple) {
      return (this.value as QueelagFile[]) || []
    }

    return (this.value as QueelagFile)?.name ? [this.value as QueelagFile] : []
  }

  get single(): boolean {
    return !this.multiple
  }

  get value(): QueelagFile | QueelagFile[] | undefined {
    return super.value
  }

  set value(value: QueelagFile | QueelagFile[] | undefined) {
    super.value = value
  }

  get isFilesEmpty(): boolean {
    return this.files.length <= 0
  }

  get isFilesNotEmpty(): boolean {
    return !this.isFilesEmpty
  }

  static properties: PropertyDeclarations = {
    deserializeFileResolveArrayBuffer: { type: Boolean, attribute: 'deserialize-file-resolve-array-buffer', reflect: true },
    deserializeFileResolveText: { type: Boolean, attribute: 'deserialize-file-resolve-text', reflect: true },
    multiple: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host(:not([native])) {
        position: relative;
      }

      :host(:not([native])) input {
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 100%;
      }
    `
  ]
}

customElements.define('q-input-file', InputFileElement)

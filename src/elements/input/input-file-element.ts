import { AracnaFile, type DeserializeFileOptions, deserializeFile, isArray, removeArrayItems } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { InputFileElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-input-file': InputFileElement
  }
}

class InputFileElement<E extends InputFileElementEventMap = InputFileElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  deserializeFileResolveArrayBuffer?: boolean
  deserializeFileResolveText?: boolean
  multiple?: boolean

  /**
   * Queries
   */
  inputElement!: HTMLInputElement

  async onChange(): Promise<void> {
    let files: AracnaFile[] = []

    for (let file of this.inputElement.files ?? []) {
      files.push(await deserializeFile(file, this.deserializeFileOptions))
      ElementLogger.verbose(this.uid, 'onChange', `The file have been deserialized.`, files)
    }

    if (this.multiple) {
      this.value = files
      ElementLogger.verbose(this.uid, 'onChange', `The files have been set as the value.`, files, this.value)
    }

    if (this.single && files.length <= 0) {
      this.value = AracnaFile.EMPTY
      ElementLogger.verbose(this.id, 'onChange', `The files are empty, setting empty file as the value.`, files, this.value)
    }

    if (this.single && files.length > 0) {
      this.value = files[0] ?? AracnaFile.EMPTY
      ElementLogger.verbose(this.id, 'onChange', `The first file has been set as the value.`, files, this.value)
    }

    this.touch()
  }

  removeFile(file: AracnaFile): void {
    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'removeFile', `The input element value has been reset.`)

    if (this.multiple) {
      this.value = isArray(this.value) ? this.value : []
      this.value = removeArrayItems(this.value, (_, { id }: AracnaFile) => id === file.id)
      ElementLogger.verbose(this.uid, 'onClickRemoveFile', `The file has been removed.`, file, this.value)
    }

    if (this.single) {
      this.value = AracnaFile.EMPTY
      ElementLogger.verbose(this.uid, 'onClickRemoveFile', `The value has been emptied.`, this.value)
    }

    this.touch()
  }

  open = (): void => {
    this.inputElement.click()
  }

  clear = (): void => {
    this.value = undefined
    ElementLogger.verbose(this.uid, 'clear', `The value has been reset.`, [this.value])

    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`)

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

  get deserializeFileOptions(): DeserializeFileOptions {
    return {
      resolveArrayBuffer: this.deserializeFileResolveArrayBuffer,
      resolveText: this.deserializeFileResolveText
    }
  }

  get name(): ElementName {
    return ElementName.INPUT_FILE
  }

  get file(): AracnaFile | undefined {
    if (this.multiple) {
      return undefined
    }

    return this.value as AracnaFile | undefined
  }

  get files(): AracnaFile[] {
    if (this.multiple) {
      return (this.value as AracnaFile[]) || []
    }

    return (this.value as AracnaFile)?.name ? [this.value as AracnaFile] : []
  }

  get single(): boolean {
    return !this.multiple
  }

  get value(): AracnaFile | AracnaFile[] | undefined {
    return super.value
  }

  set value(value: AracnaFile | AracnaFile[] | undefined) {
    super.value = value
  }

  get isFilesEmpty(): boolean {
    return this.files.length <= 0
  }

  get isFilesNotEmpty(): boolean {
    return !this.isFilesEmpty
  }

  static properties: PropertyDeclarations = {
    deserializeFileResolveArrayBuffer: {
      type: Boolean,
      attribute: 'deserialize-file-resolve-array-buffer',
      reflect: true
    },
    deserializeFileResolveText: {
      type: Boolean,
      attribute: 'deserialize-file-resolve-text',
      reflect: true
    },
    multiple: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([native]) input {
        all: inherit;
      }

      :host(:not([native])) {
        position: relative;
      }

      :host(:not([native])) input {
        cursor: pointer;
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-input-file', InputFileElement)

export { InputFileElement as AracnaInputFileElement }

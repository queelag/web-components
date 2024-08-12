import { AracnaFile, type DeserializeFileOptions, deserializeFile, isArray, removeArrayItems } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { InputFileElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ifdef } from '../../directives/if-defined.js'
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
  /** */
  accept?: string
  deserializeFileResolveArrayBuffer?: boolean
  deserializeFileResolveText?: boolean
  multiple?: boolean

  /**
   * Queries
   */
  /** */
  inputElement!: HTMLInputElement

  async onChange(): Promise<void> {
    let files: AracnaFile[] = []

    for (let f of this.inputElement.files ?? []) {
      let file: AracnaFile

      file = await deserializeFile(f, this.deserializeFileOptions)
      ElementLogger.verbose(this.uid, 'onChange', `The file has been deserialized.`, file)

      files.push(file)
      ElementLogger.verbose(this.uid, 'onChange', `The file has been added to the files.`, file, files)
    }

    if (this.multiple) {
      ElementLogger.verbose(this.uid, 'onChange', `Setting the files as the value.`, files)
      this.setValue(files)
    }

    if (this.single && files.length <= 0) {
      ElementLogger.verbose(this.uid, 'onChange', `Clearing the value.`)
      this.clear()
    }

    if (this.single && files[0]) {
      ElementLogger.verbose(this.uid, 'onChange', `Setting the first file as the value.`, files[0])
      this.setValue(files[0])
    }

    ElementLogger.verbose(this.uid, 'onChange', `Touching.`)
    this.touch()
  }

  removeFile(file: AracnaFile): void {
    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'removeFile', `The input element value has been reset.`, [this.inputElement.value])

    if (this.multiple) {
      let value: AracnaFile[]

      value = isArray(this.value) ? this.value : []
      value = removeArrayItems(value, (_, { id }: AracnaFile) => id === file.id)

      ElementLogger.verbose(this.uid, 'removeFile', `Removing the file from the value.`, file)
      this.setValue(value)
    }

    if (this.single) {
      ElementLogger.verbose(this.uid, 'removeFile', `Clearing the value.`)
      this.clear()
    }

    ElementLogger.verbose(this.uid, 'removeFile', `Touching.`)
    this.touch()
  }

  open = (): void => {
    ElementLogger.verbose(this.uid, 'open', `Clicking the input element.`)
    this.inputElement.click()
  }

  clear = (): void => {
    super.clear()

    this.inputElement.value = ''
    ElementLogger.verbose(this.uid, 'clear', `The input element value has been reset.`, [this.inputElement.value])

    ElementLogger.verbose(this.uid, 'clear', `Touching.`)
    this.touch()
  }

  render() {
    if (this.native) {
      return html`<input
        accept=${ifdef(this.accept)}
        @change=${this.onChange}
        ?disabled=${this.disabled}
        ?multiple=${this.multiple}
        ?readonly=${this.readonly}
        type="file"
      />`
    }

    return html`
      <input
        accept=${ifdef(this.accept)}
        @change=${this.onChange}
        ?disabled=${this.disabled}
        ?multiple=${this.multiple}
        ?readonly=${this.readonly}
        type="file"
      />
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
    accept: { type: String, reflect: true },
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

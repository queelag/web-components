import { AracnaFile, type DeserializeFileOptions, deserializeFile, isArray, removeArrayItems, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { InputFileClearElementEventMap, InputFileElementEventMap, InputFileRemoveElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-input-file': InputFileElement
    'aracna-input-file-clear': InputFileClearElement
    'aracna-input-file-remove': InputFileRemoveElement
  }
}

class InputFileElement<E extends InputFileElementEventMap = InputFileElementEventMap> extends FormControlElement<E> {
  /**
   * Properties
   */
  /** */
  deserializeFileResolveArrayBuffer?: boolean
  deserializeFileResolveText?: boolean
  multiple?: boolean
  placeholder?: string

  /**
   * Queries
   */
  /** */
  inputElement!: HTMLInputElement

  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.inputElement, 4).then(() => {
      this.setInputElementAttributes()
      this.inputElement.addEventListener('change', this.onChange)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'multiple', 'readonly'].includes(name)) {
      this.setInputElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.inputElement?.removeEventListener('change', this.onChange)
  }

  setInputElementAttributes = (): void => {
    this.inputElement.disabled = Boolean(this.disabled)
    this.inputElement.multiple = Boolean(this.multiple)
    this.inputElement.readOnly = Boolean(this.readonly)
    this.inputElement.type = 'file'
  }

  onChange = async (): Promise<void> => {
    let files: AracnaFile[] = []

    for (let f of this.inputElement?.files ?? []) {
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
    multiple: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        position: relative;
      }
    `
  ]
}

class InputFileRemoveElement<E extends InputFileRemoveElementEventMap = InputFileRemoveElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  file!: AracnaFile

  /**
   * Queries
   */
  /** */
  rootElement!: InputFileElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The input is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onClick', `Removing the file...`, [this.file])
    this.rootElement.removeFile(this.file)
  }

  get name(): ElementName {
    return ElementName.INPUT_FILE_REMOVE
  }

  static properties: PropertyDeclarations = {
    item: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-input-file', closest: true }
  }
}

class InputFileClearElement<E extends InputFileClearElementEventMap = InputFileClearElementEventMap> extends BaseElement<E> {
  /**
   * Queries
   */
  /** */
  rootElement!: InputFileElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The input is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onClick', `Clearing the value...`)
    this.rootElement.clear()
  }

  get name(): ElementName {
    return ElementName.INPUT_FILE_CLEAR
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-input-file', closest: true }
  }
}

defineCustomElement('aracna-input-file', InputFileElement)
defineCustomElement('aracna-input-file-clear', InputFileClearElement)
defineCustomElement('aracna-input-file-remove', InputFileRemoveElement)

export {
  InputFileClearElement as AracnaInputFileClearElement,
  InputFileElement as AracnaInputFileElement,
  InputFileRemoveElement as AracnaInputFileRemoveElement
}

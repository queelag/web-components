import { defineCustomElement } from '@aracna/web'
import { html, type PropertyDeclarations } from 'lit'
import {
  type BitMatrix,
  create,
  type GeneratedQRCodeSegment,
  type QRCode,
  type QRCodeErrorCorrectionLevel,
  type QRCodeMaskPattern,
  type QRCodeToSJISFunc
} from 'qrcode'
import { ElementSlug } from '../../definitions/enums.js'
import type { QrCodeElementEventMap } from '../../definitions/events.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-qrcode': QrCodeElement
  }
}

class QrCodeElement<E extends QrCodeElementEventMap = QrCodeElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  protected _backgroundColor?: string
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel
  protected _foregroundColor?: string
  margin?: number
  maskPattern?: QRCodeMaskPattern
  text?: string
  toSJIS?: QRCodeToSJISFunc
  version?: number

  /**
   * Internals
   */
  /** */
  modules?: BitMatrix
  segments?: GeneratedQRCodeSegment[]

  connectedCallback(): void {
    super.connectedCallback()
    this.create()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['errorCorrectionLevel', 'maskPattern', 'text', 'toSJIS', 'version'].includes(name)) {
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Creating.`)
      this.create()
    }
  }

  create(): void {
    let qrcode: QRCode

    if (typeof this.text === 'undefined') {
      return ElementLogger.warn(this.uid, 'create', `The text is undefined.`)
    }

    qrcode = create(this.text, {
      errorCorrectionLevel: this.errorCorrectionLevel,
      maskPattern: this.maskPattern,
      toSJISFunc: this.toSJIS,
      version: this.version
    })

    this.modules = qrcode.modules
    this.segments = qrcode.segments

    ElementLogger.verbose(this.uid, 'create', `The modules and segments have been set.`, this.modules, this.segments)
  }

  render() {
    return html`
      <svg height=${this.styleInfo.height} shape-rendering="crispEdges" viewBox=${this.svgElementViewBox} width=${this.styleInfo.width}>
        <path d=${this.backgroundPathElementD} fill=${this.backgroundColor}></path>
        <path d=${this.foregroundPathElementD} stroke=${this.foregroundColor}></path>
      </svg>
    `
  }

  get backgroundColor(): string {
    return this._backgroundColor ?? '#FFF'
  }

  set backgroundColor(value: string) {
    let old: string | undefined

    old = this._backgroundColor
    this._backgroundColor = value

    this.requestUpdate('backgroundColor', old)
  }

  get backgroundPathElementD(): string {
    let size: number = (this.modules?.size ?? 0) + (this.margin ?? 0) * 2

    return `M0 0h${size}v${size}H0z`
  }

  get foregroundColor(): string {
    return this._foregroundColor ?? '#000'
  }

  set foregroundColor(value: string) {
    let old: string | undefined

    old = this._foregroundColor
    this._foregroundColor = value

    this.requestUpdate('foregroundColor', old)
  }

  get foregroundPathElementD(): string | undefined {
    if (typeof this.modules === 'undefined') {
      return undefined
    }

    return getQrCodeSvgPath(this.modules, this.margin)
  }

  get slug(): ElementSlug {
    return ElementSlug.QR_CODE
  }

  get svgElementViewBox(): string {
    let size: number = (this.modules?.size ?? 0) + (this.margin ?? 0) * 2

    return `0 0 ${size} ${size}`
  }

  static properties: PropertyDeclarations = {
    backgroundColor: { type: String, reflect: true, attribute: 'background-color' },
    errorCorrectionLevel: { type: String, reflect: true, attribute: 'error-correction-level' },
    foregroundColor: { type: String, reflect: true, attribute: 'foreground-color' },
    margin: { type: Number, reflect: true },
    maskPattern: { type: Number, reflect: true, attribute: 'mask-pattern' },
    modules: { type: Object, state: true },
    segments: { type: Array, state: true },
    text: { type: String, reflect: true },
    toSJIS: { type: Function, attribute: 'to-sjis' },
    version: { type: Number, reflect: true }
  }
}

function svgCmd(cmd: string, x: number, y?: number) {
  let str: string = cmd + x

  if (typeof y !== 'undefined') {
    str += ' ' + y
  }

  return str
}

function getQrCodeSvgPath(modules: BitMatrix, margin: number = 0) {
  let data: Uint8Array<ArrayBuffer>, size: number, path: string, moveBy: number, newRow: boolean, lineLength: number

  data = modules.data as Uint8Array<ArrayBuffer>
  size = modules.size

  path = ''
  moveBy = 0
  newRow = false
  lineLength = 0

  for (let i = 0; i < data.length; i++) {
    let col: number, row: number

    col = Math.floor(i % size)
    row = Math.floor(i / size)

    if (!col && !newRow) {
      newRow = true
    }

    if (data[i]) {
      lineLength++

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow ? svgCmd('M', col + margin, 0.5 + row + margin) : svgCmd('m', moveBy, 0)

        moveBy = 0
        newRow = false
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength)
        lineLength = 0
      }

      continue
    }

    moveBy++
  }

  return path
}

defineCustomElement('aracna-qrcode', QrCodeElement)

export { QrCodeElement as AracnaQrCodeElement }

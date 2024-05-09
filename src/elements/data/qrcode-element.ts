import { BaseElementEventMap, defineCustomElement, ElementName } from '@aracna/web'
import { html, PropertyDeclarations } from 'lit'
import { BitMatrix, create, GeneratedQRCodeSegment, QRCode, QRCodeErrorCorrectionLevel, QRCodeMaskPattern, QRCodeToSJISFunc } from 'qrcode'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-qrcode': QrCodeElement
  }
}

export class QrCodeElement<E extends BaseElementEventMap = BaseElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  /** */
  backgroundColor?: string
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel
  foregroundColor?: string
  margin?: number
  maskPattern?: QRCodeMaskPattern
  text?: string
  toSJIS?: QRCodeToSJISFunc
  version?: number

  /**
   * Internal
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
      this.create()
    }
  }

  create(): void {
    let qrcode: QRCode

    if (typeof this.text === 'undefined') {
      return
    }

    qrcode = create(this.text, {
      errorCorrectionLevel: this.errorCorrectionLevel,
      maskPattern: this.maskPattern,
      toSJISFunc: this.toSJIS,
      version: this.version
    })

    this.modules = qrcode.modules
    this.segments = qrcode.segments
  }

  render() {
    return html`
      <svg height=${this.styleInfo.height} shape-rendering="crispEdges" viewBox=${this.svgElementViewBox} width=${this.styleInfo.width}>
        <path d=${this.backgroundPathElementD} fill=${this.backgroundColor ?? '#FFF'}></path>
        <path d=${this.foregroundPathElementD} stroke=${this.foregroundColor ?? '#000'}></path>
      </svg>
    `
  }

  get backgroundPathElementD(): string {
    let size: number = (this.modules?.size ?? 0) + (this.margin ?? 0) * 2

    return `M0 0h${size}v${size}H0z`
  }

  get foregroundPathElementD(): string | undefined {
    if (typeof this.modules === 'undefined') {
      return undefined
    }

    return getQrCodeSvgPath(this.modules, this.margin)
  }

  get name(): ElementName {
    return ElementName.BASE
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
  let data: Uint8Array, size: number, path: string, moveBy: number, newRow: boolean, lineLength: number

  data = modules.data
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

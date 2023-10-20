import { getElementStyleCompatibleValue, getSquircleClipPathID, Shape, ShapeOptions } from '@aracna/web'
import { StyleInfo } from 'lit-html/directives/style-map.js'

export function getShapeStyleInfo(shape?: Shape, options?: ShapeOptions): StyleInfo {
  switch (shape) {
    case 'circle':
      return { borderRadius: '9999px' }
    case 'rectangle':
      return { borderRadius: getElementStyleCompatibleValue(options?.rectangle?.radius) }
    case 'square':
      return { borderRadius: getElementStyleCompatibleValue(options?.square?.radius) }
    case 'squircle':
      return { clipPath: `url(#${getSquircleClipPathID(options?.squircle?.size ?? 0, options?.squircle?.curvature)})` }
    default:
      return {}
  }
}

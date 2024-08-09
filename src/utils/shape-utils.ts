import { getElementStyleCompatibleValue } from '@aracna/web'
import type { StyleInfo } from 'lit/directives/style-map.js'
import type { ShapeOptions } from '../definitions/interfaces.js'
import type { Shape } from '../definitions/types.js'
import { getSquircleClipPathID } from './squircle-utils.js'

export function getShapeStyleInfo(shape?: Shape, options?: ShapeOptions): StyleInfo {
  switch (shape) {
    case 'circle':
      return { borderRadius: '9999px' }
    case 'rectangle':
      return {
        borderRadius: getElementStyleCompatibleValue(options?.rectangle?.radius)
      }
    case 'square':
      return {
        borderRadius: getElementStyleCompatibleValue(options?.square?.radius)
      }
    case 'squircle':
      return {
        clipPath: `url(#${getSquircleClipPathID(options?.squircle?.size ?? 0, options?.squircle?.curvature)})`
      }
    default:
      return {}
  }
}

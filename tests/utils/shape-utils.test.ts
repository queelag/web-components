import { DEFAULT_SQUIRCLE_CURVATURE, getSquircleClipPathID } from '@aracna/web'
import { describe, expect, it } from 'vitest'
import { getShapeStyleInfo } from '../../src/utils/shape-utils'

describe('ShapeUtils', () => {
  it('gets shape style info', () => {
    expect(getShapeStyleInfo('circle')).toStrictEqual({ borderRadius: '9999px' })
    expect(getShapeStyleInfo('rectangle')).toStrictEqual({ borderRadius: undefined })
    expect(getShapeStyleInfo('rectangle', { rectangle: { radius: 5 } })).toStrictEqual({ borderRadius: '5px' })
    expect(getShapeStyleInfo('square')).toStrictEqual({ borderRadius: undefined })
    expect(getShapeStyleInfo('square', { square: { radius: 5 } })).toStrictEqual({ borderRadius: '5px' })
    expect(getShapeStyleInfo('squircle', { squircle: {} })).toStrictEqual({ clipPath: `url(#${getSquircleClipPathID(0, DEFAULT_SQUIRCLE_CURVATURE)})` })
    expect(getShapeStyleInfo('squircle', { squircle: { curvature: 0.5, size: 16 } })).toStrictEqual({ clipPath: `url(#${getSquircleClipPathID(16, 0.5)})` })
  })
})

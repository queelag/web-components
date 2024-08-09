import type { GetNumberPercentageOptions } from '@aracna/core'
import type { Config as SanitizeConfig } from 'dompurify'

export interface AppendSquircleElementOptions extends CreateSquircleElementOptions {}

export interface CreateSquircleElementOptions {
  curvature?: number
  size?: number
}

export interface GetSliderThumbElementPercentageOptions extends GetNumberPercentageOptions {
  decimals?: number
}

export interface GetSquircleElementOptions extends CreateSquircleElementOptions {}

export interface IconElementSanitizeConfig extends SanitizeConfig {
  RETURN_DOM?: false
  RETURN_DOM_FRAGMENT?: false
}

export interface QueryDeclaration {
  all?: boolean
  closest?: boolean
  selector: string
  shadow?: boolean
}

export interface QueryDeclarations extends Record<string, QueryDeclaration> {}

export interface ShapeOptions {
  rectangle?: {
    radius?: string | number
  }
  square?: {
    radius?: string | number
  }
  squircle?: {
    curvature?: number
    size?: number
  }
}

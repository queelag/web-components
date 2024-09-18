import type { FocusTargetValueOrFalse, KeyboardEventToBoolean, MouseEventToBoolean } from 'focus-trap'
import type { Struct, StructError } from 'superstruct'

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning'
export type AlertVariant = 'fill' | 'fill-tonal' | 'opacity' | 'outline' | 'text'
export type AriaComboBoxElementAutoComplete = 'none' | 'inline' | 'list' | 'both'
export type AriaComboBoxElementFilterOptionsPredicate<T> = (option: T, index: number, options: T[], inputElementValue: string) => boolean
export type AriaLive = 'off' | 'polite' | 'assertive'

export type ButtonPressed = 'false' | 'mixed' | 'true'
export type ButtonType = 'button' | 'menu' | 'reset' | 'submit'
export type ButtonVariant = 'fill' | 'fill-tonal' | 'opacity' | 'outline' | 'text'

export type ChipElementVariant = 'assist' | 'filter' | 'input' | 'suggestion'

export type Direction = 'down' | 'left' | 'right' | 'up'
export type DirectionHorizontal = 'left' | 'right'
export type DirectionVertical = 'down' | 'up'

export type FocusTrapAllowOutsideClick = boolean | MouseEventToBoolean
export type FocusTrapCheckCanFocusTrap = (containers: Array<HTMLElement | SVGElement>) => Promise<void>
export type FocusTrapCheckCanReturnFocus = (trigger: HTMLElement | SVGElement) => Promise<void>
export type FocusTrapClickOutsideDeactivates = boolean | MouseEventToBoolean
export type FocusTrapDisplayCheck = 'full' | 'legacy-full' | 'non-zero-area' | 'none'
export type FocusTrapEscapeDeactivates = boolean | KeyboardEventToBoolean
export type FocusTrapGetShadowRoot = boolean | ((node: HTMLElement | SVGElement) => ShadowRoot | boolean | undefined)
export type FocusTrapSetReturnFocus = FocusTargetValueOrFalse | ((nodeFocusedBeforeActivation: HTMLElement | SVGElement) => FocusTargetValueOrFalse)
export type FocusTrapElementState = 'activating' | 'activated' | 'deactivating' | 'deactivated'

export type FormControlElementSchema = Struct<any, any> | undefined
export type FormControlElementTarget = Record<PropertyKey, any>
export type FormControlElementValidation = [StructError | undefined, any]

export type GetRadioButtonLabel<T> = (button: T) => string | undefined
export type GetRadioButtonValue<T> = (button: T) => unknown

export type GetSelectOptionLabel<T> = (option: T) => string | undefined
export type GetSelectOptionValue<T> = (option: T) => unknown

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ImageElementCrossOrigin = 'anonymous' | 'use-credentials'
export type ImageElementStatus = 'idle' | 'fetching' | 'loaded' | 'error'

export type InputElementTouchTrigger = 'blur' | 'input'

export type InputElementType =
  | 'buffer'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'

export type InputElementValue = Date | number | string | string[] | Uint8Array | undefined

export type Layer = 0 | 1 | 2 | 3
export type Orientation = 'horizontal' | 'vertical'
export type Shape = 'circle' | 'pill' | 'rectangle' | 'square' | 'squircle'
export type Size = number | string

export type TextAreaElementTouchTrigger = 'blur' | 'input'
export type TextAreaElementValue = string | string[] | undefined

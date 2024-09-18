import type { AracnaFile, Localization, LocalizationVariables, TypeaheadPredicate } from '@aracna/core'
import type { CanvasDataURLType } from '@aracna/web'
import type { Middleware, Placement, Platform, Strategy } from '@floating-ui/dom'
import type { FocusTarget, FocusTargetOrFalse } from 'focus-trap'
import type { QRCodeErrorCorrectionLevel, QRCodeMaskPattern, QRCodeToSJISFunc } from 'qrcode'
import type { HeadingElementSanitizeConfig, IconElementSanitizeConfig, TextElementSanitizeConfig } from './interfaces.js'
import type {
  AlertSeverity,
  AlertVariant,
  AriaComboBoxElementAutoComplete,
  ButtonPressed,
  ButtonType,
  ButtonVariant,
  ChipElementVariant,
  FocusTrapAllowOutsideClick,
  FocusTrapCheckCanFocusTrap,
  FocusTrapCheckCanReturnFocus,
  FocusTrapClickOutsideDeactivates,
  FocusTrapDisplayCheck,
  FocusTrapEscapeDeactivates,
  FocusTrapSetReturnFocus,
  FormControlElementSchema,
  FormControlElementTarget,
  HeadingLevel,
  InputElementTouchTrigger,
  InputElementType,
  InputElementValue,
  Layer,
  Orientation,
  Shape,
  Size,
  TextAreaElementTouchTrigger
} from './types.js'

/**
 * ARIA Elements
 */
/** */

export interface AriaAccordionElementAttributes extends BaseElementAttributes {
  'allow-only-one-expanded-section'?: boolean
}

export interface AriaAccordionHeaderElementAttributes extends BaseElementAttributes {
  level?: HeadingLevel
}

export interface AriaAccordionButtonElementAttributes extends BaseElementAttributes {}
export interface AriaAccordionPanelElementAttributes extends BaseElementAttributes {}

export interface AriaAccordionSectionElementAttributes extends BaseElementAttributes {
  expanded?: boolean
  uncollapsible?: boolean
}

export interface AriaAlertElementAttributes extends BaseElementAttributes {}

export interface AriaAlertDialogElementAttributes extends AriaDialogElementAttributes {}
export interface AriaAlertDialogDescriptionElementAttributes extends AriaDialogDescriptionElementAttributes {}
export interface AriaAlertDialogLabelElementAttributes extends AriaDialogLabelElementAttributes {}

export interface AriaBreadcrumbElementAttributes extends BaseElementAttributes {}
export interface AriaBreadcrumbListElementAttributes extends BaseElementAttributes {}

export interface AriaBreadcrumbItemElementAttributes extends BaseElementAttributes {
  current?: boolean
}

export interface AriaButtonElementAttributes extends BaseElementAttributes {
  disabled?: boolean
  label?: string
  pressed?: ButtonPressed
}

export interface AriaCarouselElementAttributes extends BaseElementAttributes {
  'automatic-rotation'?: boolean
  'automatic-rotation-interval-time'?: number
  'infinite-rotation'?: boolean
  label?: string
  'reverse-rotation'?: boolean
}

export interface AriaCarouselNextSlideControlElementAttributes extends BaseElementAttributes {}
export interface AriaCarouselPreviousSlideControlElementAttributes extends BaseElementAttributes {}
export interface AriaCarouselRotationControlElementAttributes extends BaseElementAttributes {}

export interface AriaCarouselSlideElementAttributes extends BaseElementAttributes {
  active?: boolean
}

export interface AriaCarouselSlidesElementAttributes extends BaseElementAttributes {}

export interface AriaCarouselTabElementAttributes extends BaseElementAttributes {
  active?: boolean
}

export interface AriaCarouselTabsElementAttributes extends BaseElementAttributes {}

export interface AriaCheckBoxElementAttributes extends FormControlElementAttributes {
  checked?: boolean
  disabled?: boolean
  readonly?: boolean
}

export interface AriaComboBoxElementAttributes<T> extends FormControlElementAttributes, TypeaheadElementAttributes<T> {
  autocomplete?: AriaComboBoxElementAutoComplete
  expanded?: boolean
  multiple?: boolean
  'scroll-into-view-options'?: ScrollIntoViewOptions
}

export interface AriaComboBoxButtonElementAttributes extends BaseElementAttributes {}
export interface AriaComboBoxClearElementAttributes extends BaseElementAttributes {}
export interface AriaComboBoxGroupElementAttributes extends BaseElementAttributes {}
export interface AriaComboBoxInputElementAttributes extends BaseElementAttributes {}
export interface AriaComboBoxListElementAttributes extends FloatingElementAttributes {}

export interface AriaComboBoxOptionElementAttributes extends BaseElementAttributes {
  focused?: boolean
  label?: string
  selected?: boolean
  value?: any
}

export interface AriaComboBoxOptionRemoveElementAttributes extends BaseElementAttributes {
  value?: any
}

export interface AriaDialogElementAttributes extends FocusTrapElementAttributes {
  'lock-body-scroll'?: boolean
  visible?: boolean
}

export interface AriaDialogDescriptionElementAttributes extends BaseElementAttributes {}
export interface AriaDialogLabelElementAttributes extends BaseElementAttributes {}

export interface AriaDisclosureElementAttributes extends BaseElementAttributes {}
export interface AriaDisclosureButtonElementAttributes extends BaseElementAttributes {}
export interface AriaDisclosurePanelElementAttributes extends BaseElementAttributes {}

export interface AriaDisclosureSectionElementAttributes extends BaseElementAttributes {
  expanded?: boolean
}

export interface AriaFeedElementAttributes extends BaseElementAttributes {
  busy?: boolean
}

export interface AriaFeedArticleElementAttributes extends BaseElementAttributes {
  focused?: boolean
}

export interface AriaFeedArticleDescriptionElementAttributes extends BaseElementAttributes {}
export interface AriaFeedArticleLabelElementAttributes extends BaseElementAttributes {}

export interface AriaHeadingElementAttributes extends BaseElementAttributes {
  level?: HeadingLevel
}

export interface AriaLinkElementAttributes extends BaseElementAttributes {
  href?: string
  target?: string
}

export interface AriaListElementAttributes extends BaseElementAttributes {}
export interface AriaListItemElementAttributes extends BaseElementAttributes {}

export interface AriaListBoxElementAttributes<T> extends TypeaheadElementAttributes<T> {
  multiple?: boolean
  'select-first-option-on-focus'?: boolean
  'selection-follows-focus'?: boolean
}

export interface AriaListBoxOptionElementAttributes extends BaseElementAttributes {
  focused?: boolean
  selected?: boolean
  value?: any
}

export interface AriaMenuElementAttributes<T> extends TypeaheadElementAttributes<T> {
  'collapse-debounce-time'?: number
  'collapse-on-mouse-leave'?: boolean
  'expand-on-mouse-enter'?: boolean
  label?: string
}

export interface AriaMenuButtonElementAttributes extends BaseElementAttributes {}

export interface AriaMenuItemElementAttributes extends BaseElementAttributes {
  focused?: boolean
  headline?: string
}

export interface AriaMenuSubMenuElementAttributes extends FloatingElementAttributes {
  expanded?: boolean
}

export interface AriaMeterElementAttributes extends BaseElementAttributes {
  max?: number
  min?: number
  value?: number
}

export interface AriaRadioButtonElementAttributes extends BaseElementAttributes {
  checked?: boolean
  value?: any
}

export interface AriaRadioGroupElementAttributes extends BaseElementAttributes {}

export interface AriaSliderElementAttributes extends FormControlElementAttributes {
  decimals?: number
  'disable-swap'?: boolean
  max?: number
  min?: number
  'min-distance'?: number
  orientation?: Orientation
  step?: number
}

export interface AriaSliderThumbElementAttributes extends BaseElementAttributes {
  'default-value'?: number
  'disable-compute-position'?: boolean
  movable?: boolean
  value?: number
}

export interface AriaSwitchElementAttributes extends FormControlElementAttributes {
  on?: boolean
}

export interface AriaTabsElementAttributes extends BaseElementAttributes {
  'automatic-activation'?: boolean
}

export interface AriaTabsTabElementAttributes extends BaseElementAttributes {
  selected?: boolean
}

export interface AriaTabsPanelElementAttributes extends BaseElementAttributes {}

export interface AriaTooltipElementAttributes extends BaseElementAttributes {
  focusable?: boolean
  'show-on-mouse-enter'?: boolean
  visible?: boolean
}

export interface AriaTooltipArrowElementAttributes extends BaseElementAttributes {}
export interface AriaTooltipContentElementAttributes extends FloatingElementAttributes {}
export interface AriaTooltipTriggerElementAttributes extends BaseElementAttributes {}

/**
 * Core Elements
 */
/** */

export interface BaseElementAttributes {
  height?: number | string
  layer?: Layer
  shape?: Shape
  'shape-rectangle-radius'?: number
  'shape-square-radius'?: number
  'shape-squircle-curvature'?: number
  size?: Size
  width?: number | string
}

export interface FloatingElementAttributes extends BaseElementAttributes {
  'ancestor-scroll'?: boolean
  'ancestor-resize'?: boolean
  'animation-frame'?: boolean
  'arrow-padding'?: number
  'element-resize'?: boolean
  middlewares?: Middleware[]
  placement?: Placement
  platform?: Platform
  strategy?: Strategy
}

export interface FocusTrapElementAttributes extends BaseElementAttributes {
  'allow-outside-click'?: FocusTrapAllowOutsideClick
  'check-can-focus-trap'?: FocusTrapCheckCanFocusTrap
  'check-can-return-focus'?: FocusTrapCheckCanReturnFocus
  'click-outside-deactivates'?: FocusTrapClickOutsideDeactivates
  'delay-initial-focus'?: boolean
  'display-check'?: FocusTrapDisplayCheck
  // document?: Document
  'escape-deactivates'?: FocusTrapEscapeDeactivates
  'fallback-focus'?: FocusTarget
  // get-shadow-root?: FocusTrapGetShadowRoot
  'initial-focus'?: FocusTargetOrFalse
  'prevent-scroll'?: boolean
  'return-focus-on-deactivate'?: boolean
  'set-return-focus'?: FocusTrapSetReturnFocus
}

export interface FormControlElementAttributes extends BaseElementAttributes {
  disabled?: boolean
  focused?: boolean
  path?: string
  readonly?: boolean
  schema?: FormControlElementSchema
  target?: FormControlElementTarget
  touched?: boolean
  value?: any
}

export interface TypeaheadElementAttributes<T> extends BaseElementAttributes {
  'typeahead-debounce-time'?: number
  'typeahead-predicate'?: TypeaheadPredicate<T>
}

/**
 * Data Elements
 */
/** */

export interface AvatarElementAttributes extends BaseElementAttributes {
  icon?: string
  image?: string
  text?: string
}

export interface BadgeElementAttributes extends BaseElementAttributes {
  max?: number
  min?: number
  numeric?: boolean
  text?: string
}

export interface CarouselElementAttributes<T = any> extends AriaCarouselElementAttributes {
  slides?: T[]
}

export interface CarouselNextSlideControlElementAttributes extends AriaCarouselNextSlideControlElementAttributes {}
export interface CarouselPreviousSlideControlElementAttributes extends AriaCarouselPreviousSlideControlElementAttributes {}
export interface CarouselRotationControlElementAttributes extends AriaCarouselRotationControlElementAttributes {}
export interface CarouselSlideElementAttributes extends AriaCarouselSlideElementAttributes {}
export interface CarouselSlidesElementAttributes extends AriaCarouselSlidesElementAttributes {}
export interface CarouselTabElementAttributes extends AriaCarouselTabElementAttributes {}
export interface CarouselTabsElementAttributes extends AriaCarouselTabsElementAttributes {}

export interface ChipElementAttributes extends BaseElementAttributes {
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
  variant?: ChipElementVariant
}

export interface FeedElementAttributes<T = any> extends AriaFeedElementAttributes {
  articles?: T[]
}

export interface FeedArticleElementAttributes<T = any> extends AriaFeedArticleElementAttributes {
  buttons?: T[]
  headline?: string
  image?: string
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  subhead?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
}

export interface FeedArticleDescriptionElementAttributes extends AriaFeedArticleDescriptionElementAttributes {}
export interface FeedArticleLabelElementAttributes extends AriaFeedArticleLabelElementAttributes {}

export interface IconElementAttributes extends BaseElementAttributes {
  cache?: boolean
  color?: string
  fill?: string
  sanitize?: boolean
  'sanitize-config'?: IconElementSanitizeConfig
  src?: string
  stroke?: string
  'stroke-width'?: string | number
  'stroke-linecap'?: string
  'stroke-linejoin'?: string
}

export interface ImageElementAttributes extends BaseElementAttributes {
  alt?: string
  cache?: boolean
  'cache-quality'?: number
  'cache-type'?: CanvasDataURLType
  'cross-origin'?: string
  eager?: boolean
  lazy?: boolean
  placeholder?: string
  src?: string
}

export interface ListElementAttributes<T = any> extends AriaListElementAttributes {
  items: T[]
}

export interface ListItemElementAttributes extends AriaListItemElementAttributes {
  headline?: string
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
}

export interface QrCodeElementAttributes extends BaseElementAttributes {
  'background-color'?: string
  'error-correction-level'?: QRCodeErrorCorrectionLevel
  'foreground-color'?: string
  margin?: number
  'mask-pattern'?: QRCodeMaskPattern
  text?: string
  'to-sjis'?: QRCodeToSJISFunc
  version?: number
}

export interface TooltipElementAttributes extends AriaTooltipElementAttributes {}
export interface TooltipArrowElementAttributes extends AriaTooltipArrowElementAttributes {}
export interface TooltipContentElementAttributes extends AriaTooltipContentElementAttributes {}
export interface TooltipTriggerElementAttributes extends AriaTooltipTriggerElementAttributes {}

/**
 * Feedback Elements
 */
/** */

export interface AlertElementAttributes extends AriaAlertElementAttributes {
  closable?: boolean
  headline?: string
  icon?: string
  severity?: AlertSeverity
  text?: string
  variant?: AlertVariant
}

export interface AlertDialogElementAttributes extends DialogElementAttributes {}
export interface AlertDialogDescriptionElementAttributes extends DialogDescriptionElementAttributes {}
export interface AlertDialogLabelElementAttributes extends DialogLabelElementAttributes {}

export interface DialogElementAttributes extends AriaDialogElementAttributes {
  headline?: string
  icon?: string
  text?: string
}

export interface DialogDescriptionElementAttributes extends AriaDialogDescriptionElementAttributes {}
export interface DialogLabelElementAttributes extends AriaDialogLabelElementAttributes {}

export interface MeterElementAttributes extends AriaMeterElementAttributes {
  low?: number
  high?: number
  optimum?: number
  round?: boolean
}

/**
 * Input Elements
 */
/** */

export interface ButtonElementAttributes extends AriaButtonElementAttributes {
  async?: boolean
  icon?: string
  spinning?: boolean
  text?: string
  type?: ButtonType
  variant?: ButtonVariant
}

export interface ButtonGroupElementAttributes<T = any> extends BaseElementAttributes {
  buttons?: T[]
}

export interface CheckBoxElementAttributes extends AriaCheckBoxElementAttributes {
  value?: boolean
}

export interface FormElementAttributes<T = any> extends BaseElementAttributes {
  async?: boolean
  disabled?: boolean
  fields?: T[]
  spinning?: boolean
}

export interface InputElementAttributes extends FormControlElementAttributes {
  multiple?: boolean
  obscured?: boolean
  'touch-trigger'?: InputElementTouchTrigger
  type?: InputElementType
  value?: InputElementValue
}

export interface InputClearElementAttributes extends BaseElementAttributes {}

export interface InputItemRemoveElementAttributes extends BaseElementAttributes {
  item: string
}

export interface InputObscureElementAttributes extends BaseElementAttributes {}

export interface InputFileElementAttributes extends FormControlElementAttributes {
  accept?: string
  'deserialize-file-resolve-array-buffer'?: boolean
  'deserialize-file-resolve-text'?: boolean
  multiple?: boolean
}

export interface InputFileClearElementAttributes extends BaseElementAttributes {}

export interface InputFileRemoveElementAttributes extends BaseElementAttributes {
  file: AracnaFile
}

export interface ListBoxElementAttributes<T = any> extends AriaListBoxElementAttributes<T> {}

export interface ListBoxOptionElementAttributes extends AriaListBoxOptionElementAttributes {
  headline?: string
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
}

export interface RadioButtonElementAttributes extends AriaRadioButtonElementAttributes {
  headline?: string
  icon?: string
  text?: string
}

export interface RadioGroupElementAttributes<T = any> extends AriaRadioGroupElementAttributes {
  buttons?: T[]
}

export interface SelectElementAttributes<T, U = any> extends AriaComboBoxElementAttributes<T> {
  options?: U[]
  value?: any
}

export interface SelectButtonElementAttributes extends AriaComboBoxButtonElementAttributes {}
export interface SelectGroupElementAttributes extends AriaComboBoxGroupElementAttributes {}
export interface SelectInputElementAttributes extends AriaComboBoxInputElementAttributes {}
export interface SelectListElementAttributes extends AriaComboBoxListElementAttributes {}

export interface SelectOptionElementAttributes extends AriaComboBoxOptionElementAttributes {
  headline?: string
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
}

export interface SliderElementAttributes<T = any> extends AriaSliderElementAttributes {
  thumbs?: T[]
  value?: number | number[]
}

export interface SliderThumbElementAttributes extends AriaSliderThumbElementAttributes {}

export interface SwitchElementAttributes extends AriaSwitchElementAttributes {
  value?: boolean
}

export interface TextAreaElementAttributes extends FormControlElementAttributes {
  autosize?: boolean
  multiple?: boolean
  'touch-trigger'?: TextAreaElementTouchTrigger
}

export interface TextAreaClearElementAttributes extends BaseElementAttributes {}

export interface TextAreaItemRemoveElementAttributes extends BaseElementAttributes {
  item: string
}

/**
 * Layout Elements
 */
/** */

export interface DividerElementAttributes extends BaseElementAttributes {
  orientation?: Orientation
}

/**
 * Navigation Elements
 */
/** */

export interface BreadcrumbElementAttributes<T = any> extends AriaBreadcrumbElementAttributes {
  items?: T[]
}

export interface BreadcrumbItemElementAttributes extends AriaBreadcrumbItemElementAttributes {
  headline?: string
  href?: string
  icon?: string
}

export interface BreadcrumbListElementAttributes extends AriaBreadcrumbListElementAttributes {}

export interface MenuElementAttributes<T, U = any> extends AriaMenuElementAttributes<T> {
  items?: U[]
}

export interface MenuButtonElementAttributes extends AriaMenuButtonElementAttributes {}

export interface MenuItemElementAttributes<T = any> extends AriaMenuItemElementAttributes {
  headline?: string
  items?: T[]
  'leading-icon'?: string
  'leading-image'?: string
  'leading-text'?: string
  text?: string
  'trailing-icon'?: string
  'trailing-image'?: string
  'trailing-text'?: string
}

export interface MenuSubMenuElementAttributes extends AriaMenuSubMenuElementAttributes {}

export interface NavigationBarElementAttributes<T = any> extends BaseElementAttributes {
  'active-item'?: string
  items?: T[]
}

export interface NavigationBarItemElementAttributes extends BaseElementAttributes {
  active?: boolean
  badge?: boolean
  'badge-text'?: string
  icon?: string
  text?: string
}

export interface NavigationRailElementAttributes<T = any> extends BaseElementAttributes {
  'active-item'?: string
  items?: T[]
}

export interface NavigationRailItemElementAttributes extends BaseElementAttributes {
  active?: boolean
  badge?: boolean
  'badge-text'?: string
  icon?: string
  text?: string
}

export interface TabsElementAttributes<T = any> extends AriaTabsElementAttributes {
  tabs?: T[]
}

export interface TabsPanelElementAttributes extends AriaTabsPanelElementAttributes {}
export interface TabsTabElementAttributes extends AriaTabsTabElementAttributes {}

/**
 * Surface Elements
 */
/** */

export interface AccordionElementAttributes<T = any> extends AriaAccordionElementAttributes {
  sections?: T[]
}

export interface AccordionButtonElementAttributes extends AriaAccordionButtonElementAttributes {}
export interface AccordionHeaderElementAttributes extends AriaAccordionHeaderElementAttributes {}
export interface AccordionPanelElementAttributes extends AriaAccordionPanelElementAttributes {}

export interface AccordionSectionElementAttributes extends AriaAccordionSectionElementAttributes {
  headline?: string
  icon?: string
  text?: string
}

export interface CardElementAttributes extends BaseElementAttributes {
  headline?: string
  image?: string
  subhead?: string
  text?: string
}

export interface DisclosureElementAttributes<T = any> extends AriaDisclosureElementAttributes {
  sections?: T[]
}

export interface DisclosureButtonElementAttributes extends AriaDisclosureButtonElementAttributes {}
export interface DisclosurePanelElementAttributes extends AriaDisclosurePanelElementAttributes {}

export interface DisclosureSectionElementAttributes extends AriaDisclosureSectionElementAttributes {
  headline?: string
  icon?: string
  text?: string
}

/**
 * Typography Elements
 */
/** */

export interface HeadingElementAttributes extends AriaHeadingElementAttributes, TextElementAttributes {
  'sanitize-config'?: HeadingElementSanitizeConfig
}

export interface TextElementAttributes extends BaseElementAttributes {
  localization?: Localization
  path?: string
  'sanitize-config'?: TextElementSanitizeConfig
  variables?: LocalizationVariables
}

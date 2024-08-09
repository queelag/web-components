import type { AttributeChangeEvent } from '../events/attribute-change-event.js'
import type { ButtonClickEvent } from '../events/button-click-event.js'
import type { CarouselSlideActivateEvent } from '../events/carousel-slide-activate-event.js'
import type { CarouselSlideDeactivateEvent } from '../events/carousel-slide-deactivate-event.js'
import type { ComboBoxCollapseEvent } from '../events/combo-box-collapse-event.js'
import type { ComboBoxExpandEvent } from '../events/combo-box-expand-event.js'
import type { ComboBoxOptionSelectEvent } from '../events/combo-box-option-select-event.js'
import type { DialogCloseEvent } from '../events/dialog-close-event.js'
import type { DialogOpenEvent } from '../events/dialog-open-event.js'
import type { FocusTrapActivateEvent } from '../events/focus-trap-activate-event.js'
import type { FocusTrapDeactivateEvent } from '../events/focus-trap-deactivate-event.js'
import type { FocusTrapPostActivateEvent } from '../events/focus-trap-post-activate-event.js'
import type { FocusTrapPostDeactivateEvent } from '../events/focus-trap-post-deactivate-event.js'
import type { FormSubmitEvent } from '../events/form-submit-event.js'
import type { ListBoxOptionSelectEvent } from '../events/list-box-option-select-event.js'
import type { SliderChangeEvent } from '../events/slider-change-event.js'
import type { SliderThumbMoveEvent } from '../events/slider-thumb-move-event.js'
import type { StateChangeEvent } from '../events/state-change-event.js'
import type { TabsTabSelectionEvent } from '../events/tabs-tab-selection-event.js'

/**
 * ARIA Elements Events
 */
/** */

export interface AriaAccordionElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionButtonElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionHeaderElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionPanelElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionSectionElementEventMap extends BaseElementEventMap {}

export interface AriaAlertElementEventMap extends BaseElementEventMap {}

export interface AriaAlertDialogElementEventMap extends AriaDialogElementEventMap {}
export interface AriaAlertDialogDescriptionElementEventMap extends AriaDialogDescriptionElementEventMap {}
export interface AriaAlertDialogLabelElementEventMap extends AriaDialogLabelElementEventMap {}

export interface AriaBreadcrumbElementEventMap extends BaseElementEventMap {}
export interface AriaBreadcrumbListElementEventMap extends BaseElementEventMap {}
export interface AriaBreadcrumbItemElementEventMap extends BaseElementEventMap {}

export interface AriaButtonElementEventMap extends BaseElementEventMap {}

export interface AriaCarouselElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselNextSlideControlElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselPreviousSlideControlElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselRotationControlElementEventMap extends BaseElementEventMap {}

export interface AriaCarouselSlideElementEventMap extends BaseElementEventMap {
  'carousel-slide-activate': CarouselSlideActivateEvent<any>
  'carousel-slide-deactive': CarouselSlideDeactivateEvent<any>
}

export interface AriaCarouselSlidesElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselTabElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselTabsElementEventMap extends BaseElementEventMap {}

export interface AriaCheckBoxElementEventMap extends FormControlElementEventMap {}

export interface AriaComboBoxElementEventMap extends FormControlElementEventMap {
  'combo-box-collapse': ComboBoxCollapseEvent
  'combo-box-expand': ComboBoxExpandEvent
}

export interface AriaComboBoxButtonElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxGroupElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxInputElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxListElementEventMap extends FloatingElementEventMap {}

export interface AriaComboBoxOptionElementEventMap extends BaseElementEventMap {
  'combo-box-option-select': ComboBoxOptionSelectEvent<any>
}

export interface AriaDialogElementEventMap extends FocusTrapElementEventMap {
  'dialog-close': DialogCloseEvent
  'dialog-open': DialogOpenEvent
}

export interface AriaDialogDescriptionElementEventMap extends BaseElementEventMap {}
export interface AriaDialogLabelElementEventMap extends BaseElementEventMap {}

export interface AriaDisclosureElementEventMap extends BaseElementEventMap {}
export interface AriaDisclosureButtonElementEventMap extends BaseElementEventMap {}
export interface AriaDisclosurePanelElementEventMap extends BaseElementEventMap {}
export interface AriaDisclosureSectionElementEventMap extends BaseElementEventMap {}

export interface AriaFeedElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleDescriptionElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleLabelElementEventMap extends BaseElementEventMap {}

export interface AriaLinkElementEventMap extends BaseElementEventMap {}

export interface AriaListElementEventMap extends BaseElementEventMap {}
export interface AriaListItemElementEventMap extends BaseElementEventMap {}

export interface AriaListBoxElementEventMap extends BaseElementEventMap {}

export interface AriaListBoxOptionElementEventMap extends BaseElementEventMap {
  'list-box-option-select': ListBoxOptionSelectEvent<any>
}

export interface AriaMenuElementEventMap extends BaseElementEventMap {}
export interface AriaMenuButtonElementEventMap extends BaseElementEventMap {}
export interface AriaMenuItemElementEventMap extends BaseElementEventMap {}
export interface AriaMenuSubMenuElementEventMap extends FloatingElementEventMap {}

export interface AriaMeterElementEventMap extends BaseElementEventMap {}

export interface AriaRadioButtonElementEventMap extends BaseElementEventMap {}
export interface AriaRadioGroupElementEventMap extends FormControlElementEventMap {}

export interface AriaSliderElementEventMap extends FormControlElementEventMap {
  'slider-change': SliderChangeEvent
}

export interface AriaSliderThumbElementEventMap extends BaseElementEventMap {
  'slider-thumb-move': SliderThumbMoveEvent
}

export interface AriaSwitchElementEventMap extends FormControlElementEventMap {}

export interface AriaTabsElementEventMap extends BaseElementEventMap {}
export interface AriaTabsPanelElementEventMap extends BaseElementEventMap {}

export interface AriaTabsTabElementEventMap extends BaseElementEventMap {
  'tabs-tab-selection': TabsTabSelectionEvent<any>
}

export interface AriaTooltipElementEventMap extends BaseElementEventMap {}
export interface AriaTooltipArrowElementEventMap extends BaseElementEventMap {}
export interface AriaTooltipContentElementEventMap extends FloatingElementEventMap {}
export interface AriaTooltipTriggerElementEventMap extends BaseElementEventMap {}

/**
 * Core Elements Events
 */
/** */

export interface BaseElementEventMap extends HTMLElementEventMap {
  'attribute-change': AttributeChangeEvent
  'state-change': StateChangeEvent
}

export interface FloatingElementEventMap extends BaseElementEventMap {}

export interface FocusTrapElementEventMap extends BaseElementEventMap {
  'focus-trap-activate': FocusTrapActivateEvent
  'focus-trap-deactivate': FocusTrapDeactivateEvent
  'focus-trap-post-activate': FocusTrapPostActivateEvent
  'focus-trap-post-deactivate': FocusTrapPostDeactivateEvent
}

export interface FormControlElementEventMap extends BaseElementEventMap {}

/**
 * Data Elements Events
 */
/** */

export interface AvatarElementEventMap extends BaseElementEventMap {}
export interface BadgeElementEventMap extends BaseElementEventMap {}

export interface CarouselElementEventMap extends AriaCarouselElementEventMap {}
export interface CarouselNextSlideControlElementEventMap extends AriaCarouselNextSlideControlElementEventMap {}
export interface CarouselPreviousSlideControlElementEventMap extends AriaCarouselPreviousSlideControlElementEventMap {}
export interface CarouselRotationControlElementEventMap extends AriaCarouselRotationControlElementEventMap {}
export interface CarouselSlideElementEventMap extends AriaCarouselSlideElementEventMap {}
export interface CarouselSlidesElementEventMap extends AriaCarouselSlidesElementEventMap {}
export interface CarouselTabElementEventMap extends AriaCarouselTabElementEventMap {}
export interface CarouselTabsElementEventMap extends AriaCarouselTabsElementEventMap {}

export interface ChipElementEventMap extends BaseElementEventMap {}

export interface FeedElementEventMap extends AriaFeedElementEventMap {}
export interface FeedArticleElementEventMap extends AriaFeedArticleElementEventMap {}
export interface FeedArticleDescriptionElementEventMap extends AriaFeedArticleDescriptionElementEventMap {}
export interface FeedArticleLabelElementEventMap extends AriaFeedArticleLabelElementEventMap {}

export interface IconElementEventMap extends BaseElementEventMap {}
export interface ImageElementEventMap extends BaseElementEventMap {}

export interface ListElementEventMap extends AriaListElementEventMap {}
export interface ListItemElementEventMap extends AriaListItemElementEventMap {}

export interface TooltipElementEventMap extends AriaTooltipElementEventMap {}
export interface TooltipArrowElementEventMap extends AriaTooltipArrowElementEventMap {}
export interface TooltipContentElementEventMap extends AriaTooltipContentElementEventMap {}
export interface TooltipTriggerElementEventMap extends AriaTooltipTriggerElementEventMap {}

/**
 * Feedback Elements Events
 */
/** */

export interface AlertElementEventMap extends AriaAlertElementEventMap {}

export interface AlertDialogElementEventMap extends DialogElementEventMap {}
export interface AlertDialogDescriptionElementEventMap extends DialogDescriptionElementEventMap {}
export interface AlertDialogLabelElementEventMap extends DialogLabelElementEventMap {}

export interface DialogElementEventMap extends AriaDialogElementEventMap {}
export interface DialogDescriptionElementEventMap extends AriaDialogDescriptionElementEventMap {}
export interface DialogLabelElementEventMap extends AriaDialogLabelElementEventMap {}

export interface MeterElementEventMap extends AriaMeterElementEventMap {}

/**
 * Input Elements Events
 */
/** */

export interface ButtonElementEventMap extends AriaButtonElementEventMap {
  'button-click': ButtonClickEvent
}

export interface ButtonGroupElementEventMap extends BaseElementEventMap {}
export interface CheckBoxElementEventMap extends AriaCheckBoxElementEventMap {}

export interface FormElementEventMap extends BaseElementEventMap {
  'form-submit': FormSubmitEvent
}

export interface InputElementEventMap extends FormControlElementEventMap {}
export interface InputFileElementEventMap extends FormControlElementEventMap {}

export interface ListBoxElementEventMap extends AriaListBoxElementEventMap {}
export interface ListBoxOptionElementEventMap extends AriaListBoxOptionElementEventMap {}

export interface RadioButtonElementEventMap extends AriaRadioButtonElementEventMap {}
export interface RadioGroupElementEventMap extends AriaRadioGroupElementEventMap {}

export interface SelectElementEventMap extends AriaComboBoxElementEventMap {}
export interface SelectButtonElementEventMap extends AriaComboBoxButtonElementEventMap {}
export interface SelectGroupElementEventMap extends AriaComboBoxGroupElementEventMap {}
export interface SelectInputElementEventMap extends AriaComboBoxInputElementEventMap {}
export interface SelectListElementEventMap extends AriaComboBoxListElementEventMap {}
export interface SelectOptionElementEventMap extends AriaComboBoxOptionElementEventMap {}

export interface SliderElementEventMap extends AriaSliderElementEventMap {}
export interface SliderThumbElementEventMap extends AriaSliderThumbElementEventMap {}

export interface SwitchElementEventMap extends AriaSwitchElementEventMap {}
export interface TextAreaElementEventMap extends FormControlElementEventMap {}

/**
 * Layout Elements Events
 */
/** */

export interface DividerElementEventMap extends BaseElementEventMap {}

/**
 * Navigation Elements Events
 */
/** */

export interface BreadcrumbElementEventMap extends AriaBreadcrumbElementEventMap {}
export interface BreadcrumbListElementEventMap extends AriaBreadcrumbListElementEventMap {}
export interface BreadcrumbItemElementEventMap extends AriaBreadcrumbItemElementEventMap {}

export interface MenuElementEventMap extends AriaMenuElementEventMap {}
export interface MenuButtonElementEventMap extends AriaMenuButtonElementEventMap {}
export interface MenuItemElementEventMap extends AriaMenuItemElementEventMap {}
export interface MenuSubMenuElementEventMap extends AriaMenuSubMenuElementEventMap {}

export interface NavigationBarElementEventMap extends BaseElementEventMap {}
export interface NavigationBarItemElementEventMap extends BaseElementEventMap {}

export interface NavigationRailElementEventMap extends BaseElementEventMap {}
export interface NavigationRailItemElementEventMap extends BaseElementEventMap {}

export interface TabsElementEventMap extends AriaTabsElementEventMap {}
export interface TabsPanelElementEventMap extends AriaTabsPanelElementEventMap {}
export interface TabsTabElementEventMap extends AriaTabsTabElementEventMap {}

/**
 * Surface Elements Events
 */
/** */

export interface AccordionElementEventMap extends AriaAccordionElementEventMap {}
export interface AccordionButtonElementEventMap extends AriaAccordionButtonElementEventMap {}
export interface AccordionHeaderElementEventMap extends AriaAccordionHeaderElementEventMap {}
export interface AccordionPanelElementEventMap extends AriaAccordionPanelElementEventMap {}
export interface AccordionSectionElementEventMap extends AriaAccordionSectionElementEventMap {}

export interface CardElementEventMap extends BaseElementEventMap {}

export interface DisclosureElementEventMap extends AriaDisclosureElementEventMap {}
export interface DisclosureButtonElementEventMap extends AriaDisclosureButtonElementEventMap {}
export interface DisclosurePanelElementEventMap extends AriaDisclosurePanelElementEventMap {}
export interface DisclosureSectionElementEventMap extends AriaDisclosureSectionElementEventMap {}

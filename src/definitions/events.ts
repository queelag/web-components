import type { AccordionSectionCollapseEvent } from '../events/accordion-section-collapse-event.js'
import type { AccordionSectionExpandEvent } from '../events/accordion-section-expand-event.js'
import type { AttributeChangeEvent } from '../events/attribute-change-event.js'
import type { ButtonClickEvent } from '../events/button-click-event.js'
import type { CarouselRotationPauseEvent } from '../events/carousel-rotation-pause-event.js'
import type { CarouselRotationResumeEvent } from '../events/carousel-rotation-resume-event.js'
import type { CarouselRotationStartEvent } from '../events/carousel-rotation-start-event.js'
import type { CarouselRotationStopEvent } from '../events/carousel-rotation-stop-event.js'
import type { CarouselSlideActivateEvent } from '../events/carousel-slide-activate-event.js'
import type { CarouselSlideDeactivateEvent } from '../events/carousel-slide-deactivate-event.js'
import type { CarouselTabActivateEvent } from '../events/carousel-tab-activate-event.js'
import type { CarouselTabDeactivateEvent } from '../events/carousel-tab-deactivate-event.js'
import type { CheckBoxCheckEvent } from '../events/check-box-check-event.js'
import type { CheckBoxUncheckEvent } from '../events/check-box-uncheck-event.js'
import type { ComboBoxCollapseEvent } from '../events/combo-box-collapse-event.js'
import type { ComboBoxExpandEvent } from '../events/combo-box-expand-event.js'
import type { ComboBoxOptionSelectEvent } from '../events/combo-box-option-select-event.js'
import type { ComboBoxOptionUnselectEvent } from '../events/combo-box-option-unselect-event.js'
import type { DialogCloseEvent } from '../events/dialog-close-event.js'
import type { DialogOpenEvent } from '../events/dialog-open-event.js'
import type { DisclosureSectionCollapseEvent } from '../events/disclosure-section-collapse-event.js'
import type { DisclosureSectionExpandEvent } from '../events/disclosure-section-expand-event.js'
import type { FocusTrapActivateEvent } from '../events/focus-trap-activate-event.js'
import type { FocusTrapDeactivateEvent } from '../events/focus-trap-deactivate-event.js'
import type { FocusTrapPostActivateEvent } from '../events/focus-trap-post-activate-event.js'
import type { FocusTrapPostDeactivateEvent } from '../events/focus-trap-post-deactivate-event.js'
import type { FormSubmitEvent } from '../events/form-submit-event.js'
import type { ListBoxOptionSelectEvent } from '../events/list-box-option-select-event.js'
import type { ListBoxOptionUnselectEvent } from '../events/list-box-option-unselect-event.js'
import type { RadioButtonCheckEvent } from '../events/radio-button-check-event.js'
import type { RadioButtonUncheckEvent } from '../events/radio-button-uncheck-event.js'
import type { SliderChangeEvent } from '../events/slider-change-event.js'
import type { SliderThumbMoveEvent } from '../events/slider-thumb-move-event.js'
import type { StateChangeEvent } from '../events/state-change-event.js'
import type { SwitchOffEvent } from '../events/switch-off-event.js'
import type { SwitchOnEvent } from '../events/switch-on-event.js'
import type { TabsTabSelectEvent } from '../events/tabs-tab-select-event.js'
import type { TabsTabUnselectEvent } from '../events/tabs-tab-unselect-event.js'
import type { TooltipHideEvent } from '../events/tooltip-hide-event.js'
import type { TooltipShowEvent } from '../events/tooltip-show-event.js'

/**
 * ARIA Elements Events
 */
/** */

export interface AriaAccordionElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionButtonElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionHeaderElementEventMap extends BaseElementEventMap {}
export interface AriaAccordionPanelElementEventMap extends BaseElementEventMap {}

export interface AriaAccordionSectionElementEventMap extends BaseElementEventMap {
  collapse: AccordionSectionCollapseEvent
  expand: AccordionSectionExpandEvent
}

export interface AriaAlertElementEventMap extends BaseElementEventMap {}

export interface AriaAlertDialogElementEventMap extends AriaDialogElementEventMap {}
export interface AriaAlertDialogDescriptionElementEventMap extends AriaDialogDescriptionElementEventMap {}
export interface AriaAlertDialogLabelElementEventMap extends AriaDialogLabelElementEventMap {}

export interface AriaBreadcrumbElementEventMap extends BaseElementEventMap {}
export interface AriaBreadcrumbListElementEventMap extends BaseElementEventMap {}
export interface AriaBreadcrumbItemElementEventMap extends BaseElementEventMap {}

export interface AriaButtonElementEventMap extends BaseElementEventMap {}

export interface AriaCarouselElementEventMap extends BaseElementEventMap {
  'rotation-pause': CarouselRotationPauseEvent
  'rotation-resume': CarouselRotationResumeEvent
  'rotation-start': CarouselRotationStartEvent
  'rotation-stop': CarouselRotationStopEvent
}

export interface AriaCarouselNextSlideControlElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselPreviousSlideControlElementEventMap extends BaseElementEventMap {}
export interface AriaCarouselRotationControlElementEventMap extends BaseElementEventMap {}

export interface AriaCarouselSlideElementEventMap extends BaseElementEventMap {
  activate: CarouselSlideActivateEvent<any>
  deactivate: CarouselSlideDeactivateEvent
}

export interface AriaCarouselSlidesElementEventMap extends BaseElementEventMap {}

export interface AriaCarouselTabElementEventMap extends BaseElementEventMap {
  activate: CarouselTabActivateEvent<any>
  deactivate: CarouselTabDeactivateEvent
}

export interface AriaCarouselTabsElementEventMap extends BaseElementEventMap {}

export interface AriaCheckBoxElementEventMap extends FormControlElementEventMap {
  check: CheckBoxCheckEvent
  uncheck: CheckBoxUncheckEvent
}

export interface AriaComboBoxElementEventMap extends FormControlElementEventMap {
  collapse: ComboBoxCollapseEvent
  expand: ComboBoxExpandEvent
}

export interface AriaComboBoxButtonElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxGroupElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxInputElementEventMap extends BaseElementEventMap {}
export interface AriaComboBoxListElementEventMap extends FloatingElementEventMap {}

export interface AriaComboBoxOptionElementEventMap extends BaseElementEventMap {
  select: ComboBoxOptionSelectEvent
  unselect: ComboBoxOptionUnselectEvent
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

export interface AriaDisclosureSectionElementEventMap extends BaseElementEventMap {
  collapse: DisclosureSectionCollapseEvent
  expand: DisclosureSectionExpandEvent
}

export interface AriaFeedElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleDescriptionElementEventMap extends BaseElementEventMap {}
export interface AriaFeedArticleLabelElementEventMap extends BaseElementEventMap {}

export interface AriaLinkElementEventMap extends BaseElementEventMap {}

export interface AriaListElementEventMap extends BaseElementEventMap {}
export interface AriaListItemElementEventMap extends BaseElementEventMap {}

export interface AriaListBoxElementEventMap extends BaseElementEventMap {}

export interface AriaListBoxOptionElementEventMap extends BaseElementEventMap {
  select: ListBoxOptionSelectEvent
  unselect: ListBoxOptionUnselectEvent
}

export interface AriaMenuElementEventMap extends BaseElementEventMap {}
export interface AriaMenuButtonElementEventMap extends BaseElementEventMap {}
export interface AriaMenuItemElementEventMap extends BaseElementEventMap {}
export interface AriaMenuSubMenuElementEventMap extends FloatingElementEventMap {}

export interface AriaMeterElementEventMap extends BaseElementEventMap {}

export interface AriaRadioButtonElementEventMap extends BaseElementEventMap {
  check: RadioButtonCheckEvent
  uncheck: RadioButtonUncheckEvent
}

export interface AriaRadioGroupElementEventMap extends FormControlElementEventMap {}

export interface AriaSliderElementEventMap extends FormControlElementEventMap {
  'slider-change': SliderChangeEvent
}

export interface AriaSliderThumbElementEventMap extends BaseElementEventMap {
  move: SliderThumbMoveEvent
}

export interface AriaSwitchElementEventMap extends FormControlElementEventMap {
  'switch-off': SwitchOffEvent
  'switch-on': SwitchOnEvent
}

export interface AriaTabsElementEventMap extends BaseElementEventMap {}
export interface AriaTabsPanelElementEventMap extends BaseElementEventMap {}

export interface AriaTabsTabElementEventMap extends BaseElementEventMap {
  select: TabsTabSelectEvent
  unselect: TabsTabUnselectEvent
}

export interface AriaTooltipElementEventMap extends BaseElementEventMap {
  hide: TooltipHideEvent
  show: TooltipShowEvent
}

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

export interface QrCodeElementEventMap extends BaseElementEventMap {}

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

import { tc } from '@queelag/core'
import {
  ElementName,
  FocusTrapAllowOutsideClick,
  FocusTrapCheckCanFocusTrap,
  FocusTrapCheckCanReturnFocus,
  FocusTrapClickOutsideDeactivates,
  FocusTrapDisplayCheck,
  FocusTrapEscapeDeactivates,
  FocusTrapSetReturnFocus,
  WebElementLogger
} from '@queelag/web'
import { createFocusTrap, FocusTarget, FocusTargetOrFalse, FocusTrap, Options } from 'focus-trap'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from './base.element'

export class FocusTrapElement extends BaseElement {
  /**
   * PROPERTIES
   */
  allowOutsideClick?: FocusTrapAllowOutsideClick
  checkCanFocusTrap?: FocusTrapCheckCanFocusTrap
  checkCanReturnFocus?: FocusTrapCheckCanReturnFocus
  clickOutsideDeactivates?: FocusTrapClickOutsideDeactivates
  delayInitialFocus?: boolean
  displayCheck?: FocusTrapDisplayCheck
  // document?: Document
  escapeDeactivates?: FocusTrapEscapeDeactivates
  fallbackFocus?: FocusTarget
  // getShadowRoot?: FocusTrapGetShadowRoot
  initialFocus?: FocusTargetOrFalse
  preventScroll?: boolean
  returnFocusOnDeactivate?: boolean
  setReturnFocus?: FocusTrapSetReturnFocus

  /**
   * INTERNAL
   */
  protected focusTrap!: FocusTrap

  connectedCallback(): void {
    super.connectedCallback()
    this.createFocusTrap()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.deactivateFocusTrap()
  }

  createFocusTrap(): void {
    this.focusTrap = createFocusTrap(this, this.focusTrapOptions)
    WebElementLogger.verbose(this.uid, 'createFocusTrap', `The focus trap has been created.`, this.focusTrap, this.focusTrapOptions)
  }

  activateFocusTrap(): void {
    tc(() => this.focusTrap.activate())
    WebElementLogger.verbose(this.uid, 'activateFocusTrap', `The focus trap has been activated.`)
  }

  deactivateFocusTrap(): void {
    tc(() => this.focusTrap.deactivate())
    WebElementLogger.verbose(this.uid, 'deactivateFocusTrap', `The focus trap has been deactivated.`)
  }

  onFocusTrapActivate = (): void => {
    this.dispatchEvent(new Event('focus-trap-activate'))
  }

  onFocusTrapDeactivate = (): void => {
    this.dispatchEvent(new Event('focus-trap-deactivate'))
  }

  onFocusTrapPostActivate = (): void => {
    this.dispatchEvent(new Event('focus-trap-post-activate'))
  }

  onFocusTrapPostDeactivate = (): void => {
    this.dispatchEvent(new Event('focus-trap-post-deactivate'))
  }

  get focusTrapOptions(): Options {
    let options: Options

    options = {
      allowOutsideClick: typeof this.allowOutsideClick !== 'undefined' ? this.allowOutsideClick : true,
      checkCanFocusTrap: this.checkCanFocusTrap,
      checkCanReturnFocus: this.checkCanReturnFocus,
      clickOutsideDeactivates: this.clickOutsideDeactivates,
      delayInitialFocus: this.delayInitialFocus,
      // document: this.document,
      escapeDeactivates: this.escapeDeactivates,
      fallbackFocus: this.fallbackFocus,
      initialFocus: this.initialFocus,
      onActivate: this.onFocusTrapActivate,
      onDeactivate: this.onFocusTrapDeactivate,
      onPostActivate: this.onFocusTrapPostActivate,
      onPostDeactivate: this.onFocusTrapPostDeactivate,
      preventScroll: this.preventScroll,
      returnFocusOnDeactivate: this.returnFocusOnDeactivate,
      setReturnFocus: this.setReturnFocus,
      tabbableOptions: {
        displayCheck: this.displayCheck,
        // getShadowRoot: typeof this.getShadowRoot !== 'undefined' ? this.getShadowRoot : true
        getShadowRoot: true
      }
    }

    for (let key in options) {
      // @ts-ignore
      typeof options[key] === 'undefined' && delete options[key]
    }

    for (let key in options.tabbableOptions) {
      // @ts-ignore
      typeof options.tabbableOptions[key] === 'undefined' && delete options.tabbableOptions[key]
    }

    return options
  }

  get name(): ElementName {
    return ElementName.FOCUS_TRAP
  }

  static properties: PropertyDeclarations = {
    allowOutsideClick: { attribute: 'allow-outside-click' },
    checkCanFocusTrap: { type: Object, attribute: 'check-can-focus-trap' },
    checkCanReturnFocus: { type: Object, attribute: 'check-can-return-focus' },
    clickOutsideDeactivates: { attribute: 'click-outside-deactivates' },
    delayInitialFocus: { type: Boolean, attribute: 'delay-initial-focus' },
    displayCheck: { type: String, attribute: 'display-check' },
    // document: {type: Object, attribute: 'document'},
    escapeDeactivates: { attribute: 'escape-deactivates' },
    fallbackFocus: { attribute: 'fallback-focus' },
    // getShadowRoot: {attribute: 'get-shadow-root'},
    initialFocus: { attribute: 'initial-focus' },
    preventScroll: { type: Boolean, attribute: 'prevent-scroll' },
    returnFocusOnDeactivate: { type: Boolean, attribute: 'return-focus-on-deactivate' },
    setReturnFocus: { attribute: 'set-return-focus' }
  }
}

customElements.define('q-focus-trap', FocusTrapElement)

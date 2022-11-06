import { deleteDeepObjectUndefinedProperties, tc } from '@queelag/core'
import {
  ElementName,
  FocusTrapAllowOutsideClick,
  FocusTrapCheckCanFocusTrap,
  FocusTrapCheckCanReturnFocus,
  FocusTrapClickOutsideDeactivates,
  FocusTrapDisplayCheck,
  FocusTrapElementState,
  FocusTrapEscapeDeactivates,
  FocusTrapSetReturnFocus,
  WebElementLogger
} from '@queelag/web'
import { ActivateOptions, createFocusTrap, DeactivateOptions, FocusTarget, FocusTargetOrFalse, FocusTrap, Options } from 'focus-trap'
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
  focusTrapState?: FocusTrapElementState

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

  activateFocusTrap(options?: ActivateOptions): void {
    tc(() => this.focusTrap.activate(options))
    WebElementLogger.verbose(this.uid, 'activateFocusTrap', `The focus trap has been activated.`)
  }

  deactivateFocusTrap(options?: DeactivateOptions): void {
    tc(() => this.focusTrap.deactivate(options))
    WebElementLogger.verbose(this.uid, 'deactivateFocusTrap', `The focus trap has been deactivated.`)
  }

  onFocusTrapActivate(): void {
    this.focusTrapState = 'activating'
    WebElementLogger.verbose(this.uid, 'onFocusTrapActivate', `The focus trap state has been set to activating.`)

    this.dispatchEvent(new Event('focus-trap-activate'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapActivate', `The focus-trap-activate event has been dispatched.`)
  }

  onFocusTrapDeactivate(): void {
    this.focusTrapState = 'deactivating'
    WebElementLogger.verbose(this.uid, 'onFocusTrapDeactivate', `The focus trap state has been set to deactivating.`)

    this.dispatchEvent(new Event('focus-trap-deactivate'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapDeactivate', `The focus-trap-deactivate event has been dispatched.`)
  }

  onFocusTrapPostActivate(): void {
    this.focusTrapState = 'activated'
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The focus trap state has been set to activated.`)

    this.dispatchEvent(new Event('focus-trap-post-activate'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The focus-trap-post-activate event has been dispatched.`)
  }

  onFocusTrapPostDeactivate(): void {
    this.focusTrapState = 'deactivated'
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The focus trap state has been set to deactivated.`)

    this.dispatchEvent(new Event('focus-trap-post-deactivate'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The focus-trap-post-deactivate event has been dispatched.`)
  }

  get focusTrapOptions(): Options {
    let options: Options

    options = {
      allowOutsideClick: typeof this.allowOutsideClick === 'string' || this.allowOutsideClick,
      checkCanFocusTrap: this.checkCanFocusTrap,
      checkCanReturnFocus: this.checkCanReturnFocus,
      clickOutsideDeactivates: typeof this.clickOutsideDeactivates === 'string' || this.clickOutsideDeactivates,
      delayInitialFocus: this.delayInitialFocus,
      // document: this.document,
      escapeDeactivates: typeof this.escapeDeactivates === 'string' || this.escapeDeactivates,
      fallbackFocus: this.fallbackFocus,
      initialFocus: this.initialFocus,
      onActivate: () => this.onFocusTrapActivate(),
      onDeactivate: () => this.onFocusTrapDeactivate(),
      onPostActivate: () => this.onFocusTrapPostActivate(),
      onPostDeactivate: () => this.onFocusTrapPostDeactivate(),
      preventScroll: this.preventScroll,
      returnFocusOnDeactivate: this.returnFocusOnDeactivate,
      setReturnFocus: this.setReturnFocus,
      tabbableOptions: {
        displayCheck: this.displayCheck,
        // getShadowRoot: typeof this.getShadowRoot !== 'undefined' ? this.getShadowRoot : true
        getShadowRoot: true
      }
    }

    return deleteDeepObjectUndefinedProperties(options)
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

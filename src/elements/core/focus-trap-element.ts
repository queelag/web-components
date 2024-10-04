import { omitObjectProperties, tc } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import {
  type ActivateOptions,
  type DeactivateOptions,
  type FocusTarget,
  type FocusTargetOrFalse,
  type FocusTrap,
  type Options,
  createFocusTrap
} from 'focus-trap'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { FocusTrapElementEventMap } from '../../definitions/events.js'
import type {
  FocusTrapAllowOutsideClick,
  FocusTrapCheckCanFocusTrap,
  FocusTrapCheckCanReturnFocus,
  FocusTrapClickOutsideDeactivates,
  FocusTrapDisplayCheck,
  FocusTrapElementState,
  FocusTrapEscapeDeactivates,
  FocusTrapSetReturnFocus
} from '../../definitions/types.js'
import { FocusTrapActivateEvent } from '../../events/focus-trap-activate-event.js'
import { FocusTrapDeactivateEvent } from '../../events/focus-trap-deactivate-event.js'
import { FocusTrapPostActivateEvent } from '../../events/focus-trap-post-activate-event.js'
import { FocusTrapPostDeactivateEvent } from '../../events/focus-trap-post-deactivate-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from './base-element.js'

class FocusTrapElement<E extends FocusTrapElementEventMap = FocusTrapElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
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
   * Internals
   */
  /** */
  focusTrap?: FocusTrap
  focusTrapState?: FocusTrapElementState

  connectedCallback(): void {
    super.connectedCallback()
    setImmutableElementAttribute(this, 'focus-trap-element', '')

    ElementLogger.verbose(this.uid, 'connectedCallback', `Creating the focus trap.`)
    this.createFocusTrap()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    ElementLogger.verbose(this.uid, 'disconnectedCallback', `Deactivating the focus trap.`)
    this.deactivateFocusTrap()
  }

  createFocusTrap(): void {
    this.focusTrap = createFocusTrap(this, this.focusTrapOptions)
    ElementLogger.verbose(this.uid, 'createFocusTrap', `The focus trap has been created.`, this.focusTrap, this.focusTrapOptions)
  }

  activateFocusTrap(options?: ActivateOptions): void {
    if (!this.focusTrap) {
      return
    }

    tc(() => this.focusTrap?.activate(options), false)
    ElementLogger.verbose(this.uid, 'activateFocusTrap', `The focus trap has been activated.`, options)
  }

  deactivateFocusTrap(options?: DeactivateOptions): void {
    if (!this.focusTrap) {
      return
    }

    tc(() => this.focusTrap?.deactivate(options), false)
    ElementLogger.verbose(this.uid, 'deactivateFocusTrap', `The focus trap has been deactivated.`, options)
  }

  onFocusTrapActivate(): void {
    this.focusTrapState = 'activating'
    ElementLogger.verbose(this.uid, 'onFocusTrapActivate', `The focus trap state has been set.`, [this.focusTrapState])

    this.dispatchEvent(new FocusTrapActivateEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapActivate', `The "focus-trap-activate" event has been dispatched.`)
  }

  onFocusTrapDeactivate(): void {
    this.focusTrapState = 'deactivating'
    ElementLogger.verbose(this.uid, 'onFocusTrapDeactivate', `The focus trap state has been set.`, [this.focusTrapState])

    this.dispatchEvent(new FocusTrapDeactivateEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapDeactivate', `The "focus-trap-deactivate" event has been dispatched.`)
  }

  onFocusTrapPostActivate(): void {
    this.focusTrapState = 'activated'
    ElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The focus trap state has been set.`, [this.focusTrapState])

    this.dispatchEvent(new FocusTrapPostActivateEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The "focus-trap-post-activate" event has been dispatched.`)
  }

  onFocusTrapPostDeactivate(): void {
    this.focusTrapState = 'deactivated'
    ElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The focus trap state has been set.`, [this.focusTrapState])

    this.dispatchEvent(new FocusTrapPostDeactivateEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The "focus-trap-post-deactivate" event has been dispatched.`)
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

    return omitObjectProperties(options, (_, __, value: unknown) => typeof value === 'undefined')
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
    returnFocusOnDeactivate: {
      type: Boolean,
      attribute: 'return-focus-on-deactivate'
    },
    setReturnFocus: { attribute: 'set-return-focus' }
  }
}

export { FocusTrapElement as AracnaFocusTrapElement }

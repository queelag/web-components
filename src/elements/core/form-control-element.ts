import { setImmutableElementAttribute } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { FormControlElementCollector } from '../../collectors/form-control-element-collector.js'
import type { FormControlElementEventMap } from '../../definitions/events.js'
import type { FormControlElementSchema, FormControlElementTarget, FormControlElementValidation } from '../../definitions/types.js'
import { FormControlChangeEvent } from '../../events/form-control-change-event.js'
import { FormControlTouchEvent } from '../../events/form-control-touch-event.js'
import { FormControlValidateEvent } from '../../events/form-control-validate-event.js'
import { StateChangeEvent } from '../../events/state-change-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from './base-element.js'

class FormControlElement<E extends FormControlElementEventMap = FormControlElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  disabled?: boolean
  focused?: boolean
  native?: boolean
  normalized?: boolean
  path?: string
  readonly?: boolean
  touched?: boolean

  /**
   * States
   */
  /** */
  validation?: FormControlElementValidation

  /**
   * Internals
   */
  /** */
  protected _schema?: FormControlElementSchema
  protected _target?: FormControlElementTarget
  protected _value: any

  connectedCallback(): void {
    super.connectedCallback()
    setImmutableElementAttribute(this, 'form-field-element', '')

    FormControlElementCollector.set(this)

    ElementLogger.verbose(this.uid, 'connectedCallback', `Validating.`)
    this.validate()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    FormControlElementCollector.delete(this)
  }

  touch(): void {
    if (!this.touched) {
      this.touched = true
      ElementLogger.verbose(this.uid, 'touch', `The touched state has been set to true.`)
    }

    this.dispatchEvent(new FormControlTouchEvent())
    ElementLogger.verbose(this.uid, 'touch', `The "form-control-touch" event has been dispatched.`)
  }

  validate(): void {
    let old: FormControlElementValidation | undefined

    if (!this.schema) {
      return ElementLogger.verbose(this.uid, 'validate', `No schema to validate against.`)
    }

    old = this.validation

    this.validation = this.schema.validate(this.value)
    ElementLogger.verbose(this.uid, 'validate', `The value has been validated against the schema.`, this.validation)

    this.dispatchEvent(new FormControlValidateEvent(this.schema, this.validation, this.value))
    ElementLogger.verbose(this.uid, 'validate', `The "form-control-validate" event has been dispatched.`)
  }

  clear(): void {
    ElementLogger.verbose(this.uid, 'clear', `Clearing the value.`)
    this.setValue(undefined)
  }

  setValue(value: any): void {
    this.value = value
    ElementLogger.verbose(this.uid, 'setValue', `The value has been set.`, value)

    this.dispatchEvent(new FormControlChangeEvent(this.value))
    ElementLogger.verbose(this.uid, 'setValue', `The "form-control-change" event has been dispatched.`)
  }

  get error(): string | undefined {
    if (!this.validation) {
      return undefined
    }

    return this.validation[0]?.message
  }

  get schema(): FormControlElementSchema | undefined {
    return this._schema
  }

  set schema(schema: FormControlElementSchema | undefined) {
    this._schema = schema
  }

  get target(): FormControlElementTarget | undefined {
    return this._target
  }

  set target(target: FormControlElementTarget | undefined) {
    let old: FormControlElementTarget | undefined

    FormControlElementCollector.delete(this)

    old = this._target
    this._target = target

    FormControlElementCollector.set(this)

    this.requestUpdate('target', old)
  }

  get value(): any {
    FormControlElementCollector.set(this)

    if (this.target && typeof this.path === 'string') {
      return this.target[this.path]
    }

    return this._value
  }

  set value(value: any) {
    let old: any

    if (this.target && typeof this.path === 'string') {
      this.target[this.path] = value
    }

    old = this.value
    this._value = value

    this.requestUpdate('value', old, value)

    ElementLogger.verbose(this.uid, 'set value', `Validating.`)
    this.validate()

    this.dispatchEvent(new StateChangeEvent('value', old, value))
  }

  get isErrorVisible(): boolean {
    return typeof this.error === 'string' && this.touched === true
  }

  get isValid(): boolean {
    return typeof this.error === 'undefined'
  }

  static properties: PropertyDeclarations = {
    disabled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    native: { type: Boolean, reflect: true },
    normalized: { type: Boolean, reflect: true },
    path: { type: String, reflect: true },
    readonly: { type: Boolean, reflect: true },
    schema: { type: Object },
    target: { type: Object },
    touched: { type: Boolean, reflect: true },
    validation: { state: true },
    value: {}
  }
}

export { FormControlElement as AracnaFormControlElement }

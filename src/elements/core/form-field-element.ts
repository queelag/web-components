import {
  FormFieldElementCollector,
  FormFieldElementEventMap,
  FormFieldElementSchema,
  FormFieldElementTarget,
  FormFieldElementValidation,
  StateChangeEvent,
  WebElementLogger
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from './base-element.js'

export class FormFieldElement<E extends FormFieldElementEventMap = FormFieldElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  disabled?: boolean
  focused?: boolean
  native?: boolean
  normalized?: boolean
  path?: string
  readonly?: boolean
  touched?: boolean

  /**
   * STATES
   */
  validation?: FormFieldElementValidation

  /**
   * INTERNAL
   */
  protected _schema?: FormFieldElementSchema
  protected _target?: FormFieldElementTarget
  protected _value: any

  connectedCallback(): void {
    super.connectedCallback()
    FormFieldElementCollector.set(this)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    FormFieldElementCollector.delete(this)
  }

  touch(): void {
    if (!this.touched) {
      this.touched = true
      WebElementLogger.verbose(this.uid, 'touch', `The touched state has been set to true.`)
    }

    this.validate()
  }

  validate(): void {
    let old: FormFieldElementValidation | undefined

    if (!this.schema) {
      return
    }

    old = this.validation

    this.validation = this.schema.validate(this.value)
    // WebElementLogger.verbose(this.uid, 'validate', `The value has been validated against the schema.`, this.validation)

    this.dispatchEvent(new StateChangeEvent('validation', old, this.validation))
  }

  clear(): void {
    this.value = undefined
    WebElementLogger.verbose(this.uid, 'clear', `The value has been cleared.`)
  }

  get error(): string | undefined {
    if (!this.validation) {
      return
    }

    return this.validation[0]?.message
  }

  get schema(): FormFieldElementSchema | undefined {
    return this._schema
  }

  set schema(schema: FormFieldElementSchema | undefined) {
    this._schema = schema
  }

  get target(): FormFieldElementTarget | undefined {
    return this._target
  }

  set target(target: FormFieldElementTarget | undefined) {
    let old: FormFieldElementTarget | undefined

    FormFieldElementCollector.delete(this)

    old = this._target
    this._target = target

    FormFieldElementCollector.set(this)

    this.requestUpdate('target', old)
  }

  get value(): any {
    FormFieldElementCollector.set(this)

    if (this.target && typeof this.path === 'string') {
      return this.target[this.path]
    }

    return this._value
  }

  set value(value: any) {
    let old: any = this.value

    if (this.target && typeof this.path === 'string') {
      this.target[this.path] = value
    }

    this._value = value
    // WebElementLogger.verbose(this.uid, 'set value', `The value has been set.`, [value])

    this.validate()
    this.requestUpdate('value', old, value)

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

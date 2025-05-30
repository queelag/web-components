import { generateRandomString } from '@aracna/core'
import { removeImmutableElementAttribute, setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type {
  AracnaAriaComboBoxButtonElement as AriaComboBoxButtonElement,
  AracnaAriaComboBoxClearElement as AriaComboBoxClearElement,
  AracnaAriaComboBoxElement as AriaComboBoxElement,
  AracnaAriaComboBoxInputElement as AriaComboBoxInputElement,
  AracnaAriaComboBoxListElement as AriaComboBoxListElement,
  AracnaAriaComboBoxOptionElement as AriaComboBoxOptionElement,
  AracnaAriaComboBoxOptionRemoveElement as AriaComboBoxOptionRemoveElement
} from '../elements/aria/aria-combo-box-element.js'

export class AriaComboBoxController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.selectElement) {
      return
    }

    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')

    if (this.host.inputElement) {
      if (this.host.inputElement.inputElement) {
        setImmutableElementAttribute(this.host.inputElement.inputElement, 'aria-autocomplete', this.host.autocomplete)
        setImmutableElementAttribute(this.host.inputElement.inputElement, 'aria-controls', this.host.listElement?.id)
        setImmutableElementAttribute(this.host.inputElement.inputElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
        setImmutableElementAttribute(this.host.inputElement.inputElement, 'disabled', this.host.disabled ? '' : undefined)
        setImmutableElementAttribute(this.host.inputElement.inputElement, 'readonly', this.host.readonly ? '' : undefined)

        if (this.host.collapsed) {
          removeImmutableElementAttribute(this.host.inputElement.inputElement, 'aria-activedescendant')
        }
      }

      if (this.host.buttonElement) {
        setImmutableElementAttribute(this.host.buttonElement, 'aria-controls', this.host.listElement?.id)
        setImmutableElementAttribute(this.host.buttonElement, 'aria-disabled', this.host.disabled ? 'true' : 'false')
        setImmutableElementAttribute(this.host.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')
      }

      return
    }

    if (this.host.buttonElement) {
      // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
      setImmutableElementAttribute(this.host.buttonElement, 'aria-controls', this.host.listElement?.id)
      setImmutableElementAttribute(this.host.buttonElement, 'aria-disabled', this.host.disabled ? 'true' : 'false')
      setImmutableElementAttribute(this.host.buttonElement, 'aria-expanded', this.host.expanded ? 'true' : 'false')

      if (this.host.collapsed) {
        removeImmutableElementAttribute(this.host.buttonElement, 'aria-activedescendant')
      }
    }
  }
}

export class AriaComboBoxButtonController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxButtonElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.rootElement?.inputElement) {
      setImmutableElementAttribute(this.host, 'aria-label', 'Previous Searches')
      setImmutableElementAttribute(this.host, 'role', 'button')
      setImmutableElementAttribute(this.host, 'tabindex', '-1')

      return
    }

    setImmutableElementAttribute(this.host, 'role', 'combobox')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

export class AriaComboBoxClearController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxClearElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-label', 'Clear Searches')
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

export class AriaComboBoxInputController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxInputElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (!this.host.inputElement) {
      return
    }

    setImmutableElementAttribute(this.host.inputElement, 'role', 'combobox')

    if (this.host.inputElement.id.length <= 0) {
      setImmutableElementAttribute(
        this.host.inputElement,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: 'input'
        })
      )
    }
  }
}

export class AriaComboBoxListController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxListElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: this.host.slug
        })
      )
    }

    if (this.host.rootElement?.inputElement) {
      setImmutableElementAttribute(this.host, 'aria-label', 'Previous Searches')
    }

    setImmutableElementAttribute(this.host, 'role', 'listbox')
  }
}

export class AriaComboBoxOptionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxOptionElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-selected', this.host.selected ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'option')

    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(
        this.host,
        'id',
        generateRandomString({
          ...ELEMENT_UID_GENERATE_OPTIONS(),
          prefix: this.host.slug
        })
      )
    }

    if (this.host.rootElement?.inputElement) {
      if (!this.host.rootElement.inputElement?.inputElement) {
        return
      }

      if (this.host.focused) {
        setImmutableElementAttribute(this.host.rootElement.inputElement.inputElement, 'aria-activedescendant', this.host.id)
      }

      return
    }

    if (this.host.rootElement?.buttonElement) {
      if (this.host.focused) {
        setImmutableElementAttribute(this.host.rootElement.buttonElement, 'aria-activedescendant', this.host.id)
      }
    }
  }
}

export class AriaComboBoxOptionRemoveController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaComboBoxOptionRemoveElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-label', `Remove Option ${this.host.value}`)
    setImmutableElementAttribute(this.host, 'role', 'button')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

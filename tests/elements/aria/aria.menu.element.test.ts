import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.menu.element'
import type { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../../../src/elements/aria/aria.menu.element'
import { render } from '../../../vitest/dom.utils'

/**
 * button
 *
 * sm1
 * i1
 * i2 -> sm2 -> i3
 *              i4 -> sm3 -> i5
 */

/**
 * i1 - i2
 *      sm1
 *      i3
 *      i4 -> sm2 -> i5
 *                   i6 -> sm3 -> 17
 */

describe('AriaMenuElement', () => {
  let menu: AriaMenuElement,
    button: AriaMenuButtonElement,
    i1: AriaMenuItemElement,
    i2: AriaMenuItemElement,
    i3: AriaMenuItemElement,
    i4: AriaMenuItemElement,
    i5: AriaMenuItemElement,
    i6: AriaMenuItemElement,
    i7: AriaMenuItemElement,
    sm1: AriaMenuSubMenuElement,
    sm2: AriaMenuSubMenuElement,
    sm3: AriaMenuSubMenuElement

  function prepareMenuWithButton() {
    sm3.append(i5)
    i4.append(sm3)
    sm2.append(i3, i4)
    i2.append(sm2)
    sm1.append(i1, i2)
    menu.append(button, sm1)
  }

  function prepareMenuWithoutButton() {
    sm3.append(i7)
    i6.append(sm3)
    sm2.append(i5, i6)
    i4.append(sm2)
    sm1.append(i3, i4)
    i2.append(sm1)
    menu.append(i1, i2)
  }

  beforeEach(() => {
    menu = document.createElement('q-aria-menu')

    button = document.createElement('q-aria-menu-button')
    i1 = document.createElement('q-aria-menu-item')
    i2 = document.createElement('q-aria-menu-item')
    i3 = document.createElement('q-aria-menu-item')
    i4 = document.createElement('q-aria-menu-item')
    i5 = document.createElement('q-aria-menu-item')
    i6 = document.createElement('q-aria-menu-item')
    i7 = document.createElement('q-aria-menu-item')
    sm1 = document.createElement('q-aria-menu-submenu')
    sm2 = document.createElement('q-aria-menu-submenu')
    sm3 = document.createElement('q-aria-menu-submenu')
  })

  afterEach(() => {
    menu.remove()
  })

  it('has correct aria with button', async () => {
    prepareMenuWithButton()
    await render(menu)

    // expect(menu.getAttribute('aria-label')).toBe('label')
    expect(menu.getAttribute('role')).toBe('menu')

    expect(button.getAttribute('aria-controls')).toBe(sm1.id)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-haspopup')).toBe('true')
    expect(button.getAttribute('id')).not.toBeNull()
    expect(button.getAttribute('role')).toBe('button')
    expect(button.getAttribute('tabindex')).toBe('0')

    expect(sm1.getAttribute('aria-labelledby')).toBe(button.id)
    expect(sm1.getAttribute('depth')).toBe('0')
    expect(sm1.getAttribute('role')).toBe('menu')

    expect(i1.getAttribute('aria-expanded')).toBeNull()
    // expect(i1.getAttribute('aria-label')).toBe('label')
    expect(i1.getAttribute('aria-haspopup')).toBe('false')
    expect(i1.getAttribute('depth')).toBe('1')
    expect(i1.getAttribute('role')).toBe('menuitem')
    expect(i1.getAttribute('tabindex')).toBe('-1')

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    // expect(i2.getAttribute('aria-label')).toBe('label')
    expect(i2.getAttribute('aria-haspopup')).toBe('true')
    expect(i2.getAttribute('depth')).toBe('1')
    expect(i2.getAttribute('role')).toBe('menuitem')
    expect(i2.getAttribute('tabindex')).toBe('-1')

    expect(sm2.getAttribute('aria-labelledby')).toBeNull()
    expect(sm2.getAttribute('depth')).toBe('1')
    expect(sm2.getAttribute('role')).toBe('menu')

    expect(i3.getAttribute('aria-expanded')).toBeNull()
    // expect(i3.getAttribute('aria-label')).toBe('label')
    expect(i3.getAttribute('aria-haspopup')).toBe('false')
    expect(i3.getAttribute('depth')).toBe('2')
    expect(i3.getAttribute('role')).toBe('menuitem')
    expect(i3.getAttribute('tabindex')).toBe('-1')

    expect(i4.getAttribute('aria-expanded')).toBe('false')
    // expect(i4.getAttribute('aria-label')).toBe('label')
    expect(i4.getAttribute('aria-haspopup')).toBe('true')
    expect(i4.getAttribute('depth')).toBe('2')
    expect(i4.getAttribute('role')).toBe('menuitem')
    expect(i4.getAttribute('tabindex')).toBe('-1')

    expect(sm3.getAttribute('aria-labelledby')).toBeNull()
    expect(sm3.getAttribute('depth')).toBe('2')
    expect(sm3.getAttribute('role')).toBe('menu')

    expect(i5.getAttribute('aria-expanded')).toBeNull()
    // expect(i5.getAttribute('aria-label')).toBe('label')
    expect(i5.getAttribute('aria-haspopup')).toBe('false')
    expect(i5.getAttribute('depth')).toBe('3')
    expect(i5.getAttribute('role')).toBe('menuitem')
    expect(i5.getAttribute('tabindex')).toBe('-1')
  })

  it('has correct aria without button', async () => {
    prepareMenuWithoutButton()
    await render(menu)

    // expect(menu.getAttribute('aria-label')).toBe('label')
    expect(menu.getAttribute('role')).toBe('menubar')

    expect(i1.getAttribute('aria-expanded')).toBeNull()
    // expect(i1.getAttribute('aria-label')).toBe('label')
    expect(i1.getAttribute('aria-haspopup')).toBe('false')
    expect(i1.getAttribute('depth')).toBe('0')
    expect(i1.getAttribute('role')).toBe('menuitem')
    expect(i1.getAttribute('tabindex')).toBe('-1')

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    // expect(i2.getAttribute('aria-label')).toBe('label')
    expect(i2.getAttribute('aria-haspopup')).toBe('true')
    expect(i2.getAttribute('depth')).toBe('0')
    expect(i2.getAttribute('role')).toBe('menuitem')
    expect(i2.getAttribute('tabindex')).toBe('-1')

    expect(sm1.getAttribute('aria-labelledby')).toBeNull()
    expect(sm1.getAttribute('depth')).toBe('1')
    expect(sm1.getAttribute('role')).toBe('menu')

    expect(i3.getAttribute('aria-expanded')).toBeNull()
    // expect(i3.getAttribute('aria-label')).toBe('label')
    expect(i3.getAttribute('aria-haspopup')).toBe('false')
    expect(i3.getAttribute('depth')).toBe('1')
    expect(i3.getAttribute('role')).toBe('menuitem')
    expect(i3.getAttribute('tabindex')).toBe('-1')

    expect(i4.getAttribute('aria-expanded')).toBe('false')
    // expect(i4.getAttribute('aria-label')).toBe('label')
    expect(i4.getAttribute('aria-haspopup')).toBe('true')
    expect(i4.getAttribute('depth')).toBe('1')
    expect(i4.getAttribute('role')).toBe('menuitem')
    expect(i4.getAttribute('tabindex')).toBe('-1')

    expect(sm2.getAttribute('aria-labelledby')).toBeNull()
    expect(sm2.getAttribute('depth')).toBe('2')
    expect(sm2.getAttribute('role')).toBe('menu')

    expect(i5.getAttribute('aria-expanded')).toBeNull()
    // expect(i5.getAttribute('aria-label')).toBe('label')
    expect(i5.getAttribute('aria-haspopup')).toBe('false')
    expect(i5.getAttribute('depth')).toBe('2')
    expect(i5.getAttribute('role')).toBe('menuitem')
    expect(i5.getAttribute('tabindex')).toBe('-1')

    expect(i6.getAttribute('aria-expanded')).toBe('false')
    // expect(i6.getAttribute('aria-label')).toBe('label')
    expect(i6.getAttribute('aria-haspopup')).toBe('true')
    expect(i6.getAttribute('depth')).toBe('2')
    expect(i6.getAttribute('role')).toBe('menuitem')
    expect(i6.getAttribute('tabindex')).toBe('-1')

    expect(sm3.getAttribute('aria-labelledby')).toBeNull()
    expect(sm3.getAttribute('depth')).toBe('3')
    expect(sm3.getAttribute('role')).toBe('menu')

    expect(i7.getAttribute('aria-expanded')).toBeNull()
    // expect(i7.getAttribute('aria-label')).toBe('label')
    expect(i7.getAttribute('aria-haspopup')).toBe('false')
    expect(i7.getAttribute('depth')).toBe('3')
    expect(i7.getAttribute('role')).toBe('menuitem')
    expect(i7.getAttribute('tabindex')).toBe('-1')
  })
})

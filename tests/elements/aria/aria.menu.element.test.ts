import { sleep } from '@aracna/core'
import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/aria/aria.menu.element'
import type { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../../../src/elements/aria/aria.menu.element'
import { dispatchKeyDownEvent, dispatchMouseEnterEvent, dispatchMouseLeaveEvent, render } from '../../../vitest/dom.utils'

/**
 * button
 *
 * sm1
 * i1           i4 -> sm3 -> i5
 * i2 -> sm2 -> i3
 * i6 -> sm4 -> i7
 * i8           i9
 */

/**
 *           i1 - i2 - i8 - i12
 *                sm1  sm4
 *                i3   i9
 *        sm2 <-  i4   i10 -> sm5
 *        i5                  i11
 * sm3 <- i6
 * i7
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
    i8: AriaMenuItemElement,
    i9: AriaMenuItemElement,
    i10: AriaMenuItemElement,
    i11: AriaMenuItemElement,
    i12: AriaMenuItemElement,
    sm1: AriaMenuSubMenuElement,
    sm2: AriaMenuSubMenuElement,
    sm3: AriaMenuSubMenuElement,
    sm4: AriaMenuSubMenuElement,
    sm5: AriaMenuSubMenuElement,
    oc1: Mock,
    oc3: Mock,
    oc5: Mock,
    oc7: Mock

  function prepareMenuWithButton() {
    i1.addEventListener('click', oc1)
    i3.addEventListener('click', oc3)
    i5.addEventListener('click', oc5)

    sm3.append(i5)
    i4.append(sm3)
    sm2.append(i3, i4)
    i2.append(sm2)

    sm4.append(i7)
    i6.append(sm4)

    sm1.append(i1, i2, i6, i8)
    menu.append(button, sm1)
  }

  function prepareMenuWithoutButton() {
    i1.addEventListener('click', oc1)
    i3.addEventListener('click', oc3)
    i5.addEventListener('click', oc5)
    i7.addEventListener('click', oc7)

    sm3.append(i7)
    i6.append(sm3)
    sm2.append(i5, i6)
    i4.append(sm2)
    sm1.append(i3, i4)
    i2.append(sm1)

    sm5.append(i11)
    i10.append(sm5)
    sm4.append(i9, i10)
    i8.append(sm4)

    menu.append(i1, i2, i8, i12)
  }

  beforeEach(() => {
    menu = document.createElement('aracna-aria-menu')

    button = document.createElement('aracna-aria-menu-button')
    i1 = document.createElement('aracna-aria-menu-item')
    i2 = document.createElement('aracna-aria-menu-item')
    i3 = document.createElement('aracna-aria-menu-item')
    i4 = document.createElement('aracna-aria-menu-item')
    i5 = document.createElement('aracna-aria-menu-item')
    i6 = document.createElement('aracna-aria-menu-item')
    i7 = document.createElement('aracna-aria-menu-item')
    i8 = document.createElement('aracna-aria-menu-item')
    i9 = document.createElement('aracna-aria-menu-item')
    i10 = document.createElement('aracna-aria-menu-item')
    i11 = document.createElement('aracna-aria-menu-item')
    i12 = document.createElement('aracna-aria-menu-item')
    sm1 = document.createElement('aracna-aria-menu-submenu')
    sm2 = document.createElement('aracna-aria-menu-submenu')
    sm3 = document.createElement('aracna-aria-menu-submenu')
    sm4 = document.createElement('aracna-aria-menu-submenu')
    sm5 = document.createElement('aracna-aria-menu-submenu')

    menu.collapseDebounceTime = 100

    oc1 = vi.fn()
    oc3 = vi.fn()
    oc5 = vi.fn()
    oc7 = vi.fn()
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
    expect(i1.getAttribute('tabindex')).toBe('0')

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    // expect(i2.getAttribute('aria-label')).toBe('label')
    expect(i2.getAttribute('aria-haspopup')).toBe('true')
    expect(i2.getAttribute('depth')).toBe('0')
    expect(i2.getAttribute('role')).toBe('menuitem')
    expect(i2.getAttribute('tabindex')).toBe('-1')

    expect(sm1.getAttribute('aria-labelledby')).toBeNull()
    expect(sm1.getAttribute('depth')).toBe('0')
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
    expect(sm2.getAttribute('depth')).toBe('1')
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
    expect(sm3.getAttribute('depth')).toBe('2')
    expect(sm3.getAttribute('role')).toBe('menu')

    expect(i7.getAttribute('aria-expanded')).toBeNull()
    // expect(i7.getAttribute('aria-label')).toBe('label')
    expect(i7.getAttribute('aria-haspopup')).toBe('false')
    expect(i7.getAttribute('depth')).toBe('3')
    expect(i7.getAttribute('role')).toBe('menuitem')
    expect(i7.getAttribute('tabindex')).toBe('-1')
  })

  it('expands and collapses submenus with button', async () => {
    prepareMenuWithButton()
    await render(menu)

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    dispatchMouseEnterEvent(button)
    await button.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    button.click()
    await button.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    dispatchMouseLeaveEvent(button)
    await button.updateComplete
    dispatchMouseEnterEvent(i1)
    await i1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    dispatchMouseLeaveEvent(i1)
    await i1.updateComplete
    dispatchMouseEnterEvent(i2)
    await i2.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    dispatchMouseLeaveEvent(i2)
    await i2.updateComplete
    dispatchMouseEnterEvent(i3)
    await i3.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    dispatchMouseLeaveEvent(i3)
    await i3.updateComplete
    dispatchMouseEnterEvent(i4)
    await i4.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i4)

    dispatchMouseLeaveEvent(i4)
    await i4.updateComplete
    dispatchMouseEnterEvent(i5)
    await i5.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i5)

    dispatchMouseLeaveEvent(i5)
    await i5.updateComplete
    dispatchMouseEnterEvent(i4)
    await i4.updateComplete
    dispatchMouseLeaveEvent(i4)
    await i4.updateComplete
    dispatchMouseEnterEvent(i3)
    await i3.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    dispatchMouseLeaveEvent(i3)
    await i3.updateComplete
    dispatchMouseEnterEvent(i2)
    await i2.updateComplete
    dispatchMouseLeaveEvent(i2)
    await i2.updateComplete
    dispatchMouseEnterEvent(i1)
    await i1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    dispatchMouseLeaveEvent(i1)
    await i1.updateComplete
    dispatchMouseEnterEvent(button)
    await button.updateComplete
    dispatchMouseLeaveEvent(button)
    await button.updateComplete
    await sleep(100)

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    button.click()
    await button.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('expands and collapses submenus without button', async () => {
    prepareMenuWithoutButton()
    await render(menu)

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    dispatchMouseEnterEvent(i2)
    await i2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    i2.click()
    await i2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    dispatchMouseLeaveEvent(i2)
    await i2.updateComplete
    dispatchMouseEnterEvent(i4)
    await i4.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    dispatchMouseLeaveEvent(i4)
    await i4.updateComplete
    dispatchMouseEnterEvent(i6)
    await i6.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i6)

    dispatchMouseLeaveEvent(i6)
    await i6.updateComplete
    dispatchMouseEnterEvent(i7)
    await i7.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i7)

    dispatchMouseLeaveEvent(i7)
    await i7.updateComplete
    dispatchMouseEnterEvent(i6)
    await i6.updateComplete
    dispatchMouseLeaveEvent(i6)
    await i6.updateComplete
    dispatchMouseEnterEvent(i5)
    await i5.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i5)

    dispatchMouseLeaveEvent(i5)
    await i5.updateComplete
    dispatchMouseEnterEvent(i4)
    await i4.updateComplete
    dispatchMouseLeaveEvent(i4)
    await i4.updateComplete
    dispatchMouseEnterEvent(i3)
    await i3.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    dispatchMouseLeaveEvent(i3)
    await i3.updateComplete
    dispatchMouseEnterEvent(i2)
    await i2.updateComplete
    dispatchMouseLeaveEvent(i2)
    await i2.updateComplete
    dispatchMouseEnterEvent(i1)
    await i1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    dispatchMouseLeaveEvent(i1)
    await i1.updateComplete
    dispatchMouseEnterEvent(i2)
    await i2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    dispatchMouseLeaveEvent(i2)
    await i2.updateComplete
    await sleep(100)

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    i2.click()
    await i2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)
  })

  it('can expand on mouse enter with button', async () => {
    prepareMenuWithButton()
    await render(menu, { 'expand-on-mouse-enter': 'true' })

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    dispatchMouseEnterEvent(button)
    await button.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('can expand on mouse enter without button', async () => {
    prepareMenuWithoutButton()
    await render(menu, { 'expand-on-mouse-enter': 'true' })

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    dispatchMouseEnterEvent(i2)
    await i2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)
  })

  it('can collapse on mouse leave with button', async () => {
    prepareMenuWithButton()
    await render(menu, { 'collapse-on-mouse-leave': 'true' })

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    button.click()
    await button.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    dispatchMouseLeaveEvent(button)
    await button.updateComplete
    await sleep(100)

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('supports keyboard usage with button', async () => {
    prepareMenuWithButton()
    await render(menu)

    /**
     * Expect all submenus to be collapsed and no focused items.
     */
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    /**
     * Press ARROW_DOWN and expect the first submenu to be expanded, the first item should be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_DOWN)
    await menu.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_UP and expect the previous (eigth) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_UP)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i8)

    /**
     * Press ARROW_DOWN and expect the next (first) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_DOWN)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_DOWN and expect the next (second) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_DOWN)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_UP and expect the previous (first) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_UP)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press END and expect the last (eigth) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.END)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i8)

    /**
     * Press HOME and expect the first item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.HOME)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_LEFT and expect nothing to happen.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_LEFT)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_RIGHT and expect nothing to happen.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_RIGHT)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_DOWN and expect the next (second) item to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_DOWN)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_LEFT and expect nothing to happen.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_LEFT)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_RIGHT and expect the second submenu to be expanded, the first (third) item of the second submenu should be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_RIGHT)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    /**
     * Press ARROW_DOWN and expect the second (fourth) item of the second submenu to be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ARROW_DOWN)
    await sm2.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    /**
     * Press ENTER and expect the third submenu to be expanded, the first (fifth) item of the third submenu should be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ENTER)
    await sm2.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i5)

    /**
     * Press ENTER and expect the first (fifth) item of the third submenu to be clicked.
     */
    dispatchKeyDownEvent(sm3, KeyboardEventKey.ENTER)
    await sm3.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i5)
    expect(oc5).toBeCalledTimes(1)

    /**
     * Press ARROW_LEFT and expect the third submenu to be collapsed, the parent (fourth) item should be focused.
     */
    dispatchKeyDownEvent(sm3, KeyboardEventKey.ARROW_LEFT)
    await sm3.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    /**
     * Press ARROW_LEFT and expect the second submenu to be collapsed, the parent (second) item should be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ARROW_LEFT)
    await sm2.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_LEFT and expect nothing to happen.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_LEFT)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ESCAPE and expect the first submenu to be collapsed.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ESCAPE)
    await sm1.updateComplete

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('supports keyboard usage without button', async () => {
    prepareMenuWithoutButton()
    await render(menu)

    /**
     * Expect all submenus to be collapsed and no item to be focused.
     */
    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(document.body)

    /**
     * Focus the first item and expect it to be focused.
     */
    i1.focus()
    await i1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_LEFT and expect the previous (twelfth) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_LEFT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i12)

    /**
     * Press ARROW_RIGHT and expect the next (first) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_RIGHT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_RIGHT and expect the next (second) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_RIGHT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_LEFT and expect the previous (first) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_LEFT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press END and expect the last (twelfth) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.END)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i12)

    /**
     * Press HOME and expect the first (first) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.HOME)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_UP and expect nothing to happen.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_UP)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_DOWN and expect nothing to happen.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_DOWN)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ENTER and expect the first item to be clicked.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ENTER)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)
    expect(oc1).toBeCalledTimes(1)

    /**
     * Press ARROW_RIGHT and expect the next (second) item to be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_RIGHT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_DOWN and expect the first submenu to be expanded, the first (third) item of the submenu should be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_DOWN)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    /**
     * Press ARROW_LEFT and expect the first submenu to be collapsed, the first item should be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_LEFT)
    await sm1.updateComplete
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_LEFT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Press ARROW_RIGHT and expect the first submenu to be expanded, the second item should be focused.
     */
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_RIGHT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)

    /**
     * Press ARROW_DOWN and expect the first item of the first submenu to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_DOWN)
    await sm1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i3)

    /**
     * Press ARROW_DOWN and expect the second item of the first submenu to be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_DOWN)
    await sm1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    /**
     * Press ARROW_RIGHT and expect the second submenu to be expanded, the first item of the second submenu should be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_RIGHT)
    await sm1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i5)

    /**
     * Press ARROW_DOWN and expect the second item of the second submenu to be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ARROW_DOWN)
    await sm2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i6)

    /**
     * Press ARROW_RIGHT and expect the third submenu to be expanded, the first item of the third submenu should be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ARROW_RIGHT)
    await sm2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i7)

    /**
     * Press ARROW_LEFT and expect the third submenu to be collapsed, the parent item of the third submenu should be focused.
     */
    dispatchKeyDownEvent(sm3, KeyboardEventKey.ARROW_LEFT)
    await sm3.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i6)

    /**
     * Press ARROW_LEFT and expect the second submenu to be collapsed, the parent item of the second submenu should be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ARROW_LEFT)
    await sm2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    /**
     * Press ARROW_LEFT and expect the first submenu to be collapsed, the first item should be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ARROW_LEFT)
    await sm1.updateComplete
    dispatchKeyDownEvent(menu, KeyboardEventKey.ARROW_LEFT)
    await menu.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i1)

    /**
     * Expand all submenus and focus first item of the third submenu.
     */
    sm1.expand()
    await sm1.updateComplete
    sm2.expand()
    await sm2.updateComplete
    sm3.expand()
    await sm3.updateComplete
    i7.focus()
    await i7.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('true')
    expect(sm3.getAttribute('expanded')).not.toBeNull()
    expect(document.activeElement).toBe(i7)

    /**
     * Press ESCAPE and expect the third submenu to be collapsed, the parent item of the third submenu should be focused.
     */
    dispatchKeyDownEvent(sm3, KeyboardEventKey.ESCAPE)
    await sm3.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('true')
    expect(sm2.getAttribute('expanded')).not.toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i6)

    /**
     * Press ESCAPE and expect the second submenu to be collapsed, the parent item of the second submenu should be focused.
     */
    dispatchKeyDownEvent(sm2, KeyboardEventKey.ESCAPE)
    await sm2.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('true')
    expect(sm1.getAttribute('expanded')).not.toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i4)

    /**
     * Press ESCAPE and expect the first submenu to be collapsed, the parent item of the first submenu should be focused.
     */
    dispatchKeyDownEvent(sm1, KeyboardEventKey.ESCAPE)
    await sm1.updateComplete

    expect(i2.getAttribute('aria-expanded')).toBe('false')
    expect(sm1.getAttribute('expanded')).toBeNull()
    expect(i4.getAttribute('aria-expanded')).toBe('false')
    expect(sm2.getAttribute('expanded')).toBeNull()
    expect(i6.getAttribute('aria-expanded')).toBe('false')
    expect(sm3.getAttribute('expanded')).toBeNull()
    expect(document.activeElement).toBe(i2)
  })
})

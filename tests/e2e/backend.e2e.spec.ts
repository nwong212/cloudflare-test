import { test, expect, Page } from '@playwright/test'

// go to admin and test stylesheets.

test.describe('Backend Styles', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go to admin', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')

    await expect(page).toHaveTitle(/Login \- Payload/)
  })

  test('styles loaded do not include the dummy style added in.', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')

    const locator = page.locator('html')

    if ((await locator.getAttribute('data-theme')) === 'light') {
      expect(locator).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    } else if ((await locator.getAttribute('data-theme')) === 'dark') {
      expect(locator).toHaveCSS('background-color', 'rgb(20, 20, 20)')
    }
  })
})

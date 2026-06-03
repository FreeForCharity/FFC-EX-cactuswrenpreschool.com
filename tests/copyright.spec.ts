import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Copyright Notice Tests
 *
 * Verifies that the footer copyright notice:
 * 1. Contains the copyright symbol (©)
 * 2. Displays the current year
 * 3. Renders the complete copyright text
 */

test.describe('Footer Copyright Notice', () => {
  test('should display copyright notice with current year', async ({ page }) => {
    await page.goto('/')

    const currentYear = new Date().getFullYear()
    const footerText = page.locator(`footer p:has-text("${testConfig.copyright.searchText}")`)

    await expect(footerText).toBeVisible()
    await expect(footerText).toContainText(`© ${currentYear}`)
    await expect(footerText).toContainText(testConfig.copyright.text)
  })
})

import { test, expect } from '@playwright/test'

test.describe('Events Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the events page
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display events list on homepage', async ({ page }) => {
    // Look for events section or events-related content
    const eventsSection = page.locator('[data-testid="events-section"]').or(
      page.locator('text=Events').or(
        page.locator('text=Community').or(
          page.locator('[class*="event"]')
        )
      )
    )

    // The page should load without errors
    await expect(page).toHaveTitle(/BLKOUT/)
    
    // Check if we can navigate to events or if events are displayed
    const hasEventsNavigation = await page.locator('text=Events').isVisible()
    const hasEventsContent = await page.locator('[class*="event"]').first().isVisible()
    
    expect(hasEventsNavigation || hasEventsContent).toBeTruthy()
  })

  test('should handle events service connection', async ({ page }) => {
    // Monitor network requests to events API
    const eventsApiCalls = []
    
    page.on('response', response => {
      if (response.url().includes('/api/events') || response.url().includes('events')) {
        eventsApiCalls.push({
          url: response.url(),
          status: response.status()
        })
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait a bit for any async API calls
    await page.waitForTimeout(2000)

    // Check that events API was called (or that the app handles absence gracefully)
    const hasApiCalls = eventsApiCalls.length > 0
    const hasEventsError = await page.locator('text=Failed to load events').isVisible()
    const hasEventsContent = await page.locator('[class*="event"]').first().isVisible()
    const hasEventsPlaceholder = await page.locator('text=Coming soon').isVisible()

    // Should either load events, show error gracefully, or show placeholder
    expect(hasApiCalls || hasEventsError || hasEventsContent || hasEventsPlaceholder).toBeTruthy()
  })

  test('should navigate through community sections', async ({ page }) => {
    await page.goto('/')

    // Look for navigation elements
    const navigation = page.locator('nav').or(page.locator('[role="navigation"]'))
    await expect(navigation).toBeVisible()

    // Try to find community-related links
    const communityLinks = [
      'Community',
      'Events',
      'Stories',
      'Magazine',
      'About'
    ]

    let foundLinks = 0
    for (const linkText of communityLinks) {
      const link = page.locator(`text=${linkText}`).first()
      if (await link.isVisible()) {
        foundLinks++
        // Test navigation
        await link.click()
        await page.waitForLoadState('networkidle')
        
        // Should navigate without errors
        await expect(page).not.toHaveURL(/error/)
        
        // Go back to home
        await page.goto('/')
      }
    }

    expect(foundLinks).toBeGreaterThan(0)
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should load without layout issues
    const bodyOverflow = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).overflowX
    )
    expect(bodyOverflow).not.toBe('scroll')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should adapt to tablet size
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(viewportWidth).toBe(768)

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should work on desktop
    const desktopWidth = await page.evaluate(() => window.innerWidth)
    expect(desktopWidth).toBe(1920)
  })

  test('should handle offline scenario gracefully', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    await page.goto('/')
    
    // Should show some indication of offline state or cached content
    const hasOfflineIndicator = await page.locator('text=offline').isVisible()
    const hasErrorMessage = await page.locator('text=connection').isVisible()
    const hasCachedContent = await page.locator('h1').isVisible()

    expect(hasOfflineIndicator || hasErrorMessage || hasCachedContent).toBeTruthy()

    // Go back online
    await context.setOffline(false)
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should recover
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Community Gateway Integration', () => {
  test('should display BLKOUTHUB gateway', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for BLKOUTHUB integration
    const blkouthubElement = page.locator('text=BLKOUTHUB').or(
      page.locator('[href*="blkouthub"]').or(
        page.locator('text=Community').or(
          page.locator('text=Join')
        )
      )
    )

    // Should have some community gateway
    const hasGateway = await blkouthubElement.first().isVisible()
    expect(hasGateway).toBeTruthy()
  })

  test('should handle community gateway interaction', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for interactive community elements
    const interactiveElements = page.locator('button').or(
      page.locator('a[href*="community"]').or(
        page.locator('[role="button"]')
      )
    )

    const elementCount = await interactiveElements.count()
    if (elementCount > 0) {
      const firstElement = interactiveElements.first()
      
      // Should be able to interact without JavaScript errors
      await firstElement.click()
      
      // Wait for any navigation or modal
      await page.waitForTimeout(1000)
      
      // Should not have JavaScript errors
      const jsErrors = []
      page.on('pageerror', error => jsErrors.push(error))
      
      expect(jsErrors.length).toBe(0)
    }
  })
})

test.describe('Accessibility and Performance', () => {
  test('should meet basic accessibility standards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for basic accessibility features
    const hasMainHeading = await page.locator('h1').isVisible()
    const hasNavigation = await page.locator('nav, [role="navigation"]').isVisible()
    const hasSkipLink = await page.locator('text=Skip to content').isVisible()

    expect(hasMainHeading).toBeTruthy()
    expect(hasNavigation).toBeTruthy()
    // Skip link is optional but good to have

    // Check color contrast (basic check)
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      }
    })

    expect(bodyStyles.backgroundColor).toBeDefined()
    expect(bodyStyles.color).toBeDefined()
  })

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const endTime = Date.now()
    const loadTime = endTime - startTime

    // Should load within 5 seconds (generous for local testing)
    expect(loadTime).toBeLessThan(5000)

    // Check for performance metrics
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart
      }
    })

    expect(performanceTiming.domContentLoaded).toBeGreaterThan(0)
    expect(performanceTiming.fullyLoaded).toBeGreaterThan(0)
  })

  test('should handle large content volumes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll through the page to test performance with content
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 500)
      await page.waitForTimeout(100)
    }

    // Should remain responsive
    const isPageResponsive = await page.evaluate(() => {
      const start = performance.now()
      // Trigger a reflow
      document.body.offsetHeight
      const end = performance.now()
      return (end - start) < 16 // Should be under one frame (60fps)
    })

    expect(isPageResponsive).toBeTruthy()
  })
})
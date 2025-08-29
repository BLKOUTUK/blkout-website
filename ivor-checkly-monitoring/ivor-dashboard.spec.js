/**
 * IVOR Dashboard E2E Browser Test
 * Tests the monitoring dashboard UI and service status visualization
 */

import { test, expect } from '@playwright/test';

const IVOR_MONITORING = 'https://ivor-monitoring-service.vercel.app';
const TELEGRAM_WEBHOOK = process.env.CHECKLY_TELEGRAM_WEBHOOK;

test('IVOR Monitoring Dashboard E2E Test', async ({ page }) => {
  console.log('🖥️ Testing IVOR monitoring dashboard UI...');

  // Navigate to IVOR monitoring dashboard
  await page.goto(IVOR_MONITORING);
  
  // Wait for dashboard to load
  await page.waitForLoadState('networkidle');
  
  // Verify page title and basic structure
  await expect(page).toHaveTitle(/IVOR/i);
  
  // Check that all 6 IVOR services are displayed
  const expectedServices = [
    'ivor-frontend',
    'ivor-api-gateway', 
    'ivor-core',
    'ivor-organizing',
    'ivor-community',
    'ivor-social'
  ];

  for (const service of expectedServices) {
    await expect(page.locator(`text=${service}`)).toBeVisible();
    console.log(`✅ Service found: ${service}`);
  }
  
  // Check for healthy status indicators (look for various possible selectors)
  const healthyIndicators = [
    '.service-status.healthy',
    '.status.healthy', 
    '[data-status="healthy"]',
    '.health-indicator.green',
    'text=healthy'
  ];
  
  let healthyCount = 0;
  for (const selector of healthyIndicators) {
    try {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        healthyCount = Math.max(healthyCount, count);
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // At least 4 out of 6 services should be healthy
  expect(healthyCount).toBeGreaterThan(3);
  console.log(`✅ IVOR Dashboard: ${healthyCount} healthy services detected`);
  
  // Check for liberation-centered messaging
  const liberationKeywords = [
    'Black queer',
    'liberation',
    'community',
    'democratic',
    'cooperative'
  ];
  
  let foundLibrationContent = false;
  for (const keyword of liberationKeywords) {
    try {
      await expect(page.locator(`text=${keyword}`)).toBeVisible();
      foundLibrationContent = true;
      console.log(`✅ Liberation-centered content found: ${keyword}`);
      break;
    } catch (e) {
      // Continue searching
    }
  }
  
  expect(foundLibrationContent).toBe(true);
  
  // Test dashboard responsiveness
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  await page.waitForTimeout(1000);
  
  // Verify mobile layout works
  const mobileServiceList = page.locator('text=ivor-frontend');
  await expect(mobileServiceList).toBeVisible();
  
  console.log('✅ Mobile responsiveness verified');
  
  // Return to desktop view
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('🎉 IVOR Dashboard E2E test completed successfully');
});

test('IVOR Dashboard Performance Test', async ({ page }) => {
  console.log('⚡ Testing IVOR dashboard performance...');
  
  const startTime = Date.now();
  
  await page.goto(IVOR_MONITORING);
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  // Dashboard should load within 5 seconds
  expect(loadTime).toBeLessThan(5000);
  
  if (loadTime > 3000) {
    console.log(`⚠️ Slow dashboard load detected: ${loadTime}ms`);
  } else {
    console.log(`✅ Dashboard load time healthy: ${loadTime}ms`);
  }
  
  // Test that service status updates are visible
  const statusElements = page.locator('[class*="status"], [class*="health"]');
  const statusCount = await statusElements.count();
  
  expect(statusCount).toBeGreaterThan(0);
  console.log(`✅ Status indicators found: ${statusCount}`);
});

// Send alert on test failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed' && TELEGRAM_WEBHOOK) {
    const alertMessage = `🚨 IVOR DASHBOARD MONITORING ALERT

Test Failed: ${testInfo.title}
Error: ${testInfo.error?.message || 'Unknown error'}
Page: ${IVOR_MONITORING}
Time: ${new Date().toLocaleString()}

Dashboard may be inaccessible or showing service failures!
Check immediately: ${IVOR_MONITORING}`;

    try {
      // Use fetch to send Telegram alert
      const response = await fetch(TELEGRAM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: alertMessage })
      });
      
      if (response.ok) {
        console.log('📱 Dashboard failure alert sent to Telegram');
      }
    } catch (error) {
      console.error('Failed to send Telegram alert:', error);
    }
  }
});
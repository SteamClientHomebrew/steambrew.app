import { test, expect } from '@playwright/test';

test.describe('Plugins page', () => {
	test('loads with correct title', async ({ page }) => {
		await page.goto('/plugins');
		await expect(page).toHaveTitle('Plugins • Millennium');
	});

	test('displays heading and search input', async ({ page }) => {
		await page.goto('/plugins');
		await expect(page.locator('h1')).toContainText("Let's Get Plugging!");
		await expect(page.locator('#addon-search')).toBeVisible();
	});

	test('search filters results', async ({ page }) => {
		await page.goto('/plugins');
		const search = page.locator('#addon-search');
		await search.fill('zzz_no_match_xyz_123');
		await expect(page.locator('.no-results-title')).toBeVisible();
	});
});

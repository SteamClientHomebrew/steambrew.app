import { test, expect } from '@playwright/test';

test.describe('Themes page', () => {
	test('loads with correct title', async ({ page }) => {
		await page.goto('/themes');
		await expect(page).toHaveTitle('Themes • Millennium');
	});

	test('displays heading and search input', async ({ page }) => {
		await page.goto('/themes');
		await expect(page.locator('h1')).toContainText("Pick a Flavour!");
		await expect(page.locator('#addon-search')).toBeVisible();
	});

	test('search filters results', async ({ page }) => {
		await page.goto('/themes');
		const search = page.locator('#addon-search');
		await search.fill('zzz_no_match_xyz_123');
		await expect(page.locator('.no-results-title')).toBeVisible();
	});
});

import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('loads and displays hero content', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Millennium/);
		await expect(page.locator('h1').first()).toContainText('Millennium');
	});

	test('theme and plugin section headings are visible', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Themes', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Plugins', { exact: true }).first()).toBeVisible();
	});

	test('navigation links are present', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('a[href="/themes"]').first()).toBeVisible();
		await expect(page.locator('a[href="/plugins"]').first()).toBeVisible();
	});
});

import { test, expect } from '@playwright/test';

test.describe('GET /api/millennium/stats', () => {
	test('returns 200 with downloadCount and latestVersion', async ({ request }) => {
		const res = await request.get('/api/millennium/stats');
		expect(res.status()).toBe(200);

		const data = await res.json();
		expect(data).toHaveProperty('downloadCount');
		expect(data).toHaveProperty('latestVersion');
		expect(typeof data.downloadCount).toBe('number');
		expect(data.downloadCount).toBeGreaterThan(0);
		expect(typeof data.latestVersion).toBe('string');
		expect(data.latestVersion.length).toBeGreaterThan(0);
	});
});

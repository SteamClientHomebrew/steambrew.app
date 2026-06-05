import { test, expect } from '@playwright/test';

test.describe('GET /api/v1/plugins', () => {
	test('returns 200 with an array', async ({ request }) => {
		const res = await request.get('/api/v1/plugins');
		if (res.status() !== 200) {
			console.error('Response body:', await res.text());
		}
		expect(res.status()).toBe(200);

		const data = await res.json();
		expect(Array.isArray(data)).toBe(true);
	});
});

test.describe('GET /api/v2/details/[slug]', () => {
	test('returns 404 for an unknown slug', async ({ request }) => {
		const res = await request.get('/api/v2/details/__nonexistent_slug_xyz__');
		expect(res.status()).toBe(404);

		const data = await res.json();
		expect(data).toHaveProperty('error', 'NOT_FOUND');
	});

	test('returns 400 for an empty slug', async ({ request }) => {
		const res = await request.get('/api/v2/details/%20');
		expect([400, 404]).toContain(res.status());
	});
});

import { test, expect } from '@playwright/test';

test.describe('GET /api/v2', () => {
	test('returns 200 with an array of themes', async ({ request }) => {
		const res = await request.get('/api/v2');
		expect(res.status()).toBe(200);

		const data = await res.json();
		expect(Array.isArray(data)).toBe(true);

		if (data.length > 0) {
			const theme = data[0];
			expect(theme).toHaveProperty('name');
			expect(theme).toHaveProperty('download');
			expect(theme).toHaveProperty('description');
		}
	});
});

test.describe('POST /api/v2/checkupdates', () => {
	test('returns 200 with an array for a valid body', async ({ request }) => {
		const res = await request.post('/api/v2/checkupdates', {
			data: [{ owner: 'SteamClientHomebrew', repo: 'Millennium' }],
		});
		expect(res.status()).toBe(200);

		const data = await res.json();
		expect(Array.isArray(data)).toBe(true);
		expect(data).toHaveLength(1);
		expect(data[0]).toHaveProperty('download');
		expect(data[0]).toHaveProperty('commit');
	});
});

import { test, expect } from '@playwright/test';

test.describe('GET /api/stats', () => {
	test('returns 200 with expected shape', async ({ request }) => {
		const res = await request.get('/api/stats');
		expect(res.status()).toBe(200);

		const data = await res.json();
		expect(data).toHaveProperty('requests');
		expect(data).toHaveProperty('requests.per_second');
		expect(data).toHaveProperty('requests.last_minute');
		expect(data).toHaveProperty('requests.last_hour');
		expect(data).toHaveProperty('requests.last_24h');
		expect(data).toHaveProperty('bandwidth');
		expect(data).toHaveProperty('bandwidth.last_minute');
		expect(data).toHaveProperty('status_codes');
		expect(data).toHaveProperty('status_codes.2xx');
		expect(data).toHaveProperty('sources');
		expect(data).toHaveProperty('as_of');
		expect(new Date(data.as_of).getTime()).not.toBeNaN();
	});
});

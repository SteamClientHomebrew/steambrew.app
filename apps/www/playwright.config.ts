import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			testMatch: /e2e\/.+\.spec\.ts/,
		},
		{
			name: 'api',
			use: {},
			testMatch: /api\/.+\.spec\.ts/,
		},
	],
	webServer: {
		command: 'bun run dev',
		url: BASE_URL,
		reuseExistingServer: true,
		timeout: 120_000,
	},
});

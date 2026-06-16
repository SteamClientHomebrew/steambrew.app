import type { NextConfig } from 'next';

const config: NextConfig = {
	serverExternalPackages: ['better-sqlite3'],
	async redirects() {
		return [
			{
				source: '/plugin',
				has: [{ type: 'query', key: 'id', value: '(?<id>.+)' }],
				destination: '/plugin/:id',
				permanent: false,
			},
			{
				source: '/theme',
				has: [{ type: 'query', key: 'id', value: '(?<id>.+)' }],
				destination: '/theme/:id',
				permanent: false,
			},
		];
	},
};

export default config;

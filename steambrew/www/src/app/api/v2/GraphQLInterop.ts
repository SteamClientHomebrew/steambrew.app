const GithubGraphQL = {
	Post: async (body: string): Promise<{ data: Record<string, any> }> => {
		const rateLimitFields = `
			rateLimit {
				limit
				cost
				remaining
				resetAt
			}
		`;

		const queryWithRateLimit = body.replace(/}(\s*)$/, `${rateLimitFields}}$1`);

		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(process.env.BEARER ? { Authorization: process.env.BEARER } : {}),
			},
			body: JSON.stringify({ query: queryWithRateLimit }),
			cache: 'no-store',
			signal: AbortSignal.timeout(30000),
		});

		const json = await response.json();

		if (json.data && json.data.rateLimit) {
			const { rateLimit, ...dataWithoutRateLimit } = json.data;
			json.data = dataWithoutRateLimit;
		}

		return json;
	},
};

export { GithubGraphQL };

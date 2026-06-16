export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const { getDb } = await import('./app/api/Database');
		getDb(); // open and cache the connection at startup
		console.log('Database ready');
	}
}

// On the server, bypass nginx and hit the Next.js process directly.
// On the client, always use the public origin.
const API_URL = typeof window === 'undefined' ? `http://localhost:${process.env.PORT ?? 3000}` : process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://steambrew.app';

export { API_URL };

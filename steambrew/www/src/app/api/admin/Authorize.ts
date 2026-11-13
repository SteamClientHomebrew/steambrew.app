import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string) => createHash('sha256').update(value).digest();

export function AuthorizeAdmin(request: Request): Response | null {
	const expected = process.env.ADMIN_TOKEN;
	if (!expected) {
		return Response.json({ error: 'Admin API is not configured' }, { status: 503 });
	}

	const header = request.headers.get('authorization') ?? '';
	const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

	if (!timingSafeEqual(digest(provided), digest(expected))) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	return null;
}

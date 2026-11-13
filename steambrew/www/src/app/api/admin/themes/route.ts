import { AuthorizeAdmin } from '../Authorize';
import { AddTheme, AdminError, ChangeTheme, ParseThemeInput, SyncThemes } from './ThemeAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	const denied = AuthorizeAdmin(request);
	if (denied) return denied;

	let body: any;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: 'Body must be valid JSON' }, { status: 400 });
	}

	try {
		switch (body?.action) {
			case 'add':
				return Response.json({ ok: true, ...(await AddTheme(ParseThemeInput(body))) }, { status: 201 });
			case 'enable':
			case 'disable':
			case 'remove':
				return Response.json({ ok: true, ...ChangeTheme(body.action, ParseThemeInput(body)) });
			case 'sync':
				return Response.json({ ok: true, ...(await SyncThemes(body.themes)) });
			default:
				return Response.json({ error: 'action must be one of add, enable, disable, remove, sync' }, { status: 400 });
		}
	} catch (error) {
		if (error instanceof AdminError) {
			return Response.json({ error: error.message, details: error.details }, { status: error.status });
		}
		console.error('[/api/admin/themes]', error instanceof Error ? error.message : error);
		return Response.json({ error: 'Internal error' }, { status: 500 });
	}
}

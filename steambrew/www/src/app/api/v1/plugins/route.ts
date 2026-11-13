import { FetchPlugins } from './GetPlugins';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	try {
		const { pluginData } = await FetchPlugins();
		return Response.json(pluginData.filter((plugin) => !plugin.unlisted));
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error('[/api/v1/plugins]', message);
		return Response.json({ error: message }, { status: 500 });
	}
}

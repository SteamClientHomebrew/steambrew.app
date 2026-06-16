import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { PluginDownloads } from '../../../Database';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const pluginId = searchParams.get('id');
	const downloadName = searchParams.get('n') || 'plugin.zip';

	if (!pluginId) {
		return new Response('Missing plugin ID', { status: 400 });
	}

	if (!/^[a-f0-9]{40}$/.test(pluginId)) {
		return new Response('Invalid plugin ID', { status: 400 });
	}

	const pluginsDir = process.env.PLUGINS_DIR;
	if (!pluginsDir) return new Response('PLUGINS_DIR not configured', { status: 500 });

	const filePath = join(pluginsDir, `${pluginId}.zip`);

	let contents: Buffer;
	try {
		contents = await readFile(filePath);
	} catch {
		return new Response(JSON.stringify({ error: 'File not found.' }), { status: 404 });
	}

	try {
		PluginDownloads.increment(pluginId);
	} catch (err) {
		console.error('Error updating download count:', err);
	}

	return new Response(contents, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${downloadName}"`,
		},
	});
}

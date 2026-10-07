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

	const candidates = [
		{ ext: 'zip', contentType: 'application/zip' },
		{ ext: 'star', contentType: 'application/octet-stream' },
	];

	let contents: Buffer | undefined;
	let contentType = 'application/zip';

	for (const candidate of candidates) {
		try {
			contents = await readFile(join(pluginsDir, `${pluginId}.${candidate.ext}`));
			contentType = candidate.contentType;
			break;
		} catch {
			continue;
		}
	}

	if (!contents) {
		return new Response(JSON.stringify({ error: 'File not found.' }), { status: 404 });
	}

	try {
		PluginDownloads.increment(pluginId);
	} catch (err) {
		console.error('Error updating download count:', err);
	}

	return new Response(new Uint8Array(contents), {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `attachment; filename="${downloadName}"`,
		},
	});
}

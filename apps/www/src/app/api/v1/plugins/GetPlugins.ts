import { join } from 'path';
import { stat } from 'fs/promises';
import { PluginDownloads } from '../../Database';
import { GetPluginData, PluginDataTable } from './GetPluginData';
import { GetPluginMetadata } from './GetPluginMetadata';
import { RetrievePluginList } from './GetPluginList';

const FormatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
};

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION_MS = 5 * 60 * 1000;

// In-memory cache — single source of truth, no Firestore round-trips
let cachedResult: PluginDataTable | null = null;
let cacheTimestamp = 0;

// In-flight promise — deduplicates concurrent requests so only one fetch runs at a time
let inflightFetch: Promise<PluginDataTable> | null = null;

const fetchFreshPlugins = async (): Promise<PluginDataTable> => {
	const pluginList = await RetrievePluginList();

	const pluginsDir = process.env.PLUGINS_DIR;
	if (!pluginsDir) throw new Error('PLUGINS_DIR is not set');

	const [metadata, pluginData, downloadRows] = await Promise.all([
		GetPluginMetadata(),
		GetPluginData(pluginList),
		Promise.resolve(PluginDownloads.getAll()),
	]);

	// Build file size map from local disk
	const fileMetadataMap = new Map<string, number>();
	await Promise.all(
		(await import('fs/promises').then(({ readdir }) => readdir(pluginsDir).catch(() => [] as string[]))).map(async (filename) => {
			if (!filename.endsWith('.zip')) return;
			try {
				const s = await stat(join(pluginsDir, filename));
				fileMetadataMap.set(`plugins/${filename}`, s.size);
			} catch { }
		}),
	);

	const downloadCounts = new Map<string, number>();
	downloadRows.forEach((row) => {
		downloadCounts.set(row.commit_id, row.download_count);
	});

	const metadataByCommit = new Map(metadata.map((m) => [m.commitId, m]));

	for (const plugin of pluginData) {
		const meta = metadataByCommit.get(plugin.id);
		if (!meta) {
			console.warn(`Plugin ${plugin.repoOwner}/${plugin.repoName} has no metadata entry (commitId: ${plugin.id})`);
			continue;
		}

		const initCommitId = meta.id;
		const filePath = `plugins/${initCommitId}.zip`;
		const fileSize = fileMetadataMap.get(filePath);
		if (fileSize !== undefined) {
			plugin.downloadSize = FormatBytes(fileSize);
		}

		plugin.downloadCount = downloadCounts.get(initCommitId) ?? 0;
		plugin.id = initCommitId.substring(0, 12);
		plugin.commitId = meta.commitId;
		plugin.initCommitId = initCommitId;
	}

	return { pluginData, metadata };
};

export const FetchPlugins = async (): Promise<PluginDataTable> => {
	if (cachedResult && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
		return cachedResult;
	}

	if (inflightFetch) {
		return inflightFetch;
	}

	inflightFetch = fetchFreshPlugins()
		.then((result) => {
			cachedResult = result;
			cacheTimestamp = Date.now();
			return result;
		})
		.finally(() => {
			inflightFetch = null;
		});

	return inflightFetch;
};

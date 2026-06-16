import BetterSqlite3 from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

let _db: BetterSqlite3.Database | null = null;

export function getDb(): BetterSqlite3.Database {
	if (!_db) {
		const path = process.env.DB_PATH;
		if (!path) throw new Error('DB_PATH is not set');
		mkdirSync(dirname(path), { recursive: true });
		_db = new BetterSqlite3(path);
		_db.pragma('journal_mode = WAL');
		_db.pragma('foreign_keys = ON');
	}
	return _db;
}

export interface ThemeRow {
	id: string;
	owner: string;
	repo: string;
	readme: string | null;
	disabled: number;
	downloads: number;
	created_at: number;
}

export const Themes = {
	getAll: (): ThemeRow[] => {
		return getDb().prepare('SELECT * FROM themes WHERE disabled = 0').all() as ThemeRow[];
	},
	getById: (id: string): ThemeRow | null => {
		return (getDb().prepare('SELECT * FROM themes WHERE id = ?').get(id) as ThemeRow) ?? null;
	},
	getByRepo: (owner: string, repo: string): ThemeRow | null => {
		return (getDb().prepare('SELECT * FROM themes WHERE owner = ? AND repo = ?').get(owner, repo) as ThemeRow) ?? null;
	},
	incrementDownload: (id: string): number => {
		getDb().prepare('UPDATE themes SET downloads = downloads + 1 WHERE id = ?').run(id);
		const row = getDb().prepare('SELECT downloads FROM themes WHERE id = ?').get(id) as { downloads: number } | null;
		return row?.downloads ?? 0;
	},
};

export interface PluginDownloadRow {
	commit_id: string;
	download_count: number;
}

export const PluginDownloads = {
	getAll: (): PluginDownloadRow[] => {
		return getDb().prepare('SELECT * FROM plugin_downloads').all() as PluginDownloadRow[];
	},
	getCount: (commitId: string): number => {
		const row = getDb().prepare('SELECT download_count FROM plugin_downloads WHERE commit_id = ?').get(commitId) as
			| { download_count: number }
			| null;
		return row?.download_count ?? 0;
	},
	increment: (commitId: string): number => {
		getDb()
			.prepare(
				'INSERT INTO plugin_downloads (commit_id, download_count) VALUES (?, 1) ON CONFLICT(commit_id) DO UPDATE SET download_count = download_count + 1',
			)
			.run(commitId);
		return PluginDownloads.getCount(commitId);
	},
};

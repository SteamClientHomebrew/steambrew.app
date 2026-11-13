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
	getEvery: (): ThemeRow[] => {
		return getDb().prepare('SELECT * FROM themes').all() as ThemeRow[];
	},
	insert: (id: string, owner: string, repo: string, readme: string | null, disabled: boolean): void => {
		getDb()
			.prepare('INSERT INTO themes (id, owner, repo, readme, disabled, downloads, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)')
			.run(id, owner, repo, readme, disabled ? 1 : 0, Math.floor(Date.now() / 1000));
	},
	setDisabled: (id: string, disabled: boolean): void => {
		getDb().prepare('UPDATE themes SET disabled = ? WHERE id = ?').run(disabled ? 1 : 0, id);
	},
	setReadme: (id: string, readme: string | null): void => {
		getDb().prepare('UPDATE themes SET readme = ? WHERE id = ?').run(readme, id);
	},
	remove: (id: string): void => {
		getDb().prepare('DELETE FROM themes WHERE id = ?').run(id);
	},
	incrementDownload: (id: string): number => {
		getDb().prepare('UPDATE themes SET downloads = downloads + 1 WHERE id = ?').run(id);
		const row = getDb().prepare('SELECT downloads FROM themes WHERE id = ?').get(id) as {
			downloads: number;
		} | null;
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
		const row = getDb().prepare('SELECT download_count FROM plugin_downloads WHERE commit_id = ?').get(commitId) as { download_count: number } | null;
		return row?.download_count ?? 0;
	},
	increment: (commitId: string): number => {
		getDb().prepare('INSERT INTO plugin_downloads (commit_id, download_count) VALUES (?, 1) ON CONFLICT(commit_id) DO UPDATE SET download_count = download_count + 1').run(commitId);
		return PluginDownloads.getCount(commitId);
	},
};

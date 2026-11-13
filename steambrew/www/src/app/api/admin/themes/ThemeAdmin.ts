import { randomBytes } from 'node:crypto';
import { getDb, Themes, ThemeRow } from '../../Database';
import { ResetThemeCache } from '../../v2/FetchThemes';

const NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const README_PATTERN = /^(?!.*\.\.)[A-Za-z0-9._/-]{1,200}$/;
const ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface ThemeInput {
	owner: string;
	repo: string;
	readme: string | null;
	disabled: boolean;
}

export class AdminError extends Error {
	constructor(
		message: string,
		public status: number,
		public details?: string[],
	) {
		super(message);
	}
}

export function ParseThemeInput(raw: any): ThemeInput {
	const owner = typeof raw?.owner === 'string' ? raw.owner.trim() : '';
	const repo = typeof raw?.repo === 'string' ? raw.repo.trim() : '';
	const readme = typeof raw?.readme === 'string' && raw.readme.trim() ? raw.readme.trim() : null;

	if (!NAME_PATTERN.test(owner) || !NAME_PATTERN.test(repo)) {
		throw new AdminError(`Invalid owner/repo: ${JSON.stringify(`${raw?.owner}/${raw?.repo}`)}`, 400);
	}

	if (readme !== null && !README_PATTERN.test(readme)) {
		throw new AdminError(`Invalid readme path for ${owner}/${repo}`, 400);
	}

	return { owner, repo, readme, disabled: raw?.disabled === true };
}

const sameRepo = (row: ThemeRow, input: { owner: string; repo: string }) => row.owner.toLowerCase() === input.owner.toLowerCase() && row.repo.toLowerCase() === input.repo.toLowerCase();

const findTheme = (input: { owner: string; repo: string }) => Themes.getEvery().find((row) => sameRepo(row, input)) ?? null;

const generateId = () => {
	const taken = new Set(Themes.getEvery().map((row) => row.id));
	while (true) {
		let id = '';
		while (id.length < 20) {
			for (const byte of randomBytes(32)) {
				if (byte < 248 && id.length < 20) id += ID_ALPHABET[byte % 62];
			}
		}
		if (!taken.has(id)) return id;
	}
};

async function hasSkinJson(owner: string, repo: string) {
	const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/skin.json`, {
		headers: {
			Accept: 'application/vnd.github+json',
			'User-Agent': 'SteamBrew-Admin',
			...(process.env.BEARER ? { Authorization: process.env.BEARER } : {}),
		},
		cache: 'no-store',
		signal: AbortSignal.timeout(15000),
	});

	if (res.status === 404) return false;
	if (!res.ok) throw new AdminError(`GitHub lookup failed for ${owner}/${repo}: ${res.status}`, 502);
	return true;
}

export async function AddTheme(input: ThemeInput) {
	if (findTheme(input)) {
		throw new AdminError(`${input.owner}/${input.repo} already exists`, 409);
	}

	if (!(await hasSkinJson(input.owner, input.repo))) {
		throw new AdminError(`${input.owner}/${input.repo} has no skin.json at its root`, 422);
	}

	const id = generateId();
	Themes.insert(id, input.owner, input.repo, input.readme, input.disabled);
	ResetThemeCache();
	return { id };
}

export function ChangeTheme(action: 'enable' | 'disable' | 'remove', input: ThemeInput) {
	const row = findTheme(input);
	if (!row) {
		throw new AdminError(`${input.owner}/${input.repo} not found`, 404);
	}

	if (action === 'remove') Themes.remove(row.id);
	else Themes.setDisabled(row.id, action === 'disable');

	ResetThemeCache();
	return { id: row.id };
}

export async function SyncThemes(rawList: any) {
	if (!Array.isArray(rawList) || rawList.length === 0) {
		throw new AdminError('themes must be a non-empty array', 400);
	}

	const inputs = rawList.map(ParseThemeInput);

	const seen = new Set<string>();
	for (const input of inputs) {
		const key = `${input.owner}/${input.repo}`.toLowerCase();
		if (seen.has(key)) throw new AdminError(`Duplicate entry ${input.owner}/${input.repo}`, 400);
		seen.add(key);
	}

	const existing = Themes.getEvery();
	const additions = inputs.filter((input) => !existing.some((row) => sameRepo(row, input)));

	const problems: string[] = [];
	await Promise.all(
		additions.map(async (input) => {
			if (!(await hasSkinJson(input.owner, input.repo))) {
				problems.push(`${input.owner}/${input.repo} has no skin.json at its root`);
			}
		}),
	);

	if (problems.length) {
		throw new AdminError('Validation failed, nothing was changed', 422, problems.sort());
	}

	const summary = { added: [] as string[], enabled: [] as string[], disabled: [] as string[], updated: [] as string[], unchanged: 0 };

	getDb().transaction(() => {
		for (const input of inputs) {
			const label = `${input.owner}/${input.repo}`;
			const row = existing.find((candidate) => sameRepo(candidate, input));

			if (!row) {
				Themes.insert(generateId(), input.owner, input.repo, input.readme, input.disabled);
				summary.added.push(label);
				continue;
			}

			let changed = false;

			if ((row.disabled === 1) !== input.disabled) {
				Themes.setDisabled(row.id, input.disabled);
				(input.disabled ? summary.disabled : summary.enabled).push(label);
				changed = true;
			}

			if ((row.readme ?? null) !== input.readme) {
				Themes.setReadme(row.id, input.readme);
				summary.updated.push(label);
				changed = true;
			}

			if (!changed) summary.unchanged++;
		}

		for (const row of existing) {
			if (row.disabled === 0 && !inputs.some((input) => sameRepo(row, input))) {
				Themes.setDisabled(row.id, true);
				summary.disabled.push(`${row.owner}/${row.repo}`);
			}
		}
	})();

	ResetThemeCache();
	return summary;
}

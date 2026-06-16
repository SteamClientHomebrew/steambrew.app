import { Themes } from '../Database';
import { GithubGraphQL } from './GraphQLInterop';

export interface ThemeData {
	id: string;
	owner: string;
	repo: string;
	firebaseDoc: any;
	createTime?: string;
	createTimeMs?: number;

	name: string;
	defaultBranch: string;
	latestCommitOid: string | null;
	commitUrl: string | null;
	committedDate: string | null;
	commitMessage: string | null;
	skinJson: any;
	readme: string | null;
	listingStyle: string | null;
	downloadUrl: string;
}

const CACHE_DURATION_MS = 30 * 60 * 1000;
let cachedThemes: ThemeData[] | null = null;
let cacheTimestamp = 0;
let inflightFetch: Promise<ThemeData[]> | null = null;


async function fetchFreshThemes(): Promise<ThemeData[]> {
	const rows = Themes.getAll();

	const docs: any[] = [];
	for (const row of rows) {
		docs.push({
			firebaseDoc: {
				github: { owner: row.owner, repo: row.repo },
				download: row.downloads,
				id: row.id,
				create_time: row.created_at * 1000,
			},
			createTimeMs: row.created_at * 1000,
			readmePath: row.readme ?? 'README.md',
			github: { owner: row.owner, repo: row.repo },
		});
	}

	if (docs.length === 0) return [];

	// ONE batch GraphQL query with the superset of all fields any endpoint needs
	const query = `query {
		${docs
			.map(
				(doc, i) => `
			_${i}: repository(owner: "${doc.github.owner}", name: "${doc.github.repo}") {
				name
				defaultBranchRef {
					name
					target {
						... on Commit {
							oid
							commitUrl
							committedDate
							history(first: 1) { edges { node { message } } }
						}
					}
				}
				file: object(expression: "HEAD:skin.json") { ... on Blob { text } }
				read_me: object(expression: "HEAD:${doc.readmePath}") { ... on Blob { text } }
				listing_style: object(expression: "HEAD:millennium.styles.css") { ... on Blob { text } }
			}
		`,
			)
			.join('\n')}
	}`;

	const result = await GithubGraphQL.Post(query);

	if (!result.data) {
		console.error('GraphQL response missing data:', JSON.stringify(result).slice(0, 500));
		return [];
	}

	const themes: ThemeData[] = [];
	for (const [key, repo] of Object.entries(result.data) as [string, any][]) {
		const index = parseInt(key.slice(1), 10);
		const doc = docs[index];
		if (!doc || !repo) continue;
		if (!repo.file?.text) continue;

		let skinJson = null;
		try {
			skinJson = JSON.parse(repo.file.text);
		} catch {
			console.warn(`Failed to parse skin.json for ${doc.github.owner}/${doc.github.repo}`);
			continue;
		}

		const defaultBranch = repo.defaultBranchRef?.name ?? 'main';
		const target = repo.defaultBranchRef?.target;

		themes.push({
			id: doc.firebaseDoc.id,
			owner: doc.github.owner,
			repo: doc.github.repo,
			firebaseDoc: doc.firebaseDoc,
			createTime: doc.createTimeMs ? new Date(doc.createTimeMs).toISOString() : undefined,
			createTimeMs: doc.createTimeMs || undefined,
			name: repo.name,
			defaultBranch,
			latestCommitOid: target?.oid ?? null,
			commitUrl: target?.commitUrl ?? null,
			committedDate: target?.committedDate ?? null,
			commitMessage: target?.history?.edges?.[0]?.node?.message ?? null,
			skinJson,
			readme: repo.read_me?.text ?? null,
			listingStyle: repo.listing_style?.text ?? null,
			downloadUrl: `https://codeload.github.com/${doc.github.owner}/${doc.github.repo}/zip/${target?.oid ?? defaultBranch}`,
		});
	}

	return themes;
}

export async function FetchThemes(): Promise<ThemeData[]> {
	if (cachedThemes && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
		return cachedThemes;
	}

	if (inflightFetch) {
		return inflightFetch;
	}

	inflightFetch = fetchFreshThemes()
		.then((result) => {
			cachedThemes = result;
			cacheTimestamp = Date.now();
			return result;
		})
		.finally(() => {
			inflightFetch = null;
		});

	return inflightFetch;
}

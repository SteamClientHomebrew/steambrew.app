import { parse as parseToml } from 'smol-toml';
import { GithubGraphQL } from '../../v2/GraphQLInterop';

const FormatSize = (kilobytes) => {
	const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
	let size = kilobytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export interface PluginDataProps {
	pluginJson: any;
	usesBackend: boolean;
	readme: string;
	stargazerCount: number;
	diskUsage: string;
	commitDate: string;
	commitMessage: string;
	repoName: string;
	repoOwner: string;
	id: string;

	downloadSize?: string;
	downloadCount?: number;
	initCommitId?: string;
	commitId?: string;

	fileSize?: number;
	hasValidBuild?: boolean;
	downloadUrl?: string;

	format?: 'loose' | 'star';
	pluginId?: string;
}

export interface PluginDataTable {
	pluginData: PluginDataProps[];
	metadata: { id: string; commitId: string; format?: 'loose' | 'star'; pluginId?: string }[];
}

const NormalizeStarManifest = (toml: any) => ({
	name: toml?.plugin?.id,
	common_name: toml?.plugin?.name,
	description: toml?.plugin?.description,
	author: toml?.plugin?.author,
	version: toml?.plugin?.version,
	useBackend: Boolean(toml?.backend),
});

const GetPluginData = (pluginList) => {
	return new Promise<PluginDataProps[]>(async (resolve, reject) => {
		const query = `
            query {
            ${pluginList
				.map(
					(repo, index) => `
                repo${index}: repository(owner: "${repo.owner}", name: "${repo.repo}") {
                    stargazerCount
                    diskUsage
                    readme: object(expression: "${repo.commit}:README.md") {
                        ... on Blob {
                            text
                        }
                    }
                    pluginReadme: object(expression: "${repo.commit}:PLUGIN.md") {
                        ... on Blob {
                            text
                        }
                    }
                    pluginJson: object(expression: "${repo.commit}:plugin.json") {
                        ... on Blob {
                            text
                        }
                    }
                    manifestToml: object(expression: "${repo.commit}:millennium.toml") {
                        ... on Blob {
                            text
                        }
                    }
                    commit: object(expression: "${repo.commit}") {
                        ... on Commit {
                            committedDate
                            message
                        }
                    }
                    repoName: name
                    repoOwner: owner {
                        login
                    }
                    commitId: object(expression: "${repo.commit}") {
                        ... on Commit {
                            oid
                        }
                    }
                }
            `,
				)
				.join('\n')}
            }
        `;

		const responseJson = await GithubGraphQL.Post(query);

		const jsonResponse = Object.values(responseJson.data)
			.map((repository) => repository)
			.map((repo: any): PluginDataProps | null => {
				try {
					const pluginJson = repo.pluginJson?.text ? JSON.parse(repo.pluginJson.text) : NormalizeStarManifest(parseToml(repo.manifestToml.text));
					return {
						pluginJson: pluginJson,
						usesBackend: pluginJson?.useBackend === true || pluginJson?.useBackend === undefined,
						readme: repo?.pluginReadme?.text || repo.readme.text,
						stargazerCount: repo.stargazerCount,
						diskUsage: FormatSize(repo.diskUsage),
						commitDate: repo.commit.committedDate,
						commitMessage: repo.commit.message,
						repoName: repo.repoName,
						repoOwner: repo.repoOwner.login,
						id: repo.commitId.oid,
					};
				} catch {
					return null;
				}
			})
			.filter((item): item is PluginDataProps => item !== null);

		resolve(jsonResponse);
	});
};

export { GetPluginData };

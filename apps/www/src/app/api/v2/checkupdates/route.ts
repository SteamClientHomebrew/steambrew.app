import { FetchThemes } from '../FetchThemes';

async function CheckForUpdates(requestBody: { owner: string; repo: string }[]) {
	const themes = await FetchThemes();

	return requestBody.map((item) => {
		const theme = themes.find((t) => t.owner === item.owner && t.repo === item.repo);
		return {
			download: theme ? theme.downloadUrl : null,
			name: theme?.name ?? null,
			commit: theme?.latestCommitOid ?? null,
			url: theme?.commitUrl ?? null,
			date: theme?.committedDate ?? null,
			message: theme?.commitMessage ?? null,
		};
	});
}

export async function POST(request: Request) {
	const json = await request.json();

	try {
		return Response.json(await CheckForUpdates(json), { status: 200 });
	} catch (error) {
		return new Response(error instanceof Error ? error.message : String(error), { status: 404 });
	}
}

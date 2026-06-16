import { Themes } from '../../Database';
import { GithubGraphQL } from '../GraphQLInterop';

export const dynamic = 'force-dynamic';

async function GetThemeUpdate(requestBody: any) {
	const [json, theme] = await Promise.all([
		GithubGraphQL.Post(`{
			repository(owner: "${requestBody.owner}", name: "${requestBody.repo}") {
				defaultBranchRef {
					name
					target { oid }
				}
			}
		}`),
		Promise.resolve(Themes.getByRepo(requestBody.owner, requestBody.repo)),
	]);

	if (!theme) throw new Error("couldn't find doc from collection");

	const count = Themes.incrementDownload(theme.id);
	const oid = json?.data?.repository?.defaultBranchRef?.target?.oid ?? null;

	return {
		success: true,
		data: {
			download: `https://github.com/${requestBody.owner}/${requestBody.repo}/archive/${oid}.zip`,
			rest: `https://api.github.com/repos/${requestBody.owner}/${requestBody.repo}/commits/${oid}`,
			latestHash: oid,
			count,
		},
	};
}

export async function POST(request: Request) {
	const json = await request.json();

	try {
		return Response.json(await GetThemeUpdate(json), { status: 200 });
	} catch (error) {
		return new Response(error instanceof Error ? error.message : String(error), { status: 404 });
	}
}

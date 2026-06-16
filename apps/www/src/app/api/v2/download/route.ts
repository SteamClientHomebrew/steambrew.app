import { Themes } from '../../Database';

const IncrementDownload = (requestBody: { owner: string; repo: string }) => {
	const theme = Themes.getByRepo(requestBody.owner, requestBody.repo);
	if (!theme) throw new Error("couldn't find doc from collection");

	const count = Themes.incrementDownload(theme.id);
	return { success: true, data: { count } };
};

export async function POST(request: Request) {
	const json = await request.json();

	try {
		return Response.json(IncrementDownload(json), { status: 200 });
	} catch (error) {
		return new Response(error instanceof Error ? error.message : String(error), { status: 404 });
	}
}

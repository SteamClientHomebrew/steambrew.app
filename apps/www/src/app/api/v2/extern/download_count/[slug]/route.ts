import { Themes } from '@/app/api/Database';

const WHITELISTED_ORIGINS = ['https://spacetheme.net'];

function getAllowedOrigin(request: Request): string | undefined {
	const origin = request.headers.get('Origin');
	if (origin && WHITELISTED_ORIGINS.includes(origin)) {
		return origin;
	}
	return undefined;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const allowedOrigin = getAllowedOrigin(request);

	const headers: HeadersInit = {
		'Cache-Control': 'public, max-age=86400',
	};
	if (allowedOrigin) {
		headers['Access-Control-Allow-Origin'] = allowedOrigin;
	}

	if (!slug) {
		return new Response("Missing 'id' parameter", { status: 400, headers });
	}

	const theme = Themes.getById(slug.trim());
	if (!theme) {
		return new Response(`Error: Repository with ID '${slug.trim()}' not found`, { status: 404, headers });
	}

	return Response.json({ download_count: theme.downloads }, { headers });
}

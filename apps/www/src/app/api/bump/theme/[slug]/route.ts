import { Themes } from '../../../Database';

function withCORS(response: Response): Response {
	response.headers.set('Access-Control-Allow-Origin', 'https://steamloopback.host');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	return response;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	if (!slug) {
		return withCORS(new Response(JSON.stringify({ success: false, message: 'Missing theme slug' }), { status: 400 }));
	}

	try {
		const newCount = Themes.incrementDownload(slug);

		return withCORS(
			new Response(
				JSON.stringify({
					success: true,
					message: 'Download count updated successfully.',
					downloadCount: newCount,
				}),
				{ status: 200 },
			),
		);
	} catch (err) {
		console.error('Error updating download count:', err);

		return withCORS(
			new Response(
				JSON.stringify({
					success: false,
					message: 'An error occurred updating the download count.',
				}),
				{ status: 500 },
			),
		);
	}
}

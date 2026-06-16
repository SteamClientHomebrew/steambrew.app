import { FetchThemes, ThemeData } from '../../FetchThemes';

export const dynamic = 'force-dynamic';

interface DiscordInfo {
	name?: string;
	icon?: string;
	link?: string;
	inviteCodeExcludingLink?: string;
}

async function getDiscordInfo(token: string): Promise<DiscordInfo> {
	const cleanToken = token.trim();
	const response = await fetch(`https://discord.com/api/v9/invites/${cleanToken}?with_counts=true&with_expiration=true`, {
		next: { revalidate: 1800 },
	});

	if (!response.ok) {
		throw new Error(`Discord API returned ${response.status}`);
	}

	const discord = await response.json();
	if (!discord?.guild) {
		throw new Error('Invalid Discord invite response');
	}

	return {
		name: discord.guild.name || 'Unknown Server',
		icon: discord.guild.icon ? `https://cdn.discordapp.com/icons/${discord.guild.id}/${discord.guild.icon}.webp` : undefined,
		link: `https://discord.gg/${cleanToken}`,
	};
}

function buildDetailResponse(theme: ThemeData) {
	const skinJson = theme.skinJson || {};
	const tags = Array.isArray(skinJson.tags) ? skinJson.tags : [];
	const globalColors = Array.isArray(skinJson.GlobalsColors) ? skinJson.GlobalsColors : [];
	const patches = Array.isArray(skinJson.Patches) ? skinJson.Patches : [];

	return {
		listing_style: theme.listingStyle,
		header_image: skinJson.header_image ?? '[NO-IMAGE]',
		splash_image: skinJson.splash_image ?? '[NO-IMAGE]',
		read_me: theme.readme,
		tags,
		customize: {
			able: globalColors.length > 0,
			length: globalColors.length,
		},
		patches: {
			specific_windows: patches.map((patch: any) => {
				try {
					return patch?.MatchRegexString?.replace(/[!@#$%^&*()+{}\[\]:;<>,.?~\\/-]/g, '') || '';
				} catch {
					return '';
				}
			}),
			patches_default: Boolean(skinJson.UseDefaultPatches),
			length: patches.length,
		},
		discord: skinJson.discord_support as DiscordInfo | undefined,
		download: theme.downloadUrl,
		name: skinJson.name || null,
		description: skinJson.description || 'No description. Check back later',
		version: skinJson.version || 'none',
		skin_data: skinJson,
		commit_data: {
			oid: theme.latestCommitOid,
			commitUrl: theme.commitUrl,
			committedDate: theme.committedDate,
		},
		data: {
			...theme.firebaseDoc,
			id: theme.id,
			create_time: theme.createTimeMs ?? 0,
		},
	};
}

function addCorsHeaders(response: Response): void {
	response.headers.set('Access-Control-Allow-Origin', 'https://steamloopback.host');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;

		if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
			const response = Response.json({ success: false, error: 'BAD_REQUEST', message: 'Repository slug is required' }, { status: 400 });
			addCorsHeaders(response);
			return response;
		}

		const cleanId = slug.trim();
		const themes = await FetchThemes();
		const theme = themes.find((t) => t.id === cleanId);

		if (!theme) {
			const response = Response.json({ success: false, error: 'NOT_FOUND', message: `Repository with ID '${cleanId}' not found` }, { status: 404 });
			addCorsHeaders(response);
			return response;
		}

		const result = buildDetailResponse(theme);

		// Optional Discord integration
		const inviteToken = result.discord?.inviteCodeExcludingLink;
		if (inviteToken) {
			try {
				result.discord = await getDiscordInfo(inviteToken);
			} catch (discordError) {
				console.warn(`Discord integration failed for '${cleanId}':`, discordError instanceof Error ? discordError.message : String(discordError));
			}
		}

		const response = Response.json(result, { status: 200 });
		addCorsHeaders(response);
		return response;
	} catch (error: any) {
		console.error('Unexpected API error:', error?.message);
		const response = Response.json({ success: false, error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, { status: 500 });
		addCorsHeaders(response);
		return response;
	}
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': 'https://steamloopback.host',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

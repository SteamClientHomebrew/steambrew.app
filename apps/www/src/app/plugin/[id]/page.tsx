import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MarkdownToHtml } from '@/utils/MarkDownConvert';
import { API_URL } from '@/utils/globals';
import mdOverrides from '../../../../md-overrides.json';
import PluginDetailClient from './PluginDetailClient';

export const viewport: Viewport = {
	themeColor: '#3a71c1',
};

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { id } = await params;
	const res = await fetch(`${API_URL}/api/v1/plugin/${id}`);

	if (!res.ok) {
		return { title: 'Not Found • Millennium' };
	}

	const data = await res.json();
	let name: string = data?.pluginJson?.common_name ?? data?.repoName ?? 'Plugin';
	if (name.length > 15) name = name.substring(0, 15) + '...';

	return {
		title: `${name} - Millennium`,
		description: data.description,
		openGraph: {
			title: `${data?.pluginJson?.common_name} - Millennium`,
			description: data.description,
			images: [{ url: data?.thumbnail, alt: 'Plugin Thumbnail', width: 1920, height: 1080 }],
			siteName: 'Millennium',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${data?.pluginJson?.common_name} - Millennium`,
			description: data.description,
			images: [{ url: data?.thumbnail, alt: 'Plugin Thumbnail' }],
			site: 'Millennium',
		},
		authors: [{ name: data.repoOwner ?? 'Anonymous' }],
	};
}

export default async function PluginPage({ params }: { params: Params }) {
	const { id } = await params;
	const headersList = await headers();
	const isSteamClient = /Valve Steam Client/.test(headersList.get('user-agent') ?? '');

	const res = await fetch(`${API_URL}/api/v1/plugin/${id}`);

	if (res.status === 404) notFound();

	if (!res.ok) {
		return <PluginDetailClient pluginData={null} isSteamClient={isSteamClient} apiError={true} mdOverrides={[]} />;
	}

	const pluginData = await res.json();

	const warningMessage: string | undefined = (mdOverrides as any)?.warnings?.plugins?.[pluginData?.id];
	const errorMessage: string | undefined = (mdOverrides as any)?.errors?.plugins?.[pluginData?.id];
	const message = [warningMessage ? `> [!WARNING]\n> ${warningMessage}\n\n` : '', errorMessage ? `> [!CAUTION]\n> ${errorMessage}\n\n` : ''].filter(Boolean).join('\n\n');

	pluginData.readMeMarkdown = await MarkdownToHtml(pluginData?.readme, pluginData?.repoOwner, pluginData?.repoName, pluginData?.commitId, message);

	const overrides = [warningMessage ? { type: 'warning', message: warningMessage } : null, errorMessage ? { type: 'error', message: errorMessage } : null].filter(Boolean) as { type: string; message: string }[];

	return <PluginDetailClient pluginData={pluginData} isSteamClient={isSteamClient} apiError={false} mdOverrides={overrides} />;
}

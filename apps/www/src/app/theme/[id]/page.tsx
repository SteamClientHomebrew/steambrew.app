import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MarkdownToHtml } from '@/utils/MarkDownConvert';
import { API_URL } from '@/utils/globals';
import mdOverrides from '../../../../md-overrides.json';
import ThemeDetailClient from './ThemeDetailClient';

export const viewport: Viewport = {
	themeColor: '#3a71c1',
};

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { id } = await params;
	const res = await fetch(`${API_URL}/api/v2/details/${id}`);

	if (!res.ok) {
		return { title: 'Not Found • Millennium' };
	}

	const json = await res.json();

	return {
		title: `${json?.name} - Millennium`,
		description: json.description,
		openGraph: {
			title: `${json.name} - Millennium`,
			description: json.description,
			images: [{ url: json?.header_image, alt: 'Theme Thumbnail', width: 1920, height: 1080 }],
			siteName: 'Millennium',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${json.name} - Millennium`,
			description: json.description,
			images: [{ url: json?.header_image, alt: 'Theme Thumbnail' }],
			site: 'Millennium',
		},
		authors: [{ name: json?.data?.github?.owner ?? 'Anonymous' }],
	};
}

export default async function ThemePage({ params }: { params: Params }) {
	const { id } = await params;
	const headersList = await headers();
	const isSteamClient = /Valve Steam Client/.test(headersList.get('user-agent') ?? '');

	const res = await fetch(`${API_URL}/api/v2/details/${id}`);

	if (res.status === 404) notFound();

	if (!res.ok) {
		return <ThemeDetailClient json={null} markdown="" isSteamClient={isSteamClient} mdOverrides={[]} apiError={true} />;
	}

	const json = await res.json();

	const warningMessage: string | undefined = (mdOverrides as any)?.warnings?.themes?.[json?.data?.id];
	const errorMessage: string | undefined = (mdOverrides as any)?.errors?.themes?.[json?.data?.id];
	const message = [warningMessage ? `> [!WARNING]\n> ${warningMessage}\n\n` : '', errorMessage ? `> [!CAUTION]\n> ${errorMessage}\n\n` : ''].filter(Boolean).join('\n\n');

	const markdown = await MarkdownToHtml(json?.read_me, json?.data?.github?.owner, json?.data?.github?.repo, json?.commit_data?.oid, message);

	const overrides = [warningMessage ? { type: 'warning', message: warningMessage } : null, errorMessage ? { type: 'error', message: errorMessage } : null].filter(Boolean) as { type: string; message: string }[];

	return <ThemeDetailClient json={json} markdown={markdown} isSteamClient={isSteamClient} mdOverrides={overrides} apiError={false} />;
}

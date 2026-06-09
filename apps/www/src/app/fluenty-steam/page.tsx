import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { fluenty } from '@/components/RenderFluenty';
import FluentyClient from './FluentyClient';

export const viewport: Viewport = {
	themeColor: '#3a71c1',
};

export const metadata: Metadata = {
	title: 'Fluenty - Millennium',
	description: fluenty.description,
	openGraph: {
		title: 'Fluenty - Millennium',
		description: fluenty.description,
		images: [{ url: 'https://i.imgur.com/ca6ncMp.gif', alt: 'Theme Thumbnail', width: 1920, height: 1080 }],
		siteName: 'Millennium',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Fluenty - Millennium',
		description: fluenty.description,
		images: [{ url: 'https://i.imgur.com/ca6ncMp.gif', alt: 'Theme Thumbnail' }],
		site: 'Millennium',
	},
	authors: [{ name: 'Millennium' }],
};

export default async function FluentyPage() {
	const headersList = await headers();
	const isSteamClient = /Valve Steam Client/.test(headersList.get('user-agent') ?? '');
	return <FluentyClient isSteamClient={isSteamClient} />;
}

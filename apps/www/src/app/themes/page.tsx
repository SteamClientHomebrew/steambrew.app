import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ThemeLibrary from './ThemeLibrary';

export const metadata: Metadata = {
	title: 'Themes • Millennium',
};

export default async function ThemesPage() {
	const headersList = await headers();
	const isSteamClient = /Valve Steam Client/.test(headersList.get('user-agent') ?? '');
	return <ThemeLibrary isSteamClient={isSteamClient} />;
}

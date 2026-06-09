import type { Metadata } from 'next';
import { headers } from 'next/headers';
import PluginLibrary from './PluginLibrary';

export const metadata: Metadata = {
	title: 'Plugins • Millennium',
};

export default async function PluginsPage() {
	const headersList = await headers();
	const isSteamClient = /Valve Steam Client/.test(headersList.get('user-agent') ?? '');
	return <PluginLibrary isSteamClient={isSteamClient} />;
}

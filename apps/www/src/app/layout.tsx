const description =
	"An open-source low-code modding framework to create, manage and use themes/plugins for the desktop Steam Client without any low-level internal interaction or overhead.";

export const metadata = {
	metadataBase: new URL('http://localhost:3000'),
	title: 'Millennium • Steam Homebrew.',
	description: description,
	url: 'https://steambrew.app/',
	image: '/favicon/favicon.svg',
	imageAlt: 'Millennium for Steam Logo',
	openGraph: {
		title: 'The Steam Enhancement Project',
		description: description,
		url: 'https://steambrew.app/',
		image: '/favicon/favicon.svg',
		imageAlt: 'Millennium for Steam Logo',
		siteName: 'Steam Homebrew',
	},
	twitter: {
		card: 'summary',
		site: 'Steam Homebrew | Millennium',
		title: 'The Steam Enhancement Project',
		description: description,
		url: 'https://steambrew.app/',
		image: '/favicon/favicon.svg',
		imageAlt: 'Millennium for Steam Logo®',
	},
	siteName: 'Steam Homebrew | Millennium',
	keywords:
		'Steam, Steam++, Better Steam, Steam Mod, Steam Themes, Steam Plugins, Steam Extensions, Steam Client Mod, Steam Hacks, Millennium, Millennium Steam, Millennium Steam Patcher, Steam Patcher, Millennium Patcher, Patcher, Millennium for Steam, Millennium Steam',
	author: 'Steam Homebrew',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" style={{ backgroundColor: '#0f0f0f' }}>
			<body className={'SteamBrewAppBody'}>{children}</body>
		</html>
	);
}

interface PluginMetadata {
	commitId: string;
	id: string;
	format?: 'loose' | 'star';
	pluginId?: string;
}

const GetPluginMetadata = async () => {
	return new Promise<PluginMetadata[]>((resolve, reject) => {
		fetch('https://raw.githubusercontent.com/SteamClientHomebrew/PluginDatabase/refs/heads/main/metadata.json', {
			headers: {
				Authorization: process.env.BEARER!,
				'Content-Type': 'application/json',
			},
			next: { revalidate: 300 },
		})
			.then((text) => text.json())
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export { GetPluginMetadata };

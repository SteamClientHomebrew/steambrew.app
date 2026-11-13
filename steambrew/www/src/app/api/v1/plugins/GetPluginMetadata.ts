interface PluginMetadata {
	commitId: string;
	id: string;
	format?: 'loose' | 'star';
	pluginId?: string;
	unlisted?: boolean;
}

const GetPluginMetadata = async () => {
	return new Promise<PluginMetadata[]>((resolve, reject) => {
		fetch('https://raw.githubusercontent.com/SteamClientHomebrew/PluginDatabase/refs/heads/main/metadata.json', {
			headers: {
				Authorization: process.env.BEARER!,
				'Content-Type': 'application/json',
			},
			next: { revalidate: 300 },
			signal: AbortSignal.timeout(15000),
		})
			.then((res) => {
				if (!res.ok) throw new Error(`Metadata request failed: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export { GetPluginMetadata };

import querystring from 'querystring';

const RetrievePluginList = async () => {
	return new Promise((resolve, reject) => {
		fetch('https://api.github.com/repos/SteamClientHomebrew/PluginDatabase/contents/plugins', {
			headers: {
				Authorization: process.env.BEARER!,
				'Content-Type': 'application/json',
			},
			next: { revalidate: 300 },
		})
			.then((text) => text.json())
			.then((data) => {
				if (!Array.isArray(data)) {
					reject(new Error(`GitHub API error: ${JSON.stringify(data)}`));
					return;
				}
				resolve(
					data.map((plugin) => {
						const pluginLinks = plugin._links;
						const branch = querystring.parse(pluginLinks.self.split('?')[1]).ref;

						const owner = pluginLinks.html.split('/')[3];
						const repo = pluginLinks.html.split('/')[4];
						const commit = pluginLinks.html.split('/')[6];

						return {
							owner: owner,
							repo: repo,
							branch: branch,
							commit: commit,
						};
					}),
				);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export { RetrievePluginList };

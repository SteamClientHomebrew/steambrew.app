export const GetDownloadInfo = async (): Promise<Record<string, number>> => {
	const data = await fetch('https://api.github.com/repos/shdwmtr/plugdb/releases', {
		headers: {
			Authorization: process.env.BEARER!,
			'Content-Type': 'application/json',
		},
		next: { revalidate: 300 },
	}).then((res) => res.json());

	const downloadCounts: Record<string, number> = {};

	data.forEach((release: any) => {
		release.assets.forEach((asset: any) => {
			if (downloadCounts[asset.name]) {
				downloadCounts[asset.name] += asset.download_count;
			} else {
				downloadCounts[asset.name] = asset.download_count;
			}
		});
	});

	return downloadCounts;
};

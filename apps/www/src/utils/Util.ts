import { API_URL } from './globals';

declare global {
	interface Window {
		cachedStatistics?: StatisticProps;
	}
}

export interface StatisticProps {
	version: string;
	download_count: number;
	server_members: number;
	contributors: any[];
}

export const GetStatisticsSync = async (): Promise<StatisticProps> => {
	if (window.cachedStatistics) {
		return window.cachedStatistics;
	}

	const discord = await fetch('https://discord.com/api/v9/invites/NcNMP6r2Cw?with_counts=true&with_expiration=true').then((response) => response.json());
	const github = await fetch(`${API_URL}/api/millennium/stats`).then((response) => response.json());
	const contributors = await fetch('https://api.github.com/repos/SteamClientHomebrew/Millennium/contributors?per_page=100&page=1').then((response) => response.json());

	window.cachedStatistics = {
		version: github.latestVersion,
		download_count: github.downloadCount,
		server_members: discord.approximate_member_count,
		contributors: contributors,
	};

	return window.cachedStatistics;
};

export const FormatNumber = (number: number) => {
	return number >= 1000 ? `${(number / 1000).toFixed(1)}K` : number;
};

export const FormatBytes = (bytes: number) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';

	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
	return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

export const DateToString = (dateString: string) => {
	return new Date(new Date(dateString).getTime() - new Date(dateString).getTimezoneOffset() * 60000).toDateString();
};

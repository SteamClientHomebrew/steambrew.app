import fs from 'fs';

export const dynamic = 'force-dynamic';

const LOG_FILES = ['/var/log/nginx/steambrew.log', '/var/log/nginx/steambrew-docs.log'];

interface LogEntry {
	msec: number;
	bytes: number;
	status: number;
}

function parseLog(path: string): LogEntry[] {
	try {
		const content = fs.readFileSync(path, 'utf8');
		const entries: LogEntry[] = [];
		const now = Date.now() / 1000;
		const cutoff = now - 86400; // last 24h

		for (const line of content.split('\n')) {
			if (!line) continue;
			const [msecStr, bytesStr, statusStr] = line.split(' ');
			const msec = parseFloat(msecStr);
			if (isNaN(msec) || msec < cutoff) continue;
			entries.push({ msec, bytes: parseInt(bytesStr) || 0, status: parseInt(statusStr) || 0 });
		}
		return entries;
	} catch {
		return [];
	}
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
	return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export async function GET() {
	const now = Date.now() / 1000;
	const entries = LOG_FILES.flatMap(parseLog);

	const last60s = entries.filter((e) => e.msec >= now - 60);
	const last1h = entries.filter((e) => e.msec >= now - 3600);
	const last24h = entries;

	const sum = (arr: LogEntry[]) => arr.reduce((a, e) => a + e.bytes, 0);

	const rps = last60s.length / 60;

	return Response.json({
		requests: {
			per_second: parseFloat(rps.toFixed(2)),
			last_minute: last60s.length,
			last_hour: last1h.length,
			last_24h: last24h.length,
		},
		bandwidth: {
			last_minute: formatBytes(sum(last60s)),
			last_hour: formatBytes(sum(last1h)),
			last_24h: formatBytes(sum(last24h)),
		},
		status_codes: {
			'2xx': last24h.filter((e) => e.status >= 200 && e.status < 300).length,
			'3xx': last24h.filter((e) => e.status >= 300 && e.status < 400).length,
			'4xx': last24h.filter((e) => e.status >= 400 && e.status < 500).length,
			'5xx': last24h.filter((e) => e.status >= 500).length,
		},
		sources: {
			www: LOG_FILES[0] ? parseLog(LOG_FILES[0]).length : 0,
			docs: LOG_FILES[1] ? parseLog(LOG_FILES[1]).length : 0,
		},
		as_of: new Date().toISOString(),
	});
}

import { env } from '$env/dynamic/private';
import { areas } from '$lib/data/roadmap';

const API = 'https://api.github.com/repos/sonorahq/sonora/issues';

/** Whether issue or pull request `number` is finished. A request that fails counts as not finished, so the line stays as it was. */
async function finished(fetch: typeof globalThis.fetch, number: number): Promise<boolean> {
	const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
	if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;

	try {
		const res = await fetch(`${API}/${number}`, { headers });
		if (!res.ok) return false;
		const item = await res.json();
		return item.pull_request
			? item.pull_request.merged_at != null
			: item.state_reason === 'completed';
	} catch {
		return false;
	}
}

/** Lists the linked issues that closed as completed and the linked pull requests that merged. */
export async function load({ fetch }): Promise<{ done: number[] }> {
	const numbers = areas.flatMap((area) =>
		area.entries.flatMap((entry) => entry.issue ?? entry.pull ?? [])
	);
	const states = await Promise.all(numbers.map((number) => finished(fetch, number)));

	return { done: numbers.filter((_, i) => states[i]) };
}

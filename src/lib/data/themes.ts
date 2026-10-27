import { website } from '$lib/data/links';
import { FIELDS, darkColors } from '$lib/mock/theme';

/** A community theme as the gallery shows it, with the link that hands it to Sonora. */
export type CommunityTheme = {
	id: string;
	name: string;
	author: string;
	/** Every colour token as CSS, the theme's own over the Dark theme's. */
	colors: Record<string, string>;
	/** The theme file as Sonora writes it, for downloading. */
	file: string;
	/** The `sonora://theme/` link that carries the whole file. */
	link: string;
};

/** What every theme link starts with. Sonora reads the rest as the theme file in base64url. */
const LINK = 'sonora://theme/';
/** The longest link Sonora reads. */
const LINK_LIMIT = 16 * 1024;
/** How many characters a theme's name or author may have before Sonora refuses the link. */
const LABEL_LIMIT = 64;
const COLOR = /^#?(?:[0-9a-f]{6}|[0-9a-f]{8})$/i;
/** Controls, direction marks and invisible characters, which Sonora refuses in a name. */
const HIDDEN = /[\p{Cc}​-‏‪-‮⁠-⁯﻿]/u;
const KEYS = new Set(['name', 'author', 'version', 'theme']);
const TOKENS = new Set(FIELDS);

const files = import.meta.glob('../themes/*.json', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

/** The file a new theme starts from. Every color it leaves out comes from the Dark theme. */
const STARTER = `{
	"name": "My theme",
	"author": "Your name",
	"version": 1,
	"theme": {
		"background": "#101014",
		"foreground": "#fafafa",
		"primary": "#a5b4fc",
		"primary_foreground": "#101014"
	}
}
`;

/**
 * Opens GitHub's editor on a new file in `src/lib/themes`. Committing it forks the repository
 * and opens a pull request that starts from the theme template.
 */
export const submit = `${website}/new/main/src/lib/themes?filename=my-theme.json&value=${encodeURIComponent(STARTER)}`;

/** Every theme in `src/lib/themes`, sorted by name. A file Sonora would refuse fails the build. */
export const themes: CommunityTheme[] = Object.entries(files)
	.map(([path, text]) => read(path, text))
	.sort((a, b) => a.name.localeCompare(b.name));

/** Checks one theme file the way Sonora checks a theme link, and builds its link. */
function read(path: string, text: string): CommunityTheme {
	const id = path
		.split('/')
		.pop()!
		.replace(/\.json$/, '');
	const fail = (reason: string): never => {
		throw new Error(`src/lib/themes/${id}.json: ${reason}`);
	};
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail('the file name must be lowercase-kebab-case');

	const parsed: unknown = JSON.parse(text);
	if (!isObject(parsed)) return fail('the file must contain an object');
	for (const key of Object.keys(parsed)) {
		if (!KEYS.has(key)) fail(`unknown field "${key}"`);
	}
	if (parsed.version !== 1) fail('version must be 1');

	const name = label(parsed.name, 'name', fail);
	const author = label(parsed.author, 'author', fail);

	if (!isObject(parsed.theme)) return fail('theme must contain an object');
	const theme: Record<string, string> = {};
	for (const [token, value] of Object.entries(parsed.theme)) {
		if (!TOKENS.has(token)) fail(`"${token}" is not a theme color`);
		if (typeof value !== 'string' || !COLOR.test(value.trim())) {
			fail(`theme.${token} is not a valid color`);
		}
		theme[token] = (value as string).trim();
	}

	const canonical = { name, author, version: 1, theme };
	const link = LINK + base64url(JSON.stringify(canonical));
	if (link.length > LINK_LIMIT) fail('the theme is too large for a link');

	const colors: Record<string, string> = {};
	for (const token of FIELDS) colors[token] = css(theme[token] ?? darkColors[token]);

	return { id, name, author, colors, file: JSON.stringify(canonical, null, 2) + '\n', link };
}

function label(value: unknown, field: string, fail: (reason: string) => never): string {
	if (typeof value !== 'string' || !value.trim()) return fail(`${field} must not be empty`);
	const text = value.trim();
	if ([...text].length > LABEL_LIMIT) fail(`${field} is longer than ${LABEL_LIMIT} characters`);
	if (HIDDEN.test(text)) fail(`${field} has control or invisible characters`);
	return text;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A hex colour, with or without `#` and with an optional alpha byte, as CSS `rgb()`. */
function css(hex: string): string {
	const digits = hex.replace(/^#/, '');
	const [red, green, blue, alpha = 255] = (digits.match(/../g) ?? []).map((pair) =>
		parseInt(pair, 16)
	);
	return `rgb(${red} ${green} ${blue} / ${Math.round((alpha / 255) * 1000) / 1000})`;
}

/** Unpadded base64url of the UTF-8 bytes of `text`. */
function base64url(text: string): string {
	let binary = '';
	for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

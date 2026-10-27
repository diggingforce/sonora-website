<script lang="ts">
	import EditLink from '$lib/components/EditLink.svelte';
	import ThemeMiniature from '$lib/components/ThemeMiniature.svelte';
	import { website } from '$lib/data/links';
	import { themes } from '$lib/data/themes';
</script>

<svelte:head>
	<title>Community themes · Sonora</title>
	<meta
		name="description"
		content="Themes for Sonora that people made and shared. Install one with a click."
	/>
</svelte:head>

<section class="section">
	<span class="cross start"></span>
	<span class="cross end"></span>

	<div class="page gallery">
		<header>
			<span class="kicker">Themes</span>
			<h1>Community themes</h1>
			<p class="summary">
				Install opens Sonora and shows you the theme before anything changes. If nothing happens,
				your Sonora is older than theme links. Download the file instead and drop it into your
				<a href="/docs/themes#folder">themes folder</a>.
			</p>
		</header>

		<ul class="grid">
			{#each themes as theme (theme.id)}
				<li class="card">
					<div class="preview">
						<ThemeMiniature colors={theme.colors} />
					</div>
					<div class="body">
						<div class="names">
							<h2>{theme.name}</h2>
							<span class="author">by {theme.author}</span>
						</div>
						<div class="actions">
							<a class="btn btn-primary" href={theme.link}>Install</a>
							<a
								class="btn btn-secondary"
								href="data:application/json;charset=utf-8,{encodeURIComponent(theme.file)}"
								download="{theme.id}.json">Download</a
							>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		<div class="share">
			<h2>Share yours</h2>
			<p>
				<a href="/docs/themes#format">Write a theme file</a>, then open a pull request that adds it
				to <a href="{website}/tree/main/src/lib/themes"><code>src/lib/themes</code></a> in the
				website repository. Name the file after the theme in lowercase with hyphens, such as
				<code>night-owl.json</code>.
			</p>
		</div>

		<div class="source">
			<EditLink path="src/routes/themes/+page.svelte" />
		</div>
	</div>
</section>

<style>
	.gallery {
		padding-top: 72px;
		padding-bottom: 96px;
	}

	header {
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 40px;
	}

	h1 {
		font-size: 36px;
	}

	.summary {
		font-size: 15px;
		line-height: 1.6;
		color: var(--muted-fg);
	}

	.summary a,
	.share a {
		color: var(--fg);
		text-decoration: underline;
		text-decoration-color: var(--faint);
		text-underline-offset: 3px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		overflow: hidden;
	}

	.preview {
		padding: 16px;
		border-bottom: 1px solid var(--line);
	}

	.preview :global(svg) {
		border-radius: var(--radius);
		overflow: hidden;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 14px 16px 16px;
	}

	.names {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	h2 {
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.author {
		font-size: 13px;
		color: var(--muted-fg);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		gap: 8px;
	}

	.actions .btn {
		flex: 1;
		height: 34px;
		padding: 0 14px;
		font-size: 13px;
	}

	.share {
		max-width: 640px;
		margin-top: 56px;
	}

	.share h2 {
		font-size: 20px;
		margin-bottom: 10px;
	}

	.share p {
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--muted-fg);
	}

	code {
		font-family: var(--mono);
		font-size: 0.92em;
		white-space: nowrap;
	}

	.source {
		margin-top: 48px;
	}

	@media (max-width: 900px) {
		.gallery {
			padding-top: 48px;
			padding-bottom: 64px;
		}
	}
</style>

<script lang="ts">
	import MenuPath from '$lib/components/docs/MenuPath.svelte';
</script>

<svelte:head>
	<title>Sound · Sonora docs</title>
</svelte:head>

<h1>Sound</h1>
<p class="summary">The output device and the equalizer.</p>

<h2 id="output">Output device</h2>
<p>
	Choose a device in <MenuPath steps={['Settings', 'Playback', 'Sound', 'Output device']} />. While
	it's disconnected, audio plays on the system default. Every track is resampled to the device's
	sample rate.
</p>
<table>
	<tbody>
		<tr>
			<td>Sample rate</td>
			<td>Linux only. 32 to 192 kHz, limited to the rates your device supports.</td>
		</tr>
		<tr>
			<td>Buffer size</td>
			<td>
				128 to 4096 frames, 1024 by default. Raise it if you hear crackles, lower it if pause feels
				slow.
			</td>
		</tr>
		<tr>
			<td>Direct to hardware</td>
			<td>Linux only. Plays to the sound card past PipeWire or PulseAudio, bit-perfect.</td>
		</tr>
	</tbody>
</table>

<h2 id="equalizer">Equalizer</h2>
<p>
	Open it from <MenuPath steps={['Settings', 'Playback', 'Sound', 'Equalizer']} />.
	<strong>Simple</strong> mode has the presets and the <strong>Bass</strong> and
	<strong>Treble</strong> sliders, up to 12 dB either way on top of the preset.
	<strong>Advanced</strong> mode has up to 20 filters: peak, low shelf, high shelf, low pass, high pass,
	notch, band pass and all pass.
</p>
<p>On the graph:</p>
<ul>
	<li>drag a filter to move it</li>
	<li>scroll over a filter to change its width</li>
	<li>double-click to add a filter</li>
	<li>right-click a filter to remove it</li>
</ul>
<p>
	If the sound clips, press <strong>Lower preamp</strong>. Undo with <kbd>Ctrl</kbd> <kbd>Z</kbd>,
	redo with <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>Z</kbd>. On macOS, use <kbd>⌘</kbd>.
</p>

<h3 id="import">Importing a profile</h3>
<p>
	<strong>Import and export</strong> takes Equalizer APO text, the format AutoEQ and Room EQ Wizard
	publish, from a file or the clipboard. Unsupported lines, such as <code>Channel</code>,
	<code>Convolution</code> or <code>GraphicEQ</code>, are skipped.
</p>

<h3 id="device-rules">Device rules</h3>
<p>
	Under <strong>Device rules</strong>, assign a preset or profile to an output device. It switches
	on when playback starts on that device. <strong>Any other device</strong> covers the rest.
</p>

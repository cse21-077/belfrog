<script lang="ts">
	interface Props {
		label: string;
		title: string;
		light?: boolean;
	}

	let { label, title, light = false }: Props = $props();
</script>

<div class="mb-10 max-w-2xl">
	<span class="text-sm font-semibold uppercase tracking-widest text-accent">{label}</span>
	<h2 class="mt-3 text-3xl font-bold leading-tight md:text-4xl {light ? 'text-white' : 'text-stone-900'}">
		{title}
	</h2>
</div>

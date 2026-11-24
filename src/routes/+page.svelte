<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Stay from '$lib/components/Stay.svelte';
	import Glamping from '$lib/components/Glamping.svelte';
	import Rates from '$lib/components/Rates.svelte';
	import About from '$lib/components/About.svelte';
	import Experiences from '$lib/components/Experiences.svelte';
	import Reviews from '$lib/components/Reviews.svelte';
	import MoreInfo from '$lib/components/MoreInfo.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>The Bell Frog Inn | Okavango Delta, Botswana</title>
	<meta
		name="description"
		content="Tented accommodation, Mokoro trips and doors-off helicopter adventures at The Bell Frog Inn in the Okavango Delta, Botswana."
	/>
</svelte:head>

<main>
	<Hero settings={data.settings} />
	<Stay tents={data.tents} rates={data.rates} settings={data.settings} />
	<Glamping tents={data.tents} settings={data.settings} />
	<Rates rates={data.rates} settings={data.settings} />
	<About />
	<Experiences settings={data.settings} />
	<Reviews reviews={data.reviews} settings={data.settings} />
	<MoreInfo />
	<Footer settings={data.settings} />
</main>

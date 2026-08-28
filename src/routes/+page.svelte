<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Stay from '$lib/components/Stay.svelte';
	import Glamping from '$lib/components/Glamping.svelte';
	import About from '$lib/components/About.svelte';
	import Experiences from '$lib/components/Experiences.svelte';
	import MoreInfo from '$lib/components/MoreInfo.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>The Bell Frog Inn | Okavango Delta, Botswana</title>
	<meta
		name="description"
		content="Riverside glamping, Mokoro trips and doors-off helicopter adventures at The Bell Frog Inn on the Boro River in the Okavango Delta, Botswana."
	/>
</svelte:head>

<main>
	<Hero />
	<Stay />
	<Glamping />
	<About />
	<Experiences />
	<MoreInfo />
	<Footer />
</main>

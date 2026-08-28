<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="more-info" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="The Details" title="More About Your Stay" />

		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="order-2 lg:order-1">
				<div class="grid grid-cols-2 gap-4">
					<div class="aspect-[3/4] overflow-hidden rounded-3xl">
						<video
							autoplay
							muted
							loop
							playsinline
							class="h-full w-full object-cover"
						>
							<source src="/pizza.mp4" type="video/mp4" />
						</video>
					</div>
					<div class="aspect-[3/4] overflow-hidden rounded-3xl">
						<img
							src="/pizzainfire.jpg"
							alt="Artisanal pizza baked in a wood-fired oven"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>

			<div class="order-1 space-y-6 leading-relaxed text-stone-700 lg:order-2">
				<p>
					The Bell Frog Inn is nestled alongside the <strong>Boro River</strong>, which originates in the Southern Angolan mountains, courses through the Caprivi strip, winds through the heart of the Okavango Delta, and passes gracefully by our Bar & Restaurant.
				</p>
				<p>
					Maun has over 55,000 inhabitants but still feels like an old frontier town. It’s an exciting off-road 40-minute drive to us, or a pleasant 35-minute jaunt up the river in one of our Swamp Cruisers. On the way you’ll pass cattle, goats and donkeys — and if you’re lucky, elephants, hippos, crocodiles and an abundance of birdlife. During flood season, The Bell Frog enjoys 300 metres of beautiful waterfront.
				</p>
				<p>
					Cool off in our inviting overflow pool while enjoying our renowned <strong>artisanal pizza</strong> and legendary <strong>chicken jalapeño pocket</strong> — just ask our bartender.
				</p>
				<p>
					Each tented room offers a serene riverside experience with its own ablution facilities, electricity for charging your devices, and views of the river (subject to flood conditions). Wake up to a complimentary breakfast, and let us prepare a packed lunch for your upstream boat excursion or game drive.
				</p>
			</div>
		</div>
	</div>
</section>

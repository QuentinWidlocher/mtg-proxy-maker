export default function InfoTab() {
	return (
		<div class="flex flex-col gap-5 mt-5 p-10 pt-0 text-stone-200">
			<p>
				When printing, set your margins to "None" and your page scale to "100%".
				(The app take care of size and margins)
				<br />
				Cards have a 1mm bleed, so you can safely cut them with a 1mm margin.
			</p>
			<p>Hover an artwork to chose a different one if available.</p>
			<p>
				The search box supports all the{" "}
				<a
					class="text-white font-bold hover:underline"
					href="https://scryfall.com/docs/syntax"
				>
					Scryfall search syntax
				</a>
				. If you don't see a card in the list, it means it's not available on
				Scryfall. (Tokens only exists in english, for example)
			</p>
			<div>
				<span>See a bug ? Have a feature request ? </span>

				<ul class="h-10 mt-2 list-disc">
					<li>
						<a
							href="https://github.com/QuentinWidlocher/mtg-proxy-maker"
							class="font-bold hover:underline text-white"
						>
							Open an issue on GitHub
						</a>
					</li>
					<li>
						<a
							href="mailto:quentin@widlocher.com"
							class="font-bold hover:underline text-white"
						>
							Send me an email
						</a>
					</li>
				</ul>
			</div>
			<p class="text-xs mt-5 text-stone-300">
				The literal and graphical information presented on this site about
				Magic: The Gathering, including card images, mana symbols, and Oracle
				text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro,
				Inc. MTG Proxy Maker is not produced by or endorsed by Wizards of the
				Coast.
			</p>{" "}
		</div>
	);
}

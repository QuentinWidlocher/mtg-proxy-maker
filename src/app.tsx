import { For, Show, createEffect, createSignal } from "solid-js";
import FetchCard from "./components/card/fetch-card";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";

export default function App() {
	const url = new URL(window.location.href);
	const rawLanguage =
		url.searchParams.get("language") ??
		localStorage.getItem("language") ??
		"en";
	const rawCardList =
		url.searchParams.get("cardList") ?? localStorage.getItem("cardList") ?? "";
	const parsedCardList = parseMtgo(decodeURI(rawCardList));

	const [cardList, setCardList] =
		createSignal<{ name: string; number: number }[]>(parsedCardList);
	const [language, setLanguage] = createSignal(rawLanguage);

	createEffect(() => {
		const rawCardList = cardList()
			.map((c) => `${c.number} ${c.name}`)
			.join("\n");

		const urlSearchParams = new URLSearchParams({
			cardList: rawCardList,
			language: language(),
		}).toString();

		window.history.replaceState(null, "", `/?${urlSearchParams}`);

		localStorage.setItem("cardList", rawCardList);
		localStorage.setItem("language", language());
	});

	const cardNames = () =>
		cardList().flatMap(({ name, number }) =>
			[...new Array(number)].map((_, i) => ({
				cardName: name,
				variant: i,
				language: language(),
			}))
		);

	const slicedCardElements = () =>
		[...new Array(Math.ceil(cardNames()!.length / 9))].map((_, i) =>
			cardNames().slice(i * 9, i * 9 + 9)
		);

	const [openPages, setOpenPages] = createSignal<boolean[]>(
		slicedCardElements().map(() => false)
	);

	return (
		<main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:!block print:overflow-visible">
			<Sidebar
				cardList={cardList()}
				setCardList={setCardList}
				language={language()}
				setLanguage={setLanguage}
				pages={openPages()}
			/>

			<div class="relative h-full grid grid-cols-1 overflow-y-hidden grid-rows-[auto_1fr] bg-stone-700 print:bg-white print:overflow-visible">
				<div class="flex w-full print:hidden">
					<button
						class="flex-1 p-5 hover:bg-stone-600 text-xl text-white"
						onClick={() => {
							setOpenPages(() =>
								[...new Array(slicedCardElements().length)].fill(true)
							);
						}}
					>
						Open all pages
					</button>
					<button
						class="flex-1 p-5 hover:bg-stone-600 text-xl text-white"
						onClick={() => {
							setOpenPages(() =>
								[...new Array(slicedCardElements().length)].fill(false)
							);
						}}
					>
						Close all pages
					</button>
				</div>
				<div class="overflow-y-auto pages print:h-auto print:overflow-y-visible">
					<For each={slicedCardElements()}>
						{(cards, i) => (
							<details
								class="group"
								open={openPages()[i()]}
								onToggle={(e) =>
									setOpenPages((prev) => {
										const newPages = [...prev];
										newPages[i()] = e.currentTarget.open;
										return newPages;
									})
								}
							>
								<summary class="p-5 pl-10 hover:bg-stone-600 group-open:bg-stone-600 cursor-pointer text-xl text-white print:hidden">
									Page {i() + 1} ({cards.length} / 9){" "}
									{openPages()[i()] ? null : "(open to print)"}
								</summary>

								<Show when={openPages()[i()]}>
									{openPages()[i() - 1 ?? 0] && <div class="page-break" />}
									<div class="page bg-stone-600 print:bg-white">
										<div class="card-grid md:p-5">
											<For each={cards}>{FetchCard}</For>
										</div>
									</div>
								</Show>
							</details>
						)}
					</For>
				</div>
				<details class="min-h-[3rem] transition-all shadow-xl rounded-tr-lg fixed bottom-0 z-20 w-auto bg-stone-700 print:hidden">
					<summary class="text-white p-5 cursor-pointer">Informations</summary>

					<div class="flex flex-col gap-5 mt-5 p-10 pt-0 text-stone-200">
						<p>
							When printing, set your margins to "None" and your page scale to
							"100%". (The app take care of size and margins)
							<br />
							Cards have a 1mm bleed, so you can safely cut them with a 1mm
							margin.
						</p>
						<p>
							The search box supports all the{" "}
							<a
								class="text-white font-bold hover:underline"
								href="https://scryfall.com/docs/syntax"
							>
								Scryfall search syntax
							</a>
							. If you don't see a card in the list, it means it's not available
							on Scryfall.
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
							Magic: The Gathering, including card images, mana symbols, and
							Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary
							of Hasbro, Inc. MTG Proxy Maker is not produced by or endorsed by
							Wizards of the Coast.
						</p>
					</div>
				</details>
			</div>
		</main>
	);
}

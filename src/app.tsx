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

	const [openPages, setOpenPages] = createSignal<boolean[]>([]);

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

	return (
		<main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:block">
			<Sidebar
				cardList={cardList()}
				setCardList={setCardList}
				language={language()}
				setLanguage={setLanguage}
				totalPages={openPages().filter(Boolean).length}
			/>

			<div class="relative h-full grid grid-cols-1 overflow-y-hidden grid-rows-[auto_1fr_auto] bg-stone-700 print:bg-white">
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
								{i() > 0 && <div class="page-break" />}
								<summary class="p-5 pl-10 hover:bg-stone-600 group-open:bg-stone-600 cursor-pointer text-xl text-white print:hidden">
									Page {i() + 1} ({cards.length} / 9){" "}
									{openPages()[i()] ? null : "(open to print)"}
								</summary>

								<Show when={openPages()[i()]}>
									<div class="page bg-stone-600 print:bg-white">
										<div class="card-grid">
											<For each={cards}>{FetchCard}</For>
										</div>
									</div>
								</Show>
							</details>
						)}
					</For>
				</div>
				<div class="min-h-[3rem] p-5 bg-stone-700 print:hidden flex">
					<div class="my-auto w-full flex justify-around text-white">
						<span>
							When printing, set your margins to "None" and your page scaling to
							"100%"
						</span>
						<details>
							<summary>See a bug ? Have a feature request ? </summary>

							<ul class="h-10 mt-5">
								<li>
									<a
										href="https://github.com/QuentinWidlocher/mtg-proxy-maker"
										class="hover:underline"
									>
										Open an issue on GitHub
									</a>
								</li>
								<li>
									<a
										href="mailto:quentin@widlocher.com"
										class="hover:underline"
									>
										Send me an email
									</a>
								</li>
							</ul>
						</details>
					</div>
				</div>
			</div>
		</main>
	);
}

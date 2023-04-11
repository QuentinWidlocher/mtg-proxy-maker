import { For, Show, createEffect, createSignal } from "solid-js";
import FetchCard from "./components/card/fetch-card";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";

export default function App() {
	const url = new URL(window.location.href);
	const rawLanguage = url.searchParams.get("language") ?? "en";
	const rawCardList = url.searchParams.get("cardList") ?? "";
	const parsedCardList = parseMtgo(decodeURI(rawCardList));

	const [openPages, setOpenPages] = createSignal<boolean[]>([]);

	const [cardList, setCardList] =
		createSignal<{ name: string; number: number }[]>(parsedCardList);
	const [language, setLanguage] = createSignal(rawLanguage);

	createEffect(() => {
		const urlSearchParams = new URLSearchParams({
			cardList: cardList()
				.map((c) => `${c.number} ${c.name}`)
				.join("\n"),
			language: language(),
		}).toString();

		window.history.replaceState(null, "", `/?${urlSearchParams}`);
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

			<div class="relative h-full overflow-y-auto print:h-auto print:overflow-y-visible pages bg-stone-700 print:bg-white">
				<div class="flex w-full print:hidden sticky top-0 z-20 bg-stone-700">
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
								<div class="page bg-stone-600">
									<div class="card-grid">
										<For each={cards}>{FetchCard}</For>
									</div>
								</div>
							</Show>
						</details>
					)}
				</For>
			</div>
		</main>
	);
}

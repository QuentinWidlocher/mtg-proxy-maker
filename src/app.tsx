import { createMediaQuery } from "@solid-primitives/media";
import { For, createEffect, createSignal } from "solid-js";
import FetchCard from "./components/card/fetch-card";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";

export default function App() {
	const url = new URL(window.location.href);
	const rawLanguage = url.searchParams.get("language") ?? "en";
	const rawCardList = url.searchParams.get("cardList") ?? "";
	const parsedCardList = parseMtgo(decodeURI(rawCardList));

	const [openPages, setOpenPages] = createSignal<boolean[]>([]);
	const printMode = createMediaQuery("print");

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
				totalPages={Math.ceil((cardNames() ?? []).length / 9)}
			/>

			<div class="relative h-full overflow-y-auto print:h-auto print:overflow-y-visible pages bg-stone-700 print:bg-white">
				<For each={slicedCardElements()}>
					{(cards, i) => (
						<details
							open={printMode() || openPages()[i()]}
							onToggle={(e) =>
								setOpenPages((prev) => {
									const newPages = [...prev];
									newPages[i()] = e.currentTarget.open;
									return newPages;
								})
							}
						>
							{i() > 0 && <div class="page-break" />}
							<summary class="m-5 ml-10 cursor-pointer text-xl text-white print:hidden">
								Page {i() + 1} ({cards.length} / 9)
							</summary>
							<div class="page">
								<div class="card-grid">
									<For each={cards}>{FetchCard}</For>
								</div>
							</div>
						</details>
					)}
				</For>
			</div>
		</main>
	);
}

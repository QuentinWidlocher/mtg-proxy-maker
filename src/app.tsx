import { For, createEffect, createResource, createSignal } from "solid-js";
import CardComponent from "./components/card/card";
import CardNotFoundComponent from "./components/card/card-not-found";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";
import { fetchCards } from "./services/scryfall";

async function getCards(
	cardList: { name: string; number: number }[],
	language: string
) {
	const cards = (
		await Promise.all([
			...cardList.flatMap((origCard) =>
				fetchCards(origCard.name, origCard.number, language)
					.then((cards) => Promise.all(cards.flatMap(CardComponent)))
					.catch(() => <CardNotFoundComponent cardName={origCard.name} />)
			),
		])
	)
		.flat()
		.filter(Boolean);

	console.log(
		`Generated ${cards.length} cards (${Math.ceil(cards.length / 9)} pages)`
	);

	return cards;
}

export default function App() {
	const url = new URL(window.location.href);
	const rawLanguage = url.searchParams.get("language") ?? "en";
	const rawCardList = url.searchParams.get("cardList") ?? "";
	const parsedCardList = parseMtgo(decodeURI(rawCardList));

	const [cardList, setCardList] =
		createSignal<{ name: string; number: number }[]>(parsedCardList);
	const [language, setLanguage] = createSignal(rawLanguage);

	const [cardListElements] = createResource(
		() => [cardList(), language()],
		() => getCards(cardList(), language())
	);

	createEffect(() => {
		const urlSearchParams = new URLSearchParams({
			cardList: cardList()
				.map((c) => `${c.number} ${c.name}`)
				.join("\n"),
			language: language(),
		}).toString();

		window.history.replaceState(null, "", `/?${urlSearchParams}`);
	});

	return (
		<main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:block">
			<Sidebar
				cardList={cardList()}
				setCardList={setCardList}
				language={language()}
				setLanguage={setLanguage}
			/>

			{cardListElements.loading ? (
				<div class="flex items-center justify-center h-full bg-stone-700">
					<div class="animate-ping">
						<div class="w-10 h-10 rounded-full bg-stone-900" />
					</div>
				</div>
			) : (
				<div class="relative h-full overflow-y-auto print:h-auto print:overflow-y-visible pages bg-stone-700 print:bg-white">
					{[...new Array(Math.ceil(cardListElements()!.length / 9))].map(
						(_, i) => (
							<details open>
								{i > 0 && <div class="page-break" />}
								<summary class="m-5 ml-10 cursor-pointer text-xl text-white print:hidden">
									Page {i + 1}
								</summary>
								<div class="page">
									<div class="card-grid">
										<For each={cardListElements()!.slice(i * 9, i * 9 + 9)}>
											{(card) => card}
										</For>
									</div>
								</div>
							</details>
						)
					)}
				</div>
			)}
		</main>
	);
}

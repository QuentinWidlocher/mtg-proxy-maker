import {
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import FetchCard from "./components/card/fetch-card";
import InfoTab from "./components/info-tab";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";
import { fetchCardType } from "./services/scryfall";
import { ListCard } from "./types/list-card";

function createResourceStore<T extends {}>(
	initialValue: T,
	...args: Parameters<typeof createResource<T>>
) {
	const [resource] = createResource<T>(...args);
	const [store, setStore] = createStore<T>(initialValue);

	const signal = () => ({
		value: store,
		state: resource.state,
		error: resource.error,
		loading: resource.loading,
	});

	createEffect(() => {
		if (resource.latest) {
			setStore(resource.latest);
		}
	});

	return [signal, setStore] as const;
}

export default function App() {
	const url = new URL(window.location.href);
	const rawLanguage =
		url.searchParams.get("language") ??
		localStorage.getItem("language") ??
		"en";
	const initialRawCardList = url.searchParams.get("cardList") ?? "";
	const parsedCardList = parseMtgo(decodeURI(initialRawCardList));

	const [language, setLanguage] = createSignal(rawLanguage);

	const [cardList, setCardList] = createResourceStore<ListCard[]>(
		[],
		async (): Promise<ListCard[]> => {
			const fullList = await Promise.all(
				parsedCardList.flatMap(({ name, number }) =>
					[...new Array(number)].map(async (_, i) => {
						const type = await fetchCardType(name);
						return {
							name,
							type,
							language: language(),
							variant: type.toLowerCase().includes("basic land")
								? i
								: undefined,
						};
					})
				)
			);
			return fullList;
		}
	);

	const rawCardListInfo = (): Array<ListCard & { number: number }> => {
		if (cardList().state != "ready") {
			return [];
		}

		const cardListUniqueNames = new Set(cardList().value.map((c) => c.name));

		return [...cardListUniqueNames].map((name) => ({
			name,
			language: cardList().value.find((c) => c.name == name)?.language ?? "en",
			number: cardList().value.filter((c) => c.name == name).length,
			type: cardList().value.find((c) => c.name == name)?.type ?? "",
		}));
	};

	const rawCardList = () =>
		rawCardListInfo()
			.map(({ number, name }) => `${number} ${name}`)
			.join("\n");

	createEffect(() => {
		const urlSearchParams = new URLSearchParams({
			cardList: rawCardList(),
			language: language(),
		}).toString();

		window.history.replaceState(null, "", `/?${urlSearchParams}`);

		localStorage.setItem("cardList", rawCardList());
		localStorage.setItem("language", language());
	});

	createEffect(() => {
		const lang = language();
		setCardList((prev) => prev.map((c) => ({ ...c, language: lang })));
	});

	const slicedCardElements = () =>
		cardList().state == "ready"
			? [...new Array(Math.ceil(cardList().value.length / 9))].map((_, i) =>
					cardList().value.slice(i * 9, i * 9 + 9)
			  )
			: [];

	return (
		<main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:!block print:overflow-visible">
			<Sidebar
				rawCardListInfo={rawCardListInfo()}
				cardList={cardList().value}
				setCardList={setCardList}
				language={language()}
				setLanguage={setLanguage}
			/>

			<div class="relative h-full overflow-y-auto bg-stone-700 print:bg-white print:overflow-visible pages">
				<Show
					when={false}
					fallback={
						<div class="card-grid print:m-auto">
							<For each={cardList().value}>
								{(card, j) => (
									<div>
										{[0, 1, 2].includes(j() % 9) && <div class="print:mt-10" />}
										<FetchCard
											{...card}
											onVariantChange={(v) => {
												setCardList(j(), "variant", v);
											}}
										/>
										{[6, 7, 8].includes(j() % 9) && <div class="print:mb-10" />}
										{j() % 9 == 8 && <div class="break-after-page" />}
									</div>
								)}
							</For>
						</div>
					}
				>
					<For each={slicedCardElements()}>
						{(cards, i) => (
							<div class="page bg-stone-600 print:bg-white">
								<div class="card-grid md:p-5">
									<For each={cards}>{FetchCard}</For>
								</div>
							</div>
						)}
					</For>
				</Show>
				<details class="min-h-[3rem] transition-all shadow-xl rounded-tr-lg fixed bottom-0 z-20 w-auto bg-stone-700 print:hidden">
					<summary class="text-white p-5 cursor-pointer">Informations</summary>
					<InfoTab />
				</details>
			</div>
		</main>
	);
}

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
	const initialRawCardList =
		url.searchParams.get("cardList") ?? localStorage.getItem("cardList") ?? "";
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
		if (cardList().state != "ready") return;

		const urlSearchParams = new URLSearchParams({
			cardList: rawCardList(),
			language: language(),
		}).toString();

		window.history.replaceState(null, "", `/?${urlSearchParams}`);

		localStorage.setItem("cardList", rawCardList());
		localStorage.setItem("language", language());
	});

	createEffect(() => {
		if (cardList().state != "ready") return;
		setCardList((prev) => prev.map((c) => ({ ...c, language: language() })));
	});

	const slicedCardElements = () =>
		cardList().state == "ready"
			? [...new Array(Math.ceil(cardList().value.length / 9))].map((_, i) =>
					cardList().value.slice(i * 9, i * 9 + 9)
			  )
			: [];

	const [openPages, setOpenPages] = createSignal<boolean[]>(
		slicedCardElements().map(() => false)
	);

	return (
		<main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:!block print:overflow-visible">
			<Sidebar
				rawCardListInfo={rawCardListInfo()}
				cardList={cardList().value}
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
					<Show
						when={false}
						fallback={
							<div class="card-grid">
								<For each={cardList().value}>
									{(card, j) => (
										<FetchCard
											{...card}
											onVariantChange={(v) => {
												setCardList(j(), "variant", v);
											}}
										/>
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
				</div>
				<details class="min-h-[3rem] transition-all shadow-xl rounded-tr-lg fixed bottom-0 z-20 w-auto bg-stone-700 print:hidden">
					<summary class="text-white p-5 cursor-pointer">Informations</summary>
					<InfoTab />
				</details>
			</div>
		</main>
	);
}

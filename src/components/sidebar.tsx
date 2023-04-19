import { For, Setter, createSignal } from "solid-js";
import { SetStoreFunction, produce } from "solid-js/store";
import { parseMtgo } from "../services/mtgo-parser";
import { fetchCardType } from "../services/scryfall";
import { ListCard } from "../types/list-card";
import Button from "./button";
import ScryfallSearchBox from "./scryfall-searchbox";

type SidebarProps = {
	rawCardListInfo: Array<ListCard & { number: number }>;
	cardList: ListCard[];
	setCardList: SetStoreFunction<ListCard[]>;
	language: string;
	setLanguage: Setter<string>;
};

export default function Sidebar(props: SidebarProps) {
	const [rawCardListDialogOpen, setRawCardListDialogOpen] = createSignal(false);

	return (
		<>
			<aside class=" h-full shadow-xl overflow-y-hidden print:hidden w-full bg-stone-500">
				<div class="flex flex-col h-full gap-5 p-5">
					<div>
						<label for="language" class="text-white">
							Card language
						</label>
						<select
							name="language"
							value={props.language}
							onChange={(e) => {
								props.setLanguage(e.target.value);
							}}
							class="w-full p-1 border rounded shadow-inner bg-stone-200"
						>
							<option value="en">English</option>
							<option value="sp">Spanish</option>
							<option value="fr">French</option>
							<option value="de">German</option>
							<option value="it">Italian</option>
							<option value="pt">Portuguese</option>
							<option value="jp">Japanese</option>
							<option value="ko">Korean</option>
							<option value="ru">Russian</option>
							<option value="cs">Simplified Chinese</option>
							<option value="ct">Traditional Chinese</option>
							<option value="ph">Phyrexian</option>
						</select>
					</div>
					<div class="flex-1 overflow-y-auto flex flex-col gap-2">
						<For each={props.rawCardListInfo}>
							{(card) => (
								<div class="text-white flex">
									<span class="text-white text-lg my-auto overflow-hidden text-ellipsis whitespace-nowrap pl-1">
										{card.number} {card.name}
									</span>
									<div class="ml-auto flex gap-2">
										<Button
											class="font-mono px-3"
											onClick={() => {
												props.setCardList(
													produce((list) => {
														list.splice(list.indexOf(card), 1);
													})
												);
											}}
										>
											-
										</Button>
										<Button
											class="font-mono px-3"
											onClick={() => {
												props.setCardList(props.cardList!.length, card);
											}}
										>
											+
										</Button>
									</div>
								</div>
							)}
						</For>
					</div>

					<ScryfallSearchBox
						onAddCard={({ name, type }) => {
							props.setCardList(
								produce((list) => {
									list.push({
										name,
										type,
										language: props.language,
									});
								})
							);
						}}
					/>
					<Button
						type="button"
						class="w-full"
						onClick={() => setRawCardListDialogOpen(true)}
					>
						Import from MTGO
					</Button>
					<Button
						type="button"
						class="w-full"
						onClick={() => props.setCardList([])}
					>
						Clear list
					</Button>
					<Button
						type="button"
						class="w-full text-amber-50 !bg-amber-500 hover:!bg-amber-600 disabled:!bg-amber-400 disabled:!cursor-not-allowed disabled:!text-amber-100"
						disabled={!props.cardList || props.cardList.length <= 0}
						onClick={() => {
							print();
						}}
					>
						Print {props.cardList.length} card
						{props.cardList.length > 1 ? "s" : ""}
					</Button>
				</div>
			</aside>
			<dialog
				class="z-20 h-1/2 w-96 bg-stone-600 shadow-xl mt-52 rounded-lg backdrop:bg-black/50"
				open={rawCardListDialogOpen()}
			>
				<form
					method="dialog"
					class="flex flex-col h-full gap-2"
					onSubmit={async (e) => {
						e.preventDefault();
						const rawCardList = (e.target as HTMLFormElement).cardList.value;
						const parsedList = parseMtgo(rawCardList);
						const fullList = await Promise.all(
							parsedList.flatMap(({ name, number }) =>
								[...new Array(number)].map(async (_, i) => {
									const type = await fetchCardType(name);
									return {
										name,
										type,
										language: props.language,
										variant: type.toLowerCase().includes("basic land")
											? i
											: undefined,
									};
								})
							)
						);

						props.setCardList(fullList);
						setRawCardListDialogOpen(false);
					}}
				>
					<label for="cardList" class="text-white">
						Paste your card list here
					</label>
					<textarea
						name="cardList"
						class="flex-1 w-full h-1/2 p-1 border rounded shadow-inner bg-stone-200"
						value={props.rawCardListInfo.map((c) => c.number + " " + c.name)}
					/>
					<div class="w-full flex gap-2">
						<Button
							class="w-full !bg-stone-500"
							type="reset"
							onClick={() => setRawCardListDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button class="w-full !bg-stone-500">Submit</Button>
					</div>
				</form>
			</dialog>
		</>
	);
}

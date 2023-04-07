import { For, Setter, createSignal } from "solid-js";
import { parseMtgo } from "../services/mtgo-parser";
import Button from "./button";
import ScryfallSearchBox from "./scryfall-searchbox";

type SidebarProps = {
	cardList: { name: string; number: number }[];
	setCardList: Setter<{ name: string; number: number }[]>;
	language: string;
	setLanguage: Setter<string>;
};

export default function Sidebar(props: SidebarProps) {
	const [rawCardListDialogOpen, setRawCardListDialogOpen] = createSignal(false);

	const rawCardList = () =>
		props.cardList.map(({ name, number }) => `${number} ${name}`).join("\n");

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
						<For each={props.cardList}>
							{(card) => (
								<div class="text-white flex">
									<span class="text-white text-lg my-auto overflow-hidden text-ellipsis whitespace-nowrap pl-1">{`${card.number} ${card.name}`}</span>
									<div class="ml-auto flex gap-2">
										<Button
											class="font-mono px-3"
											onClick={() => {
												props.setCardList((list) => {
													const foundCardIndex = list.findIndex(
														(c) => c.name == card.name
													);
													if (foundCardIndex >= 0) {
														const foundCard = list[foundCardIndex];

														if (foundCard.number <= 1) {
															return list.filter((c) => c.name != card.name);
														} else {
															return list.map((c) => {
																if (c.name == card.name) {
																	return {
																		...c,
																		number: c.number - 1,
																	};
																} else {
																	return c;
																}
															});
														}
													}
													return list;
												});
											}}
										>
											-
										</Button>
										<Button
											class="font-mono px-3"
											onClick={() => {
												props.setCardList((list) => {
													const foundCardIndex = list.findIndex(
														(c) => c.name == card.name
													);
													if (foundCardIndex >= 0) {
														return list.map((c) => {
															if (c.name == card.name) {
																return {
																	...c,
																	number: c.number + 1,
																};
															} else {
																return c;
															}
														});
													}
													return list;
												});
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
						onAddCard={(cardName) =>
							props.setCardList((prev) => [
								...prev,
								{ name: cardName, number: 1 },
							])
						}
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
						class="w-full !bg-amber-500 hover:!bg-amber-600 text-amber-950"
						disabled={!props.cardList || props.cardList.length <= 0}
						onClick={() => {
							print();
						}}
					>
						Print {Math.ceil((props.cardList ?? []).length / 9)} pages
					</Button>
				</div>
			</aside>
			<dialog
				class="z-20 h-1/2 w-1/2 bg-stone-600 shadow-xl mt-52 rounded-lg backdrop:bg-black/50"
				open={rawCardListDialogOpen()}
			>
				<form
					method="dialog"
					class="flex flex-col h-full gap-2"
					onSubmit={(e) => {
						e.preventDefault();
						const rawCardList = (e.target as HTMLFormElement).cardList.value;
						props.setCardList(parseMtgo(rawCardList));
						setRawCardListDialogOpen(false);
					}}
				>
					<label for="cardList" class="text-white">
						Paste your card list here
					</label>
					<textarea
						name="cardList"
						class="flex-1 w-full h-1/2 p-1 border rounded shadow-inner bg-stone-200"
						value={rawCardList()}
					/>
					<div class="w-full flex gap-2">
						<Button
							class="w-full !bg-stone-500"
							type="reset"
							onClick={(e) => setRawCardListDialogOpen(false)}
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

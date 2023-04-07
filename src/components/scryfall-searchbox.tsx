import { debounce } from "@solid-primitives/scheduled";
import { createResource, createSignal } from "solid-js";
import { searchCard } from "../services/scryfall";
import Button from "./button";

type ScryfallSearchBoxProps = {
	onAddCard: (card: string) => void;
};

export default function ScryfallSearchBox(props: ScryfallSearchBoxProps) {
	const [search, setSearch] = createSignal("");
	const setDebouncedSearch = debounce((value: string) => setSearch(value), 500);
	const [results] = createResource(search, searchCard);
	return (
		<>
			<div class="flex gap-2">
				<input
					class="bg-stone-200 rounded flex-1 pl-2"
					type="search"
					list="results"
					value={search()}
					onInput={(e) => setDebouncedSearch(e.currentTarget.value)}
				/>
				<Button
					type="button"
					onClick={() => {
						props.onAddCard(search());
						setSearch("");
					}}
				>
					Add Card
				</Button>
			</div>
			<datalist id="results">
				{results()?.map((result) => (
					<option value={result.name} />
				))}
			</datalist>
		</>
	);
}

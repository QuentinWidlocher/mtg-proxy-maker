import { debounce } from "@solid-primitives/scheduled";
import { createResource, createSignal } from "solid-js";
import { match } from "ts-pattern";
import { searchCard } from "../services/scryfall";

type ScryfallSearchBoxProps = {
	onAddCard: (card: string) => void;
};

export default function ScryfallSearchBox(props: ScryfallSearchBoxProps) {
	const [search, setSearch] = createSignal("");
	const setDebouncedSearch = debounce(
		(value: string) => setSearch(value.trim()),
		500
	);
	const [results] = createResource(search, searchCard);
	return (
		<div class="flex flex-col gap-2">
			<input
				class="bg-stone-200 rounded flex-1 pl-2 py-2 text-stone-600"
				type="search"
				placeholder="Search a card"
				value={search()}
				onInput={(e) => setDebouncedSearch(e.currentTarget.value)}
			/>
			<select
				class="bg-stone-200 rounded flex-1 pl-2 py-2"
				onChange={(e) => {
					props.onAddCard(e.currentTarget.value);
				}}
			>
				{match(results.state)
					.with("ready", () => (
						<>
							<option
								selected
								disabled
								label={`${results()!.length} result${
									results()!.length > 1 ? "s" : ""
								}`}
							/>
							{results()!.map((result) => (
								<option
									value={result.name}
									label={`${result.name} (${result.type_line})`}
								/>
							))}
						</>
					))
					.with("pending", "refreshing", () => (
						<option selected disabled label="Searching..." />
					))
					.with("errored", () => (
						<option selected disabled label={results.error} />
					))
					.otherwise(() => (
						<option selected disabled label="No result" />
					))}
			</select>
		</div>
	);
}

import { createEffect, createResource, createSignal } from "solid-js";
import { match } from "ts-pattern";
import { searchCard } from "../services/scryfall";

type ScryfallSearchBoxProps = {
	onAddCard: (card: string) => void;
};

export default function ScryfallSearchBox(props: ScryfallSearchBoxProps) {
	const [search, setSearch] = createSignal<string | null>(null);
	const [results] = createResource(search, searchCard);
	let selectRef!: HTMLSelectElement;

	createEffect(() => {
		if (results.state == "ready" && results()?.length > 0) {
			selectRef.focus();
		}
	});

	return (
		<div class="flex flex-col gap-2">
			<form
				class="flex gap-1"
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const search = formData.get("search");
					if (typeof search == "string") {
						setSearch(search);
						e.currentTarget.reset();
					}
				}}
			>
				<input
					class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
					type="search"
					placeholder="Search a card..."
					name="search"
					autocomplete="mtg"
				/>
				<button class="p-2 rounded bg-stone-200" type="submit">
					🔎
				</button>
			</form>
			<select
				ref={selectRef}
				class="bg-stone-200 rounded flex-1 pl-2 py-2"
				onChange={(e) => {
					props.onAddCard(e.currentTarget.value);
				}}
			>
				{match(results.state)
					.when(
						(state) => state == "ready" && results(),
						() => (
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
						)
					)
					.with("pending", "refreshing", () => (
						<option selected disabled label="Searching..." />
					))
					.with("errored", () => (
						<option selected disabled label={results.error} />
					))
					.otherwise(() => (
						<option selected disabled label="...and select it" />
					))}
			</select>
		</div>
	);
}

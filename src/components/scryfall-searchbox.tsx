import { createResource, createSignal } from "solid-js";
import { match } from "ts-pattern";
import { searchCard } from "../services/scryfall";
import { ListCard } from "../types/list-card";

type ScryfallSearchBoxProps = {
  onAddCard: (card: Pick<ListCard, "name" | "type">) => void;
};

export default function ScryfallSearchBox(props: ScryfallSearchBoxProps) {
  const [search, setSearch] = createSignal<string | null>(null);
  const [results] = createResource(search, searchCard);

  return (
    <div class="flex flex-col gap-2">
      <form
        class="join"
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
          class="input flex-1 join-item"
          type="search"
          placeholder="Search a card..."
          name="search"
          autocomplete="mtg"
        />
        <button class="btn btn-secondary join-item" type="submit">
          🔎
        </button>
      </form>
      <select
        class="select"
        onChange={(e) => {
          const [name, type] = e.currentTarget.value.split("|");
          props.onAddCard({
            name,
            type,
          });
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
                  label={`${results()!.length} result${results()!.length > 1 ? "s" : ""
                    }`}
                />
                {results()!.map((result) => (
                  <option
                    value={`${result.name}|${result.type_line}`}
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

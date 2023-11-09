import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import Button from "./components/button";
import CardComponent from "./components/card/card";
import EditCardForm from "./components/edit-card-form";
import InfoTab from "./components/info-tab";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";
import { fetchCard, fetchCardType } from "./services/scryfall";
import { Card, getEmptyCard } from "./types/card";

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

  const [language, setLanguage] = createSignal(rawLanguage);

  const [cardList, setCardList] = createResourceStore<Card[]>(
    [],
    () => getCardList(),
  );

  const [selectedCardIndex, setSelectedCardIndex] = createSignal<number | null>(null);

  const selectedCard = () => selectedCardIndex() !== null ? cardList().value[selectedCardIndex()!] : null;

  const setSelectedCard = (fn: (prev: Card) => Card) => {
    if (selectedCardIndex() == null || selectedCard() == null) return;
    setCardList(selectedCardIndex()!, fn(selectedCard()!));
  }

  async function fetchAndAddCard(name: string) {
    const fetchedCard = await fetchCard(
      name,
      language(),
    );

    setCardList((prev) => [...prev, fetchedCard]);
  }

  async function getNewListFromMTGO(mtgoList: string) {
    const parsedList = parseMtgo(mtgoList);

    return Promise.all(
      parsedList.flatMap(({ name, number }) =>
        [...new Array(number)].map(async (_, i) => {
          return fetchCard(
            name,
            language(),
            // todo implement variant only for basic lands
            i
          );
        })
      ));
  }

  async function getCardList(): Promise<Card[]> {
    const urlCardList = url.searchParams.get("cardList");

    if (urlCardList) {
      window.history.replaceState(null, "", '/');
      return getNewListFromMTGO(decodeURI(urlCardList))
    } else {
      // fetch all cards from localStorage
      const rawCardList = (localStorage.getItem("cardList") ?? "[]");
      return JSON.parse(rawCardList) as Card[];
    }
  }

  createEffect(function syncWithLocalStorage() {
    if (cardList().state == "ready") {
      localStorage.setItem("cardList", JSON.stringify(cardList().value));
    }
    localStorage.setItem("language", language());
  });

  createEffect(function updateCardsLang() {
    const lang = language();
    setCardList((prev) => prev.map((c) => ({ ...c, language: lang })));
  });

  return (
    <main class="md:grid md:grid-rows-none md:grid-cols-[1fr_60rem_1fr] md:h-screen font-serif print:!block print:overflow-visible">
      <Sidebar
        onClearList={() => setCardList([])}
        language={language()}
        setLanguage={setLanguage}
        onAddCard={fetchAndAddCard}
        onRawListImport={async (rawList) => {
          const newList = await getNewListFromMTGO(rawList);
          setCardList(newList);
        }}
      />
      <div class="relative p-5 h-full overflow-y-auto bg-stone-700 print:bg-white print:overflow-visible pages">
        <div class="card-grid print:m-auto">
          <For each={cardList().value}>
            {(card, j) => (
              <div>
                {[0, 1, 2].includes(j() % 9) && <div class="print:mt-10" />}
                <CardComponent
                  card={card}
                  onClick={() => { setSelectedCardIndex(j()); }}
                  selected={j() == selectedCardIndex()}
                />
                {[6, 7, 8].includes(j() % 9) && <div class="print:mb-10" />}
                {j() % 9 == 8 && <div class="break-after-page" />}
              </div>
            )}
          </For>

          <Button class="grid place-content-center shadow-xl print:hidden rounded-xl hover:!bg-stone-800"
            onClick={() => {
              const nextIndex = cardList().value.length;
              console.log(nextIndex);
              setCardList((prev) => [...prev, getEmptyCard()]);
              setSelectedCardIndex(nextIndex);
            }}
            style={{
              position: "relative",
              height: "auto",
              width: "var(--card-width)",
              "min-width": "var(--card-width)",
              "max-width": "var(--card-width)",
              "aspect-ratio": "63/88",
              margin: "auto",
              "box-sizing": "content-box",
            }}
          >Create a custom card</Button>
        </div>
      </div>
      <Show when={selectedCard()}>
        {(card) => <aside class="h-full overflow-y-hidden print:hidden">
          <EditCardForm card={card} setCard={setSelectedCard} onRemoveCard={() => {
            setCardList(cardList().value.filter((_, i) => i != selectedCardIndex()));
            setSelectedCardIndex(null);

          }} />
        </aside>
        }
      </Show>
    </main >
  );
}

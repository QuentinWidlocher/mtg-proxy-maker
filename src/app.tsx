import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import CardComponent from "./components/card/card";
import FetchCard from "./components/card/fetch-card";
import InfoTab from "./components/info-tab";
import Sidebar from "./components/sidebar";
import { parseMtgo } from "./services/mtgo-parser";
import { fetchCard, fetchCardType } from "./services/scryfall";
import { Card } from "./types/card";
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

  const [language, setLanguage] = createSignal(rawLanguage);

  const [cardList, setCardList] = createResourceStore<Card[]>(
    [],
    () => getCardList(),
  );

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
    <main class="md:grid md:grid-rows-none md:grid-cols-[1fr_3fr] md:h-screen font-serif print:!block print:overflow-visible">
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
      <div class="relative h-full overflow-y-auto bg-stone-700 print:bg-white print:overflow-visible pages">
        <div class="card-grid print:m-auto">
          <For each={cardList().value}>
            {(card, j) => (
              <div>
                {[0, 1, 2].includes(j() % 9) && <div class="print:mt-10" />}
                <CardComponent
                  card={card}
                />
                {[6, 7, 8].includes(j() % 9) && <div class="print:mb-10" />}
                {j() % 9 == 8 && <div class="break-after-page" />}
              </div>
            )}
          </For>
        </div>
        <details class="min-h-[3rem] transition-all shadow-xl rounded-tr-lg fixed bottom-0 z-20 w-auto bg-stone-700 print:hidden">
          <summary class="text-white p-5 cursor-pointer">Informations</summary>
          <InfoTab />
        </details>
      </div>
    </main>
  );
}

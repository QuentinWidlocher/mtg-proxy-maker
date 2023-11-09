import { For, Setter, createSignal } from "solid-js";
import Button from "./button";
import InfoTab from "./info-tab";
import ScryfallSearchBox from "./scryfall-searchbox";

type SidebarProps = {
  language: string;
  setLanguage: Setter<string>;
  onAddCard: (cardName: string) => void;
  onClearList: () => void;
  onRawListImport: (rawCardList: string) => void;
};

export default function Sidebar(props: SidebarProps) {
  const [rawCardListDialogOpen, setRawCardListDialogOpen] = createSignal(false);

  return (
    <>
      <aside class="h-full shadow-xl overflow-y-hidden print:hidden w-full bg-stone-500">
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
          <ScryfallSearchBox
            onAddCard={({ name }) => props.onAddCard(name)}
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
            onClick={() => props.onClearList()}
          >
            Clear list
          </Button>
          <Button
            type="button"
            class="w-full text-amber-50 !bg-amber-500 hover:!bg-amber-600 disabled:!bg-amber-400 disabled:!cursor-not-allowed disabled:!text-amber-100"
            onClick={() => {
              print();
            }}
          >
            Print all cards
          </Button>
          <InfoTab />
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
            props.onRawListImport(rawCardList);
            setRawCardListDialogOpen(false);
          }}
        >
          <label for="cardList" class="text-white">
            Paste your card list here
          </label>
          <textarea
            name="cardList"
            class="flex-1 w-full h-1/2 p-1 border rounded shadow-inner bg-stone-200"
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

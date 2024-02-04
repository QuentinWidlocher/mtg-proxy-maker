import { Setter, createSignal } from "solid-js";
import InfoTab from "./info-tab";
import ScryfallSearchBox from "./scryfall-searchbox";

type SidebarProps = {
  language: string;
  setLanguage: Setter<string>;
  printVersos: boolean;
  setPrintVersos: Setter<boolean>;
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
          <label class="form-control">
            <div class="label-text text-white">
              Card language
            </div>
            <select
              name="language"
              value={props.language}
              onChange={(e) => {
                props.setLanguage(e.target.value);
              }}
              class="select"
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
          </label>
          <ScryfallSearchBox
            onAddCard={({ name }) => props.onAddCard(name)}
          />
          <button
            type="button"
            class="btn btn-secondary w-full"
            onClick={() => setRawCardListDialogOpen(true)}
          >
            Import from MTGO
          </button>
          <button
            type="button"
            class="btn btn-secondary w-full"
            onClick={() => props.onClearList()}
          >
            Clear list
          </button>
          <button
            type="button"
            class="btn btn-primary w-full"
            onClick={() => {
              print();
            }}
          >
            Print all cards
          </button>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text ml-auto mr-5 text-white">Print card backs</span>
              <input
                name="print-versos"
                type="checkbox"
                class="toggle toggle-primary"
                onChange={(e) => props.setPrintVersos(e.currentTarget.checked)}
                checked={props.printVersos}
              />

            </label>
          </div>

          <InfoTab />
        </div>

      </aside>

      <dialog
        class="z-20 h-1/2 w-96 bg-stone-600 shadow-xl mt-52 rounded-lg backdrop:bg-black/50"
        open={rawCardListDialogOpen()}
      >
        <form
          method="dialog"
          class="flex flex-col h-full gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const rawCardList = (e.target as HTMLFormElement).cardList.value;
            props.onRawListImport(rawCardList);
            setRawCardListDialogOpen(false);
          }}
        >
          <label for="cardList" class="label-text text-white">
            Paste your card list here
          </label>
          <textarea
            name="cardList"
            class="textarea h-full"
          />
          <div class="w-full flex gap-2">
            <button
              class="btn btn-secondary flex-1"
              type="reset"
              onClick={() => setRawCardListDialogOpen(false)}
            >
              Cancel
            </button>
            <button class="btn btn-primary flex-1">Submit</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

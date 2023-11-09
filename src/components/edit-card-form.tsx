import { Accessor, createEffect, createSignal, For, Setter, Show } from "solid-js";
import CardComponent from "./card/card";
import { parseMana, serializeMana } from "../services/scryfall";
import { cardFrames, cardColors } from "../types/backgrounds";
import { Card } from "../types/card";
import Button from "./button";

export default function EditCardForm(props: {
  card: Accessor<Card>,
  setCard: (fn: (prev: Card) => Card) => void,
  onRemoveCard: () => void
}) {
  const [rawManaCost, setRawManaCost] = createSignal(serializeMana(props.card().manaCost));

  function setManaCost(manaCost: string) {
    setRawManaCost(manaCost);
    props.setCard(c => ({ ...c, manaCost: parseMana(manaCost) }))
  }

  createEffect(() => {
    console.log(props.card())
  })

  return <main class="bg-stone-500 grid grid-rows-[auto_1fr] h-full">
    <section class="grid place-content-center p-5">
      <Button class="mb-3" onClick={() => props.onRemoveCard()}>Remove this card</Button>
      <CardComponent card={props.card()} />
    </section>
    <section class="p-5 overflow-y-auto">
      <form class="flex flex-col gap-10">
        <fieldset class="flex flex-col gap-5 border-white border p-5">
          <legend class="text-white">Aspect</legend>
          <div class="flex flex-col gap-1">
            <label for="frame" class="text-white">Frame</label>
            <select
              name="frame"
              value={props.card().aspect.frame}
              onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, frame: e.currentTarget.value as any } }))}
              class="w-full p-2 border rounded shadow-inner bg-stone-200"
            >
              {cardFrames.map(color => <option value={color}>{color}</option>)}
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label for="legendary" class="text-white">
              <input
                name="legendary"
                type="checkbox"
                class="flex-1 mr-3"
                onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, legendary: e.currentTarget.checked as any } }))}
              />

              Legendary
            </label>
          </div>
          <div class="flex flex-col gap-1">
            <label for="color" class="text-white">Color</label>
            <select
              name="color"
              value={props.card().aspect.color}
              onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, color: e.currentTarget.value as any } }))}
              class="w-full p-2 border rounded shadow-inner bg-stone-200"
            >
              {cardColors.map(frame => <option value={frame}>{frame}</option>)}
            </select>
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-5 border-white border p-5">
          <legend class="text-white">General Data</legend>

          <div class="flex flex-col gap-1">
            <label for="title" class="text-white">Title</label>
            <input
              name="title"
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => props.setCard(p => ({ ...p, title: e.currentTarget.value }))} value={props.card().title}
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="mana" class="text-white">Mana cost</label>
            <input
              name="mana"
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => setManaCost(e.currentTarget.value)} value={rawManaCost()}
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="picture" class="text-white">Picture URL</label>
            <input
              name="picture"
              value={props.card().artUrl}
              onInput={(e) => props.setCard(p => ({ ...p, artUrl: e.currentTarget.value }))}
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
            />
            <input
              name="picture"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.currentTarget.files?.item(0)
                if (!file) return
                const reader = new FileReader()
                reader.addEventListener('load', (e) => {
                  const url = e.target?.result
                  if (typeof url != 'string') return
                  props.setCard(p => ({ ...p, artUrl: url }))
                });
                reader.readAsDataURL(file)
              }}
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="type" class="text-white">Type</label>
            <input
              name="type"
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => props.setCard(p => ({ ...p, typeText: e.currentTarget.value }))} value={props.card().typeText ?? ""}
            />
          </div>

          {/* <div class="flex flex-col gap-1"> */}
          {/*   <fieldset> */}
          {/*     <label class="text-white"> */}
          {/*       <input type="radio" name="category" value="Regular" onInput={(e) => setCard(p => ({ ...p, category: e.currentTarget.value as any }))} /> Regular */}
          {/*     </label> */}
          {/*     <label class="text-white"> */}
          {/*       <input type="radio" name="category" value="Planeswalker" onInput={(e) => setCard(p => ({ ...p, category: e.currentTarget.value as any }))} />Planeswalker */}
          {/*     </label> */}
          {/*   </fieldset> */}
          {/* </div> */}


          <div class="flex flex-col gap-1">
            <label for="oracle" class="text-white">Oracle</label>
            <textarea
              name="oracle"
              rows={3}
              class="bg-stone-200 resize-y min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => props.setCard(p => ({ ...p, oracleText: e.currentTarget.value }))} value={props.card().oracleText ?? ""}
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="flavor" class="text-white">Flavor</label>
            <textarea
              name="flavor"
              rows={3}
              class="bg-stone-200 resize-y min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => props.setCard(p => ({ ...p, flavorText: e.currentTarget.value }))} value={props.card().flavorText ?? ""}
            />
          </div>

          <div class="flex gap-5">
            <div class="flex flex-col gap-1">
              <label for="type" class="text-white">Power</label>
              <input
                name="type"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, power: e.currentTarget.value }))} value={props.card().power ?? ""}
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="type" class="text-white">Toughness</label>
              <input
                name="type"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, toughness: e.currentTarget.value }))} value={props.card().toughness ?? ""}
              />
            </div>
          </div>


        </fieldset>
      </form>
    </section>
  </main>
}

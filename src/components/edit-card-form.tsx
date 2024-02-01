import { Accessor, createEffect, createSignal, For, Setter, Show } from "solid-js";
import CardComponent from "./card/card";
import { parseMana, serializeMana } from "../services/scryfall";
import { cardFrames, cardColors } from "../types/backgrounds";
import { Card } from "../types/card";
import Button from "./button";
import CardVerso from "./card/card-verso";
import { defaultVerso, setDefaultVerso } from "../app";

function ManaInput(props: {
  value: Card['manaCost'],
  setValue: (value: Card['manaCost']) => void
}) {
  const [rawManaCost, setRawManaCost] = createSignal("");

  createEffect(function syncMana() {
    const serialized = serializeMana(props.value)
    setRawManaCost(serialized)
  })

  createEffect(function syncMana() {
    const parsed = parseMana(rawManaCost())
    if (props.value.join('') != parsed.join('')) {
      props.setValue(parsed)
    }
  })

  return <input
    name="mana"
    class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
    onInput={(e) => setRawManaCost(e.currentTarget.value)} value={rawManaCost()}
  />
}

export default function EditCardForm(props: {
  card: Accessor<Card>,
  setCard: (fn: (prev: Card) => Card) => void,
  onRemoveCard: () => void
  onDuplicateCard: () => void
  onSetCardDefaultVerso: (verso: string) => void
}) {

  return <main class="bg-stone-500 grid grid-rows-[auto_1fr] h-full">
    <section class="relative grid place-content-center p-5 border-stone-600 border-b-4 @container">
      <div class="flex mb-3 mx-auto gap-5">
        <Button onClick={() => props.onRemoveCard()}>Remove this card</Button>
        <Button onClick={() => props.onDuplicateCard()}>Duplicate this card</Button>
      </div>
      <div class="flex overflow-x-hidden gap-3">
        <CardComponent card={props.card()} />
        <Show when={props.card().verso}>
          <div class="absolute @sm:relative mx-auto @sm:mx-none left-0 w-full @sm:w-auto z-10 transition-opacity opacity-0 @sm:opacity-100 hover:opacity-100">
            <CardVerso verso={props.card().verso} />
          </div>
        </Show>
      </div>
    </section>
    <section class="@container p-2 @xl:p-5 overflow-y-auto overflow-x-hidden">
      <form class="flex flex-col gap-5">

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
                checked={props.card().aspect.legendary}
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
            <ManaInput value={props.card().manaCost} setValue={(m) => props.setCard(p => ({ ...p, manaCost: m }))} />
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

          <div class="flex flex-wrap gap-5">
            <div class="flex flex-col gap-1 flex-1">
              <label for="type" class="text-white">Power</label>
              <input
                name="type"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, power: e.currentTarget.value }))} value={props.card().power ?? ""}
              />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="type" class="text-white">Toughness</label>
              <input
                name="type"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, toughness: e.currentTarget.value }))} value={props.card().toughness ?? ""}
              />
            </div>
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-5 border-white border p-5">
          <legend class="text-white">Print data</legend>

          <div class="flex flex-wrap gap-5">
            <div class="flex flex-col gap-1 flex-1">
              <label for="collector-number" class="text-white">Collector Number</label>
              <input
                name="collector-number"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, collectorNumber: e.currentTarget.value }))} value={props.card().collectorNumber ?? ""}
              />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="rarity" class="text-white">Rarity</label>
              <input
                name="rarity"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, rarity: e.currentTarget.value }))} value={props.card().rarity ?? ""}
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-5">
            <div class="flex flex-col gap-1 flex-1">
              <label for="set" class="text-white">Set</label>
              <input
                name="set"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, set: e.currentTarget.value }))} value={props.card().set ?? ""}
              />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="lang" class="text-white">Language</label>
              <input
                name="lang"
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
                onInput={(e) => props.setCard(p => ({ ...p, lang: e.currentTarget.value }))} value={props.card().lang ?? ""}
              />
            </div>

          </div>

          <div class="flex flex-col gap-1 flex-1">
            <label for="artist" class="text-white">Artist name</label>
            <input
              name="artist"
              class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              onInput={(e) => props.setCard(p => ({ ...p, artist: e.currentTarget.value }))} value={props.card().artist ?? ""}
            />
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-5 border-white border p-5">
          <legend class="text-white">Back of card</legend>

          <Show when={!props.card().verso || typeof props.card().verso == 'string'}>
            <div class="flex flex-col gap-1">
              <label for="picture" class="text-white">Picture URL</label>
              <input
                name="picture"
                value={(props.card().verso ?? "") as string}
                onInput={(e) => props.setCard(p => ({ ...p, verso: e.currentTarget.value }))}
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

                    props.setCard(p => ({ ...p, verso: url }))
                  });
                  reader.readAsDataURL(file)
                }}
                class="bg-stone-200 min-w-0 rounded flex-1 pl-2 py-2 text-stone-600"
              />
              <Button
                type="button"
                disabled={defaultVerso() == props.card().verso || props.card().verso == 'default'}
                onClick={() => {
                  const url = props.card().verso;
                  props.setCard(p => ({ ...p, verso: 'default' }))
                  setDefaultVerso(url as string)
                }}>
                Make this back the default one
              </Button>
            </div>
          </Show>
        </fieldset>
      </form>
    </section>
  </main>
}

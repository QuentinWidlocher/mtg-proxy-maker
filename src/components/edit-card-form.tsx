import { Accessor, createEffect, createSignal, For, Setter, Show } from "solid-js";
import CardComponent from "./card/card";
import { parseMana, serializeMana } from "../services/scryfall";
import { cardFrames, cardColors } from "../types/backgrounds";
import { Card } from "../types/card";
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
    class="input"
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
      <div class="flex mb-3 mx-auto gap-3">
        <button class="btn btn-secondary flex-1" onClick={() => props.onRemoveCard()}>Remove this card</button>
        <button class="btn btn-secondary flex-1" onClick={() => props.onDuplicateCard()}>Duplicate this card</button>
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
      <form class="flex flex-col gap-10">

        <fieldset class="flex flex-col gap-5 p-3">
          <legend class="text-white divider w-full">Aspect</legend>

          <label class="form-control">
            <span class="label-text text-white">Frame</span>
            <select
              name="frame"
              value={props.card().aspect.frame}
              onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, frame: e.currentTarget.value as any } }))}
              class="select"
            >
              {cardFrames.map(color => <option value={color}>{color}</option>)}
            </select>
          </label>

          <div class="form-control">
            <label class="label cursor-pointer">
              <input
                name="legendary"
                type="checkbox"
                class="checkbox checkbox-primary"
                checked={props.card().aspect.legendary}
                onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, legendary: e.currentTarget.checked as any } }))}
              />
              <span class="mr-auto ml-5 text-white">Legendary</span>
            </label>
          </div>
          <label class="form-control">
            <span class="label-text text-white">Color</span>
            <select
              name="color"
              value={props.card().aspect.color}
              onChange={(e) => props.setCard(p => ({ ...p, aspect: { ...p.aspect, color: e.currentTarget.value as any } }))}
              class="select"
            >
              {cardColors.map(frame => <option value={frame}>{frame}</option>)}
            </select>
          </label>
        </fieldset>

        <fieldset class="flex flex-col gap-5 p-3">
          <legend class="text-white divider w-full">General Data</legend>

          <label class="flex flex-col gap-1">
            <span class="label-text text-white">Title</span>
            <input
              name="title"
              class="input"
              onInput={(e) => props.setCard(p => ({ ...p, title: e.currentTarget.value }))} value={props.card().title}
            />
          </label>

          <label class="form-control">
            <span class="label-text text-white">Mana cost</span>
            <ManaInput value={props.card().manaCost} setValue={(m) => props.setCard(p => ({ ...p, manaCost: m }))} />
          </label>

          <label class="form-control gap-2">
            <span class="label-text text-white">Picture URL</span>
            <input
              name="picture"
              value={props.card().artUrl}
              onInput={(e) => props.setCard(p => ({ ...p, artUrl: e.currentTarget.value }))}
              class="input"
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
              class="file-input w-full min-w-0"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-white">Type</span>
            <input
              name="type"
              class="input"
              onInput={(e) => props.setCard(p => ({ ...p, typeText: e.currentTarget.value }))} value={props.card().typeText ?? ""}
            />
          </label>

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


          <label class="form-control">
            <span class="label-text text-white">Oracle</span>
            <textarea
              name="oracle"
              rows={3}
              class="textarea"
              onInput={(e) => props.setCard(p => ({ ...p, oracleText: e.currentTarget.value }))} value={props.card().oracleText ?? ""}
            />
          </label>

          <label class="form-control">
            <span class="label-text text-white">Flavor</span>
            <textarea
              name="flavor"
              rows={3}
              class="textarea"
              onInput={(e) => props.setCard(p => ({ ...p, flavorText: e.currentTarget.value }))} value={props.card().flavorText ?? ""}
            />
          </label>

          <div class="flex flex-wrap gap-5">
            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Power</span>
              <input
                name="type"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, power: e.currentTarget.value }))} value={props.card().power ?? ""}
              />
            </label>

            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Toughness</span>
              <input
                name="type"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, toughness: e.currentTarget.value }))} value={props.card().toughness ?? ""}
              />
            </label>
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-5 p-3">
          <legend class="text-white divider w-full">Print data</legend>

          <div class="flex flex-wrap gap-5">
            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Collector Number</span>
              <input
                name="collector-number"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, collectorNumber: e.currentTarget.value }))} value={props.card().collectorNumber ?? ""}
              />
            </label>

            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Rarity</span>
              <input
                name="rarity"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, rarity: e.currentTarget.value }))} value={props.card().rarity ?? ""}
              />
            </label>
          </div>

          <div class="flex flex-wrap gap-5">
            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Set</span>
              <input
                name="set"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, set: e.currentTarget.value }))} value={props.card().set ?? ""}
              />
            </label>

            <label class="form-control flex-1 min-w-0">
              <span class="label-text text-white">Language</span>
              <input
                name="lang"
                class="input"
                onInput={(e) => props.setCard(p => ({ ...p, lang: e.currentTarget.value }))} value={props.card().lang ?? ""}
              />
            </label>
          </div>

          <label class="form-control flex-1 min-w-0">
            <span class="label-text text-white">Artist name</span>
            <input
              name="artist"
              class="input"
              onInput={(e) => props.setCard(p => ({ ...p, artist: e.currentTarget.value }))} value={props.card().artist ?? ""}
            />
          </label>
        </fieldset>

        <fieldset class="flex flex-col gap-5 p-3">
          <legend class="text-white divider w-full">Back of card</legend>

          <Show when={!props.card().verso || typeof props.card().verso == 'string'}>
            <label class="form-control gap-3">
              <span class="label-text text-white">Picture URL</span>
              <input
                name="picture"
                value={(props.card().verso ?? "") as string}
                onInput={(e) => props.setCard(p => ({ ...p, verso: e.currentTarget.value }))}
                class="input"
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
                class="file-input w-full min-w-0"
              />
              <button
                type="button"
                class="btn btn-secondary w-full"
                disabled={defaultVerso() == props.card().verso || props.card().verso == 'default'}
                onClick={() => {
                  const url = props.card().verso;
                  props.setCard(p => ({ ...p, verso: 'default' }))
                  setDefaultVerso(url as string)
                }}>
                Make this back the default one
              </button>
            </label>
          </Show>
        </fieldset>
      </form>
    </section>
  </main>
}

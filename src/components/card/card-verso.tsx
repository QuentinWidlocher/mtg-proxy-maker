import { Match, Switch } from "solid-js";
import { defaultVerso } from "../../app";
import { Card } from "../../types/card";
import CardComponent from "./card";

export default function CardVerso(
  props: { verso: Card['verso'] }
) {

  return (
    <Switch fallback={
      <div
        style={{
          position: "relative",
          height: "auto",
          display: 'flex',
          width: "var(--card-width)",
          "min-width": "var(--card-width)",
          "max-width": "var(--card-width)",
          "aspect-ratio": "63/88",
          border: "var(--card-bleed) solid transparent",
          margin: "auto",
          "box-sizing": "content-box",
        }}
      />
    }>
      <Match when={props.verso && props.verso == 'default'}>
        <CardVerso verso={defaultVerso()} />
      </Match>

      <Match when={props.verso && typeof props.verso == 'string'}>
        <img class="rounded-xl hidden print:flex print:rounded-none card group outline-amber-500 print:outline-none"
          style={{
            position: "relative",
            "background-color": "var(--card-bgc, #161410)",
            height: "auto",
            display: 'flex',
            width: "var(--card-width)",
            "min-width": "var(--card-width)",
            "max-width": "var(--card-width)",
            "aspect-ratio": "63/88",
            border: "var(--card-bleed) solid var(--card-bgc)",
            margin: "auto",
            "box-sizing": "content-box",
          }}
          src={props.verso as string} alt="" />
      </Match>

      <Match when={props.verso && typeof props.verso == 'object'}>
        <CardComponent card={props.verso as Card} />
      </Match>
    </Switch>
  )
}

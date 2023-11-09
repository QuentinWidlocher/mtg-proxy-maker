import { createEffect, Show, splitProps } from "solid-js";
import { getFrameAndBackgroundFromAspect } from "../../types/backgrounds";
import { Card } from "../../types/card";
import Art from "./art";
import Metadata from "./metadata";
import PlaneswalkerDescription from "./planeswalker-description";
import PlaneswalkerLoyalty from "./planeswalker-loyalty";
import RegularDescription from "./regular-description";
import Strength from "./strength";
import TitleBar from "./title-bar";
import TypeBar from "./type-bar";

export default function CardComponent(
  props: { card: Card, onClick?: () => void, selected?: boolean }
) {
  const frameAndBackground = () => getFrameAndBackgroundFromAspect(props.card.aspect);

  return (
    <div
      tabIndex={0}
      onClick={props.onClick}
      class="rounded-xl print:rounded-none card group outline-amber-500 print:outline-none"
      style={{
        position: "relative",
        display: "flex",
        "font-family": "MPlantin",
        "font-size": "12pt",
        "background-color": "var(--card-bgc, #161410)",
        height: "auto",
        width: "var(--card-width)",
        "min-width": "var(--card-width)",
        "max-width": "var(--card-width)",
        "aspect-ratio": "63/88",
        border: "var(--card-bleed) solid var(--card-bgc)",
        "outline-style": props.selected ? "solid" : "none",
        "outline-width": props.selected ? "2px" : "0px",
        margin: "auto",
        "box-sizing": "content-box",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        src={frameAndBackground().background}
      />
      {/* Black mask for the bottom of the card */}
      <div
        style={{
          bottom: "5.5mm",
          height: "2mm",
          left: "0",
          right: "0",
          position: "absolute",
          background: 'var(--card-bgc, "black")',
        }}
      />
      {props.card.artUrl && <Art url={props.card.artUrl} category={props.card.category} />}
      <img
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          "z-index": props.card.category == "Planeswalker" ? 1 : 0,
        }}
        src={frameAndBackground().frame}
      />
      <TitleBar
        title={props.card.title}
        manaCost={props.card.manaCost}
        category={props.card.category}
      />
      <TypeBar type={props.card.typeText} category={props.card.category} />
      {props.card.category == "Regular" ? (
        props.card.aspect.frame != "Basic Land" && (
          <RegularDescription
            flavor={props.card.flavorText}
            oracle={props.card.oracleText}
          />
        )
      ) : (
        <PlaneswalkerDescription oracle={props.card.oracleText} />
      )}
      {props.card.category == "Regular" ? (
        <Show when={!!props.card.power || !!props.card.toughness}>
          <Strength
            power={props.card.power}
            toughness={props.card.toughness}
            textColor={props.card.aspect.frame == "Vehicle" ? "white" : "black"}
          />
        </Show>
      ) : (
        <PlaneswalkerLoyalty value={props.card.loyalty} />
      )}
      <Metadata {...props.card} />
    </div>
  );
}

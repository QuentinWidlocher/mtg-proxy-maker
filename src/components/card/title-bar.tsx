import { createEffect, mergeProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Card } from "../../types/card";
import { ManaType, manaTypeToSvg, manaTypes, customManaTypes } from "../../types/mana";
import { symbols } from "../../types/symbols";

type TitleBarProps = {
  title: string;
  category: Card["category"];
  manaCost?: ManaType[];
};

const style: Record<Card["category"], JSX.CSSProperties> = {
  Planeswalker: {
    top: "3mm",
    height: "4.4mm",
    left: "4.5mm",
    right: "4.6mm",
  },
  Regular: {
    top: "4.5mm",
    height: "4.9mm",
    left: "4.7mm",
    right: "4.6mm",
  },
};

function Mana({ src, name }: { src: string, name: ManaType }) {
  return (
    <img
      style={{
        width: "3mm",
        height: "3mm",
        "margin-left": "0.3mm",
        "margin-bottom": "0.8mm",
        "border-radius": customManaTypes.includes(name) ? "0" : '100%',
        "box-shadow": customManaTypes.includes(name) ? "" : '-0.5px 1px 0px black',
      }}
      src={src}
    />
  );
}

const fontSizeByLength = {
  38: "7.3pt",
  35: "8.4pt",
  30: "8.7pt",
  28: "9.2pt",
  25: "9.5pt",
  0: "10pt",
} as const;

export default function TitleBar(p: TitleBarProps) {

  const props = mergeProps({ manaCost: [] }, p);

  const sortedMana = () => props.manaCost.sort(
    (a, b) =>
      manaTypes.findIndex((t) => t === a) - manaTypes.findIndex((t) => t === b)
  );

  const colorlessMana = () => sortedMana().filter((mana) => mana == "colorless");
  const coloredMana = () => sortedMana().filter((mana) => mana != "colorless");

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "space-around",
        position: "absolute",
        "font-family": "Beleren",
        "white-space": "nowrap",
        "z-index": 2,
        ...style[props.category],
      }}
    >
      <h1
        style={{
          margin: 0,
          "margin-top": "auto",
          "margin-bottom": "auto",
          "margin-left": "0.5mm",
          "font-size": Object.entries(fontSizeByLength)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .find(
              ([length, _]) =>
                props.title.length + coloredMana.length * 2 >= parseInt(length)
            )?.[1],
          flex: 1,
        }}
      >
        {props.title}
      </h1>
      {props.manaCost.length > 0 && (
        <div
          style={{
            display: "flex",
            "align-items": "center",
          }}
        >
          {colorlessMana().length > 0 && colorlessMana().length in symbols && (
            <Mana src={symbols[colorlessMana().length as keyof typeof symbols]} name='colorless' />
          )}
          {coloredMana().map((mana) => (
            <Mana src={manaTypeToSvg[mana]} name={mana} />
          ))}
        </div>
      )}
    </div>
  );
}

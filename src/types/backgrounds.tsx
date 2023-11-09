import { createEffect } from "solid-js";
import { Card } from "./card";
import { CardError } from "./error";
import {
  BiManaType,
  ManaType,
  UnaryManaType,
  isUnaryType,
  unaryToBiType,
} from "./mana";

export const cardFrames = [
  "Vehicle",
  "Basic Land",
  "Creature",
  "Nonbasic Land",
  "Noncreature",
  "Planeswalker",
] as const;

export type CardFrame = typeof cardFrames[number];

export const cardBackgrounds = [
  "BG",
  "Artifact",
  "Black",
  "Blue",
  "BR",
  "Green",
  "GU",
  "GW",
  "Red",
  "RG",
  "RW",
  "UB",
  "UR",
  "WB",
  "White",
  "WU",
  "Gold",
  "Land",
  "Vehicle",
] as const;

export type CardBackground = typeof cardBackgrounds[number];

export function parseCardFrame(engTypeText: string): CardFrame {
  const lowercaseType = engTypeText.toLowerCase();

  console.debug("lowercaseType", lowercaseType);

  if (lowercaseType.includes("creature")) {
    return "Creature";
  } else if (lowercaseType.includes("basic land")) {
    return "Basic Land";
  } else if (lowercaseType.includes("land")) {
    return "Nonbasic Land";
  } else if (lowercaseType.includes("vehicle")) {
    return "Vehicle";
  } else if (
    lowercaseType.includes("instant") ||
    lowercaseType.includes("sorcery") ||
    lowercaseType.includes("enchantment") ||
    lowercaseType.includes("artifact")
  ) {
    return "Noncreature";
  } else if (lowercaseType.includes("planeswalker")) {
    return "Planeswalker";
  } else {
    throw new CardError(
      `Unknown card type: ${engTypeText}`,
      (
        <>
          <span>Card type</span>
          <span class="text-xl italic text-white">{engTypeText}</span>
          <span>is not supported (yet)</span>
        </>
      )
    );
  }
}

export const cardColors = [
  "Black",
  "Blue",
  "Green",
  "Red",
  "White",
  "Colorless",
  "Artifact",
  "Gold-3+",
  "Gold-BG",
  "Gold-BR",
  "Gold-GU",
  "Gold-GW",
  "Gold-RG",
  "Gold-RW",
  "Gold-UB",
  "Gold-UR",
  "Gold-UW",
  "Gold-WB",
  "hybrid-BG",
  "hybrid-BR",
  "hybrid-GU",
  "hybrid-GW",
  "hybrid-RG",
  "hybrid-RW",
  "hybrid-UB",
  "hybrid-UR",
  "hybrid-UW",
  "hybrid-WB",
] as const;

export type CardColor = typeof cardColors[number];

export function parseCardColor(
  mana: ManaType[],
  artifact: boolean,
  bicolorManaOnly: boolean
): CardColor {
  if (artifact) {
    return "Artifact";
  }

  const coloredMana = mana.filter((type) => type != "colorless" && type != "x");

  switch (coloredMana.length) {
    case 0:
      return "Gold-3+";
    case 1:
      if (isUnaryType(coloredMana[0])) {
        return unaryManaToColor(coloredMana[0]);
      } else {
        return biManaToColor(coloredMana[0], false);
      }
    case 2:
      if (isUnaryType(coloredMana[0]) && isUnaryType(coloredMana[1])) {
        const result = Object.entries(unaryToBiType).find(([multi, array]) => {
          return array.every((type) => coloredMana.includes(type));
        });

        if (result) {
          return biManaToColor(result[0] as BiManaType, !bicolorManaOnly);
        } else {
          return "Gold-3+";
        }
      } else {
        return "Gold-3+";
      }
    default:
      return "Gold-3+";
  }
}

export function unaryManaToColor(mana: UnaryManaType): CardColor {
  switch (mana) {
    case "red":
      return "Red";
    case "green":
      return "Green";
    case "blue":
      return "Blue";
    case "black":
      return "Black";
    case "white":
      return "White";
    case "colorless":
      return "Colorless";
    default:
      throw new Error(`Unknown unary mana type: ${mana}`);
  }
}

export function biManaToColor(mana: BiManaType, gold: boolean): CardColor {
  switch (mana) {
    case "red-green":
      return gold ? "Gold-RG" : "hybrid-RG";
    case "red-blue":
      return gold ? "Gold-UR" : "hybrid-UR";
    case "red-black":
      return gold ? "Gold-BR" : "hybrid-BR";
    case "red-white":
      return gold ? "Gold-RW" : "hybrid-RW";
    case "green-blue":
      return gold ? "Gold-GU" : "hybrid-GU";
    case "green-black":
      return gold ? "Gold-BG" : "hybrid-BG";
    case "green-white":
      return gold ? "Gold-GW" : "hybrid-GW";
    case "blue-black":
      return gold ? "Gold-UB" : "hybrid-UB";
    case "blue-white":
      return gold ? "Gold-UW" : "hybrid-UW";
    case "black-white":
      return gold ? "Gold-WB" : "hybrid-WB";
    default:
      throw new Error(`Unknown unary mana type: ${mana}`);
  }
}

export function getBackgroundFromColor(
  color: CardColor,
  frame: CardFrame
): CardBackground {
  switch (frame) {
    case "Vehicle":
      return "Vehicle";
    case "Nonbasic Land":
    case "Basic Land":
      return "Land";
    case "Creature":
    case "Planeswalker":
    case "Noncreature": {
      switch (color) {
        case "Black":
          return "Black";
        case "Blue":
          return "Blue";
        case "Green":
          return "Green";
        case "Red":
          return "Red";
        case "White":
          return "White";
        case "Colorless":
        case "Artifact":
          return "Artifact";
        case "Gold-3+":
        case "Gold-GW":
        case "Gold-RG":
        case "Gold-BG":
        case "Gold-RW":
        case "Gold-BR":
        case "Gold-GU":
        case "Gold-UB":
        case "Gold-UR":
        case "Gold-UW":
        case "Gold-WB":
          return "Gold";
        case "hybrid-BG":
          return "BG";
        case "hybrid-BR":
          return "BR";
        case "hybrid-GU":
          return "GU";
        case "hybrid-GW":
          return "GW";
        case "hybrid-RG":
          return "RG";
        case "hybrid-RW":
          return "RW";
        case "hybrid-UB":
          return "UB";
        case "hybrid-UR":
          return "UR";
        case "hybrid-UW":
          return "WU";
        case "hybrid-WB":
          return "WB";
        default:
          return "Artifact";
      }
    }
  }
}

export function getFrameAndBackgroundFromAspect({
  color,
  frame,
  legendary,
}: Card["aspect"]) {
  const fileName = `Frame=${frame}, Color=${color}, Legendary=${legendary ? "Yes" : "No"
    }, Holo Stamp=Yes.svg`;

  const background = getBackgroundFromColor(color, frame);

  return {
    frame: `${import.meta.env.VITE_PUBLIC_DIR ?? ""
      }assets/images/card-frames/${fileName}`,
    background: `${import.meta.env.VITE_PUBLIC_DIR ?? ""
      }assets/images/card-backgrounds/${background}.png`,
  };
}

import { CardColor, CardFrame } from "./backgrounds";
import { ManaType } from "./mana";

export type Card = {
  artUrl: string;
  totalVariants: number;
  flavorText: string;
  manaCost: ManaType[];
  oracleText: string;
  power?: string;
  title: string;
  toughness?: string;
  typeText: string;
  aspect: {
    frame: CardFrame;
    color: CardColor;
    legendary: boolean;
  };
  collectorNumber?: string;
  set?: string;
  rarity?: string;
  artist?: string;
  lang?: string;
} & (
    | {
      category: "Regular";
    }
    | {
      category: "Planeswalker";
      loyalty: string;
    }
  );

export function getEmptyCard(): Card {
  return {
    artUrl: '',
    totalVariants: 0,
    flavorText: '',
    manaCost: [],
    oracleText: '',
    title: '',
    typeText: '',
    aspect: {
      frame: 'Noncreature',
      color: 'Artifact',
      legendary: false,
    },
    category: 'Regular',
  }
}

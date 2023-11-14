import { CardColor, CardFrame } from "./backgrounds";
import { ManaType } from "./mana";

export type Card = {
  artUrl: string;
  artist?: string;
  aspect: { frame: CardFrame; color: CardColor; legendary: boolean; };
  collectorNumber?: string;
  flavorText: string;
  lang?: string;
  manaCost: ManaType[];
  oracleText: string;
  power?: string;
  rarity?: string;
  set?: string;
  title: string;
  totalVariants: number;
  toughness?: string;
  typeText: string;
  verso?: 'default' | string | Card;
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

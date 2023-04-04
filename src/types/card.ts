import { CardBackground } from "./backgrounds";
import { ManaType } from "./mana";

export type CardType =
	| "creature"
	| "land"
	| "spell"
	| "artifact"
	| "enchantment"
	| "planeswalker"
	| "instant"
	| "sorcery";

export type Card = {
	artUrl: string;
	flavorText: string;
	manaCost: ManaType[];
	oracleText: string;
	power?: string;
	title: string;
	toughness?: string;
	typeText: string;
	type: CardType;
	background: CardBackground;
	collectorNumber?: string;
	set?: string;
	rarity?: string;
	artist?: string;
	lang?: string;
	watermark?: "forest" | "island" | "mountain" | "plains" | "swamp";
};

export function parseCardType(engTypeText: string): CardType {
	if (engTypeText.toLowerCase().includes("creature")) {
		return "creature";
	} else if (engTypeText.toLowerCase().includes("land")) {
		return "land";
	} else if (engTypeText.toLowerCase().includes("artifact")) {
		return "artifact";
	} else if (engTypeText.toLowerCase().includes("enchantment")) {
		return "enchantment";
	} else if (engTypeText.toLowerCase().includes("planeswalker")) {
		return "planeswalker";
	} else if (engTypeText.toLowerCase().includes("instant")) {
		return "instant";
	} else if (engTypeText.toLowerCase().includes("sorcery")) {
		return "sorcery";
	} else {
		throw new Error(`Unknown card type: ${engTypeText}`);
	}
}

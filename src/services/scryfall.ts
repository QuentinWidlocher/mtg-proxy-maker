import { parseCardColor, parseCardFrame } from "../types/backgrounds";
import { Card } from "../types/card";
import { ManaType } from "../types/mana";

export function parseMana(manaCostString: string = ""): ManaType[] {
	const manaCost = manaCostString.match(/\{(.+?)\}/g) ?? [];
	return manaCost.flatMap((manaWithBraces): ManaType | ManaType[] => {
		const mana = manaWithBraces.replace("{", "").replace("}", "");
		return manaLetterToType(mana);
	});
}

export function manaLetterToType(manaLetter: string): ManaType | ManaType[] {
	switch (manaLetter) {
		case "W":
			return "white";
		case "U":
			return "blue";
		case "B":
			return "black";
		case "R":
			return "red";
		case "G":
			return "green";
		case "X":
			return "x";
		case "U/B":
			return "blue-black";
		case "R/G":
			return "red-green";
		case "R/W":
			return "red-white";
		case "G/W":
			return "green-white";
		case "G/U":
			return "green-blue";
		default:
			return [...new Array(parseInt(manaLetter))].map(
				() => "colorless" as const
			);
	}
}

export async function fetchCards(
	title: string,
	quantity = 1,
	lang = "en"
): Promise<Card[]> {
	const sanitizedTitle = title.split(" ").join("-");

	const [frCards, enCards]: [any, any] = await Promise.all([
		fetch(
			`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}+lang:${lang}`
		),
		fetch(`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}`),
	]).then(([fr, en]) => Promise.all([fr.json(), en.json()]));

	const index = enCards.data.findIndex((c: any) => c.name == title);
	const [fr, en] = [frCards.data[index], enCards.data[index]];

	const isBasicLand = en["type_line"].includes("Basic Land");
	const colorsToUse: string[] = en["type_line"].toLowerCase().includes("land")
		? fr["color_identity"]
		: fr["colors"];
	const manaTypes = colorsToUse.flatMap(manaLetterToType);

	const card: Card = {
		title: fr["printed_name"] || fr["name"],
		manaCost: parseMana(fr["mana_cost"]),
		artUrl: en["image_uris"]?.["art_crop"],
		aspect: {
			frame: parseCardFrame(en["type_line"]),
			color: parseCardColor(
				manaTypes,
				en["type_line"].toLowerCase().includes("artifact")
			),
			legendary: fr["frame_effects"]?.includes("legendary"),
		},
		typeText: fr["printed_type_line"] || en["type_line"],
		oracleText: fr["printed_text"] || fr["oracle_text"],
		flavorText: fr["flavor_text"],
		power: fr["power"],
		toughness: fr["toughness"],
		artist: fr["artist"],
		collectorNumber: fr["collector_number"],
		lang: fr["lang"],
		rarity: fr["rarity"],
		set: fr["set"],
	};

	if (quantity === 1) {
		return [card];
	}

	if (isBasicLand) {
		const variants = await fetchVariants(en["name"]);
		return Array.from({ length: quantity }, (_, i) => ({
			...card,
			...variants[i % variants.length],
		}));
	} else {
		return Array.from({ length: quantity }, () => card);
	}
}

export async function fetchVariants(title: string): Promise<Partial<Card>[]> {
	const sanitizedTitle = title.split(" ").join("-");

	const response = await fetch(
		`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}+unique:prints`
	).then((r) => r.json() as any);

	return response.data
		.map(
			(card: any): Partial<Card> => ({
				artUrl: card["image_uris"]?.["art_crop"],
				artist: card["artist"],
				collectorNumber: card["collector_number"],
				set: card["set"],
				rarity: card["rarity"],
				flavorText: card["flavor_text"],
			})
		)
		.filter(Boolean);
}

export async function searchCard(search: string) {
	if (search.length < 3) return [];

	const response = await fetch(
		`https://api.scryfall.com/cards/search/?q=${search}`
	).then((r) => r.json() as any);

	return response.data as Array<{
		name: string;
	}>;
}

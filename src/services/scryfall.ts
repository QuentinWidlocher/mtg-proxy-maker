import { CardBackground } from "../types/backgrounds";
import { Card, parseCardType } from "../types/card";
import { ManaType, assertUnaryType, unaryTypesToType } from "../types/mana";
import { parseLandType } from "../types/watermarks";

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

const frames: {
	creature: {
		normal: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
		legendary: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
	};
	land: {
		normal: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
		legendary: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
	};
	spell: {
		normal: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
		legendary: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
	};
	artifact: {
		normal: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
		legendary: {
			[key in ManaType | "multicolored"]?: CardBackground;
		};
	};
} = {
	creature: {
		normal: {
			"blue-black": "blue-black-creature",
			"green-black": "black-green-creature",
			"green-blue": "green-blue-creature",
			"green-white": "green-white-creature",
			"red-black": "black-red-creature",
			"red-blue": "blue-red-creature",
			black: "black-creature",
			blue: "blue-creature",
			green: "green-creature",
			multicolored: "multicolored-creature",
			"black-white": "white-black-creature",
			"blue-white": "white-blue-creature",
			"red-green": "red-green-creature",
			"red-white": "red-white-creature",
			red: "red-creature",
			white: "white-creature",
		},
		legendary: {
			"blue-black": "blue-black-legendary-creature",
			"green-black": "black-green-legendary-creature",
			"green-blue": "green-blue-legendary-creature",
			"green-white": "green-white-legendary-creature",
			"red-black": "black-red-legendary-creature",
			"red-blue": "blue-red-legendary-creature",
			black: "black-legendary-creature",
			blue: "blue-legendary-creature",
			green: "green-legendary-creature",
			"black-white": "white-black-legendary-creature",
			"blue-white": "white-blue-legendary-creature",
			"red-green": "red-green-legendary-creature",
			"red-white": "red-white-legendary-creature",
			multicolored: "multicolored-legendary-creature",
			red: "red-legendary-creature",
			white: "white-legendary-creature",
		},
	},
	land: {
		normal: {
			"green-white": "green-white-land",
			black: "black-land",
			blue: "blue-land",
			green: "green-land",
			"black-white": "white-black-land",
			"red-green": "red-green-land",
			multicolored: "colorless-land",
			red: "red-land",
			white: "white-land",
		},
		legendary: {
			"green-white": "green-white-legendary-land",
			"red-black": "black-red-legendary-land",
			black: "black-legendary-land",
			blue: "blue-legendary-land",
			green: "green-legendary-land",
			"black-white": "white-black-legendary-land",
			multicolored: "multicolored-legendary-land",
			red: "red-legendary-land",
			white: "white-legendary-land",
		},
	},
	spell: {
		normal: {
			"blue-black": "blue-black-spell",
			"green-black": "black-green-spell",
			"green-blue": "green-blue-spell",
			"green-white": "green-white-spell",
			"red-black": "black-red-spell",
			"red-blue": "blue-red-spell",
			black: "black-spell",
			blue: "blue-spell",
			green: "green-spell",
			"black-white": "white-black-spell",
			"blue-white": "white-blue-spell",
			"red-green": "red-green-spell",
			"red-white": "red-white-spell",
			multicolored: "multicolored-spell",
			red: "red-spell",
			white: "white-spell",
		},
		legendary: {
			black: "black-legendary-spell",
			blue: "blue-legendary-spell",
			green: "green-legendary-spell",
			"black-white": "white-black-legendary-spell",
			multicolored: "multicolored-legendary-spell",
			red: "red-legendary-spell",
			white: "white-legendary-spell",
		},
	},
	artifact: {
		normal: {
			colorless: "colorless-spell",
			"green-black": "colorless-black-green-spell",
			"green-blue": "colorless-green-blue-spell",
			black: "colorless-black-spell",
			blue: "colorless-blue-spell",
			green: "colorless-green-spell",
			"black-white": "colorless-white-black-spell",
			red: "colorless-red-spell",
			white: "colorless-white-spell",
		},
		legendary: {
			black: "colorless-black-legendary-spell",
			blue: "colorless-blue-legendary-spell",
			green: "colorless-green-legendary-spell",
			multicolored: "colorless-multicolored-legendary-spell",
			red: "colorless-red-legendary-spell",
			white: "colorless-white-legendary-spell",
		},
	},
} as const;

export function parseCardFrame(
	type: string,
	frameEffects: string[] = [],
	colors: string[],
	colorIdentity: string[]
): CardBackground {
	let cardType: keyof typeof frames;

	if (type.toLowerCase().includes("artifact")) {
		cardType = "artifact";
	} else if (type.toLowerCase().includes("land")) {
		cardType = "land";
	} else if (type.toLowerCase().includes("creature")) {
		cardType = "creature";
	} else if (
		type.toLowerCase().includes("spell") ||
		type.toLowerCase().includes("instant") ||
		type.toLowerCase().includes("sorcery") ||
		type.toLowerCase().includes("enchantment")
	) {
		cardType = "spell";
	} else {
		throw new Error(`Unknown card type: ${type}`);
	}

	const legendaryType = frameEffects.includes("legendary")
		? "legendary"
		: "normal";

	const colorsToUse = type.toLowerCase().includes("land")
		? colorIdentity
		: colors;
	const manaTypes = colorsToUse.flatMap(manaLetterToType);
	const multiColorType = unaryTypesToType(manaTypes.map(assertUnaryType));

	return (
		frames[cardType][legendaryType][multiColorType] ?? "multicolored-spell"
	);
}

export async function fetchCards(title: string, quantity = 1): Promise<Card[]> {
	const sanitizedTitle = title.split(" ").join("-");

	const [frCards, enCards]: [any, any] = await Promise.all([
		fetch(
			`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}+lang:fr`
		),
		fetch(`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}`),
	]).then(([fr, en]) => Promise.all([fr.json(), en.json()]));

	const index = enCards.data.findIndex((c: any) => c.name == title);
	const [fr, en] = [frCards.data[index], enCards.data[index]];

	const isBasicLand = en["type_line"].includes("Basic Land");

	const card: Card = {
		title: fr["printed_name"] || fr["name"],
		manaCost: parseMana(fr["mana_cost"]),
		artUrl: en["image_uris"]?.["art_crop"],
		type: parseCardType(en["type_line"]),
		typeText: fr["printed_type_line"] || en["type_line"],
		oracleText: fr["printed_text"] || fr["oracle_text"],
		flavorText: fr["flavor_text"],
		power: fr["power"],
		toughness: fr["toughness"],
		background: parseCardFrame(
			en["type_line"],
			fr["frame_effects"],
			fr["colors"],
			fr["color_identity"]
		),
		artist: fr["artist"],
		collectorNumber: fr["collector_number"],
		lang: fr["lang"],
		rarity: fr["rarity"],
		set: fr["set"],
		watermark: isBasicLand ? parseLandType(en["type_line"]) : undefined,
	};

	if (quantity === 1) {
		return [card];
	}

	if (isBasicLand) {
		const imageVariants = await fetchImageVariants(en["name"]);
		return Array.from({ length: quantity }, (_, i) => ({
			...card,
			artUrl: imageVariants[i % imageVariants.length],
		}));
	} else {
		return Array.from({ length: quantity }, () => card);
	}
}

export async function fetchImageVariants(title: string): Promise<string[]> {
	const sanitizedTitle = title.split(" ").join("-");

	const response = await fetch(
		`https://api.scryfall.com/cards/search/?q=!${sanitizedTitle}+unique:prints`
	).then((r) => r.json() as any);

	const image_uris = response.data
		.map((card: any) => card.image_uris?.art_crop)
		.filter(Boolean);

	return image_uris;
}

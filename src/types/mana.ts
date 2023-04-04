import { symbols } from "./symbols";

// In order
export const manaTypes = [
	"colorless",
	"x",
	"red",
	"green",
	"blue",
	"black",
	"white",
	"red-green",
	"red-blue",
	"red-black",
	"red-white",
	"green-blue",
	"green-black",
	"green-white",
	"blue-black",
	"blue-white",
	"black-white",
] as const;

export type ManaType = typeof manaTypes[number];

export const manaTypeToSvg: Record<ManaType, string> = {
	colorless: symbols[0],
	x: symbols.X,
	red: symbols.R,
	green: symbols.G,
	blue: symbols.U,
	black: symbols.B,
	white: symbols.W,
	"red-green": symbols.RG,
	"red-blue": symbols.UR,
	"red-black": symbols.BR,
	"red-white": symbols.RW,
	"green-blue": symbols.GU,
	"green-black": symbols.BG,
	"green-white": symbols.GW,
	"blue-black": symbols.UB,
	"blue-white": symbols.WU,
	"black-white": symbols.WB,
};

export type UnaryType = Extract<
	ManaType,
	"colorless" | "x" | "red" | "green" | "blue" | "black" | "white"
>;
export type MultiType = Exclude<ManaType, UnaryType>;

const unaryToMultiType: Record<MultiType, readonly [UnaryType, UnaryType]> = {
	"red-green": ["red", "green"],
	"red-blue": ["red", "blue"],
	"red-black": ["red", "black"],
	"red-white": ["red", "white"],
	"green-blue": ["green", "blue"],
	"green-black": ["green", "black"],
	"green-white": ["green", "white"],
	"blue-black": ["blue", "black"],
	"blue-white": ["blue", "white"],
	"black-white": ["black", "white"],
} as const;

export function assertUnaryType(type: ManaType): UnaryType {
	if (Object.keys(unaryToMultiType).includes(type)) {
		throw new Error(`Type ${type} is not unary`);
	}

	return type as UnaryType;
}

export function unaryTypesToType(
	types: UnaryType[]
): ManaType | "multicolored" {
	switch (types.length) {
		case 0:
			return "colorless";
		case 1:
			return types[0];
		default:
			const result = Object.entries(unaryToMultiType).find(([multi, array]) => {
				return array.every((type) => types.includes(type));
			});

			return (result?.[0] as ManaType) ?? "multicolored";
	}
}

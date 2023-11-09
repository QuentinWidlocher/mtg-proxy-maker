import { biManaToColor } from "./backgrounds";
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
  "action",
  "bonus-action",
] as const;

export type ManaType = typeof manaTypes[number];

export const manaLetters = ["A", "BA", "W", "U", "B", "R", "G", "X", "R/G", "G/R", "R/U", "U/R", "R/B", "B/R", "R/W", "W/R", "G/U", "U/G", "G/B", "B/G", "G/W", "W/G", "U/B", "B/U", "U/W", "W/U", "B/W", "W/B"] as const;
export type ManaLetter = typeof manaLetters[number];

export const manaLetterToType: Record<ManaLetter, ManaType> = {
  "A": "action",
  "BA": "bonus-action",
  "W": "white",
  "U": "blue",
  "B": "black",
  "R": "red",
  "G": "green",
  "X": "x",
  "R/G": "red-green",
  "G/R": "red-green",
  "R/U": "red-blue",
  "U/R": "red-blue",
  "R/B": "red-black",
  "B/R": "red-black",
  "R/W": "red-white",
  "W/R": "red-white",
  "G/U": "green-blue",
  "U/G": "green-blue",
  "G/B": "green-black",
  "B/G": "green-black",
  "G/W": "green-white",
  "W/G": "green-white",
  "U/B": "blue-black",
  "B/U": "blue-black",
  "U/W": "blue-white",
  "W/U": "blue-white",
  "B/W": "black-white",
  "W/B": "black-white"
};


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
  action: symbols.Action,
  "bonus-action": symbols.BonusAction,
};

export type UnaryManaType = Extract<
  ManaType,
  "colorless" | "x" | "red" | "green" | "blue" | "black" | "white" | "action" | "bonus-action"
>;
export type BiManaType = Exclude<ManaType, UnaryManaType>;

export const unaryToBiType: Record<
  BiManaType,
  readonly [UnaryManaType, UnaryManaType]
> = {
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

export function isUnaryType(type: ManaType): type is UnaryManaType {
  return !Object.keys(unaryToBiType).includes(type);
}

export function isBiType(type: ManaType): type is BiManaType {
  return Object.keys(unaryToBiType).includes(type);
}

export function assertUnaryType(type: ManaType): UnaryManaType {
  if (isUnaryType(type)) {
    return type;
  } else {
    throw new Error(`Type ${type} is not unary`);
  }
}

export function unaryTypesToType(
  types: UnaryManaType[]
): ManaType | "multicolored" {
  switch (types.length) {
    case 0:
      return "colorless";
    case 1:
      return types[0];
    default:
      const result = Object.entries(unaryToBiType).find(([multi, array]) => {
        return array.every((type) => types.includes(type));
      });

      return (result?.[0] as ManaType) ?? "multicolored";
  }
}

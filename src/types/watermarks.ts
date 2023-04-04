import forestWatermarkUrl from "../assets/images/card-watermarks/forest-watermark.png";
import islandWatermarkUrl from "../assets/images/card-watermarks/island-watermark.png";
import mountainWatermarkUrl from "../assets/images/card-watermarks/mountain-watermark.png";
import plainsWatermarkUrl from "../assets/images/card-watermarks/plains-watermark.png";
import swampWatermarkUrl from "../assets/images/card-watermarks/swamp-watermark.png";

export const watermarks = [
	"forest",
	"island",
	"mountain",
	"plains",
	"swamp",
] as const;

export type Watermark = typeof watermarks[number];

export const watermarkUrls: Record<Watermark, string> = {
	forest: forestWatermarkUrl,
	island: islandWatermarkUrl,
	mountain: mountainWatermarkUrl,
	plains: plainsWatermarkUrl,
	swamp: swampWatermarkUrl,
};

export function parseLandType(type: string): Watermark {
	if (type.toLowerCase().includes("forest")) {
		return "forest";
	} else if (type.toLowerCase().includes("island")) {
		return "island";
	} else if (type.toLowerCase().includes("mountain")) {
		return "mountain";
	} else if (type.toLowerCase().includes("plains")) {
		return "plains";
	} else if (type.toLowerCase().includes("swamp")) {
		return "swamp";
	} else {
		throw new Error(`Unknown land type: ${type}`);
	}
}

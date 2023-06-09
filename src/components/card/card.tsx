import { Show } from "solid-js";
import { getFrameAndBackgroundFromAspect } from "../../types/backgrounds";
import { Card } from "../../types/card";
import Art from "./art";
import Metadata from "./metadata";
import PlaneswalkerDescription from "./planeswalker-description";
import PlaneswalkerLoyalty from "./planeswalker-loyalty";
import RegularDescription from "./regular-description";
import Strength from "./strength";
import TitleBar from "./title-bar";
import TypeBar from "./type-bar";

export default function CardComponent(
	card: Card & { onArtChange: (modifier: number) => void; variant?: number }
) {
	const [frame, background] = getFrameAndBackgroundFromAspect(card.aspect);

	return (
		<div
			tabIndex={0}
			class="rounded-xl print:rounded-none card hover:z-10 focus:transition-transform group md:focus:scale-150 focus:z-20"
			style={{
				position: "relative",
				display: "flex",
				"font-family": "MPlantin",
				"font-size": "12pt",
				"background-color": "var(--card-bgc, #161410)",
				height: "auto",
				width: "var(--card-width)",
				"min-width": "var(--card-width)",
				"max-width": "var(--card-width)",
				"aspect-ratio": "63/88",
				border: "var(--card-bleed) solid var(--card-bgc)",
				margin: "auto",
				"box-sizing": "content-box",
			}}
		>
			<img
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
					top: 0,
					left: 0,
				}}
				src={background}
			/>
			{/* Black mask for the bottom of the card */}
			<div
				style={{
					bottom: "5.5mm",
					height: "2mm",
					left: "0",
					right: "0",
					position: "absolute",
					background: 'var(--card-bgc, "black")',
				}}
			/>
			<Show when={card.totalVariants > 1}>
				<div class="absolute bg-black/50 items-center top-[20mm] left-0 w-full z-10 grid grid-cols-3 py-2 opacity-0 print:hidden group-focus:opacity-100 md:hover:opacity-100 transition-opacity">
					<Show when={(card.variant ?? 0) > 0} fallback={<div />}>
						<button
							onClick={() => card.onArtChange(-1)}
							class="text-xl p-2 text-white filter shadow-sm text-bold"
						>
							{"◀️"}
						</button>
					</Show>
					<span class="text-white mx-auto">
						Variant {(card.variant ?? 0) + 1}/{card.totalVariants}
					</span>
					<Show
						when={(card.variant ?? 0) < card.totalVariants - 1}
						fallback={<div />}
					>
						<button
							onClick={() => card.onArtChange(1)}
							class="text-xl p-2 text-white filter shadow-sm text-bold"
						>
							{"▶️"}
						</button>
					</Show>
				</div>
			</Show>
			{card.artUrl && <Art url={card.artUrl} category={card.category} />}
			<img
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
					top: 0,
					left: 0,
					"z-index": card.category == "Planeswalker" ? 1 : 0,
				}}
				src={frame}
			/>
			<TitleBar
				title={card.title}
				manaCost={card.manaCost}
				category={card.category}
			/>
			<TypeBar type={card.typeText} category={card.category} />
			{card.category == "Regular" ? (
				card.aspect.frame != "Basic Land" && (
					<RegularDescription
						flavor={card.flavorText}
						oracle={card.oracleText}
					/>
				)
			) : (
				<PlaneswalkerDescription oracle={card.oracleText} />
			)}
			{card.category == "Regular" ? (
				(card.power || card.toughness) && (
					<Strength
						power={card.power}
						toughness={card.toughness}
						textColor={card.aspect.frame == "Vehicle" ? "white" : "black"}
					/>
				)
			) : (
				<PlaneswalkerLoyalty value={card.loyalty} />
			)}
			<Metadata {...card} />
		</div>
	);
}

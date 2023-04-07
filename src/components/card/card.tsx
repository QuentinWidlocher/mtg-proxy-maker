import { getBackgroundFromAspect } from "../../types/backgrounds";
import { Card } from "../../types/card";
import Art from "./art";
import Description from "./description";
import Metadata from "./metadata";
import Strength from "./strength";
import TitleBar from "./title-bar";
import TypeBar from "./type-bar";

export default function CardComponent(card: Card) {
	console.log("rendering card", card);

	return (
		<div
			class="rounded-xl print:rounded-none card hover:z-10"
			style={{
				position: "relative",
				display: "flex",
				"font-family": "MPlantin",
				"font-size": "12pt",
				"background-color": "var(--card-bgc)",
				height: " auto",
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
				src={getBackgroundFromAspect(card.aspect)}
			/>
			{card.artUrl && <Art url={card.artUrl} />}
			<TitleBar title={card.title} manaCost={card.manaCost} />
			<TypeBar type={card.typeText} />
			{card.aspect.frame != "Basic Land" &&
				Description({
					flavor: card.flavorText,
					oracle: card.oracleText,
				})}
			{(card.power || card.toughness) && (
				<Strength power={card.power} toughness={card.toughness} />
			)}
			<Metadata {...card} />
		</div>
	);
}

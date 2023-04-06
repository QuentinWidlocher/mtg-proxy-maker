import { getBackgroundFromAspect } from "../types/backgrounds";
import { Card } from "../types/card";
import Art from "./art";
import Description from "./description";
import Metadata from "./metadata";
import Strength from "./strength";
import TitleBar from "./title-bar";
import TypeBar from "./type-bar";

export default async function CardComponent(card: Card) {
	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				backgroundSize: "contain",
				fontFamily: "Planewalker",
				width: "100%",
				height: "100%",
				fontSize: "12pt",
				padding: "2mm",
				boxSizing: "border-box",
				backgroundColor: "black",
			}}
		>
			<img
				style={{
					width: 630,
					height: 880,
					position: "absolute",
					zIndex: "10",
					top: 0,
					left: 0,
				}}
				src={await getBackgroundFromAspect(card.aspect)}
			/>
			{card.artUrl && <Art url={card.artUrl} />}
			{await TitleBar({ title: card.title, manaCost: card.manaCost })}
			<TypeBar type={card.typeText} />
			{card.aspect.frame != "Basic Land" &&
				(await Description({
					flavor: card.flavorText,
					oracle: card.oracleText,
				}))}
			{(card.power || card.toughness) && (
				<Strength power={card.power} toughness={card.toughness} />
			)}
			<Metadata {...card} />
		</div>
	);
}

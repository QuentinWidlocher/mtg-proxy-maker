import { cardBackgroundUrls } from "../types/backgrounds";
import { Card } from "../types/card";
import Art from "./art";
import Description from "./description";
import Strength from "./strength";
import TitleBar from "./title-bar";
import TypeBar from "./type-bar";
import VariousData from "./various-data";
import WatermarkComponent from "./watermark";

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
			{card.artUrl && <Art url={card.artUrl} />}
			<img
				style={{
					width: 630,
					height: 880,
					position: "absolute",
					zIndex: "10",
					top: 0,
					left: 0,
				}}
				src={cardBackgroundUrls[card.background ?? "colorless-creature"]}
			/>
			<TitleBar title={card.title} manaCost={card.manaCost} />
			<TypeBar type={card.typeText} />
			{card.watermark && (
				<WatermarkComponent
					watermark={card.watermark}
					lowOpacity={
						card.type != "land" && (!!card.flavorText || !!card.oracleText)
					}
				/>
			)}
			{card.type != "land" && (
				<Description flavor={card.flavorText} oracle={card.oracleText} />
			)}
			{(card.power || card.toughness) && (
				<Strength power={card.power} toughness={card.toughness} />
			)}
			<VariousData {...card} />
		</div>
	);
}

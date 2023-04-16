import { JSX } from "solid-js/jsx-runtime";
import { Card } from "../../types/card";

type ArtProps = {
	url: string;
	category: Card["category"];
};

const style: Record<Card["category"], JSX.CSSProperties> = {
	Planeswalker: {
		width: "53.7mm",
		height: "40.1mm",
		position: "absolute",
		top: "8.3mm",
		left: "4.7mm",
		"object-fit": "cover",
	},
	Regular: {
		width: "53.4mm",
		height: "38.8mm",
		position: "absolute",
		top: "10.3mm",
		left: "4.9mm",
		"object-fit": "cover",
	},
};

export default function Art(props: ArtProps) {
	return <img style={style[props.category]} src={props.url} />;
}

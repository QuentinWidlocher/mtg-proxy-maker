import { JSX } from "solid-js/jsx-runtime";
import flavorTextDividerUrl from "../../assets/images/flavor-text-divider.png";
import { symbols } from "../../types/symbols";

type DescriptionProps = {
	oracle?: string;
	flavor?: string;
};

function injectSymbols(description: string): JSX.Element {
	console.debug("description", description);
	return (
		<>
			{description.split(/{([^}]+)}/g).map((word, i) => {
				console.debug("word", word);
				if (word in symbols) {
					return (
						<img
							style={{
								width: "2.5mm",
								transform: "translateY(2px)",
								margin: "0 0.1mm",
								display: "initial",
								"vertical-align": "initial",
							}}
							src={symbols[word as keyof typeof symbols]}
						/>
					);
				} else {
					return word;
				}
			})}
		</>
	);
}

export default function Description(props: DescriptionProps) {
	const totalLength = (props.flavor?.length ?? 0) + (props.oracle?.length ?? 0);

	return (
		<div
			style={{
				display: "flex",
				"flex-direction": "column",
				"justify-content": "center",
				top: "55.1mm",
				height: "24.5mm",
				left: "4.9mm",
				right: "4.7mm",
				position: "absolute",
				"font-size": totalLength >= 320 ? "6pt" : "7pt",
				padding: "0.8mm",
				"font-family": "MPlantin",
				"line-height": 1,
			}}
		>
			{props.oracle && (
				<div
					style={{
						margin: 0,
						"font-weight": 500,
						display: "flex",
						"flex-direction": "column",
						"white-space": "pre-wrap",
					}}
				>
					{props.oracle.split("\n").map((paragraph, index) => (
						<p
							style={{
								margin: 0,
								"margin-top": index > 0 ? "1mm" : 0,
							}}
						>
							{injectSymbols(paragraph)}
						</p>
					))}
				</div>
			)}
			{props.flavor && props.oracle && (
				<img
					src={flavorTextDividerUrl}
					style={{
						"margin-top": "1mm",
						"margin-bottom": "1mm",
					}}
				/>
			)}
			{props.flavor && (
				<p
					style={{
						margin: 0,
						"font-style": "italic",
						"white-space": "pre-wrap",
					}}
				>
					{props.flavor}
				</p>
			)}
		</div>
	);
}

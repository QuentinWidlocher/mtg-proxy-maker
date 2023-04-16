import { JSX } from "solid-js/jsx-runtime";
import { P, match } from "ts-pattern";
import { symbols } from "../../types/symbols";

type PlaneswalkerDescriptionProps = {
	oracle: string;
};

function injectSymbols(description: string): JSX.Element {
	return (
		<>
			{description.split(/{([^}]+)}/g).map((word) => {
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

function PlaneswalkerCost({ cost }: { cost: string }) {
	const [src, style] = match(cost[0])
		.with(
			"-",
			() =>
				[
					`assets/images/planeswalker-items/Minus.svg`,
					{ "margin-top": "0.5mm" },
				] as const
		)
		.with(
			"+",
			() =>
				[
					`assets/images/planeswalker-items/Plus.svg`,
					{ "margin-top": "1mm" },
				] as const
		)
		.otherwise(
			() =>
				[
					`assets/images/planeswalker-items/Zero.svg`,
					{
						"margin-top": "0.5mm",
					},
				] as const
		);

	return (
		<div
			class="z-10 grid grid-cols-1 grid-rows-1 my-auto"
			style={{
				height: "4mm",
				"font-size": "7pt",
				"font-weight": 500,
				"margin-left": "-2.9mm",
			}}
		>
			<span
				class="col-start-1 row-start-1 text-white z-10 text-center"
				style={{
					"margin-left": "2.5mm",
					...style,
				}}
			>
				{cost}
			</span>
			<img
				src={src}
				alt=""
				class="max-w-none col-start-1 row-start-1"
				style={{
					width: "9mm",
					"margin-top": "-1mm",
				}}
			/>
		</div>
	);
}

export default function PlaneswalkerDescription(
	props: PlaneswalkerDescriptionProps
) {
	const fontSize = match(
		props.oracle.split("\n").reduce((a, b) => Math.max(a, b.length), 0)
	)
		.with(
			P.when((maxLength) => maxLength < 50),
			() => "7pt"
		)
		.with(
			P.when((maxLength) => maxLength < 100),
			() => "6.5pt"
		)
		.with(
			P.when((maxLength) => maxLength < 150),
			() => "5.8pt"
		)
		.with(
			P.when((maxLength) => maxLength < 200),
			() => "5.5pt"
		)
		.with(
			P.when((maxLength) => maxLength < 250),
			() => "5.3pt"
		)
		.otherwise(() => "5pt");

	const parsedDescription: Array<[JSX.Element, JSX.Element]> = props.oracle
		.split("\n")
		.map((line, i) => {
			const splitted = line.replace("−", "-").split(/([\+\-]?\d+)+\s?:\s?/g);

			if (splitted.length > 1) {
				return [
					<PlaneswalkerCost cost={splitted[1]} />,
					<p
						class={`m-0 pl-2.5 pr-1 flex items-center last:pb-1 ${
							i % 2 == 0 ? "bg-gray-50/70" : "bg-gray-200/70"
						}`}
						style={{
							"font-size": fontSize,
						}}
					>
						{injectSymbols(splitted[2])}
					</p>,
				];
			} else {
				return [
					<div></div>,
					<p
						class={`m-0 pl-1 pr-1 flex items-center ${
							i % 2 == 0 ? "bg-gray-50/70" : "bg-gray-200/70"
						}`}
						style={{
							"font-size": fontSize,
						}}
					>
						{injectSymbols(splitted[0])}
					</p>,
				];
			}
		});

	return (
		<div
			style={{
				display: "flex",
				"flex-direction": "column",
				"justify-content": "center",
				top: "54mm",
				height: "27.1mm",
				left: "2.9mm",
				right: "4.2mm",
				position: "absolute",
				"font-size": "6pt",
				padding: "0.8mm",
				"font-family": "MPlantin",
				"line-height": 1,
			}}
		>
			<div class="grid grid-cols-[3.9mm_1fr] h-full">
				{parsedDescription.map(([cost, description]) => (
					<>
						{cost}
						{description}
					</>
				))}
			</div>
		</div>
	);
}

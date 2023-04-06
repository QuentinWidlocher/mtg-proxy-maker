import { readFile } from "fs/promises";
import flavorTextDividerUrl from "../assets/images/flavor-text-divider.png";
import { replaceGraphemes } from "../types/symbols";

type DescriptionProps = {
	oracle?: string;
	flavor?: string;
};

export default async function Description(props: DescriptionProps) {
	let flavorTextDivider = null;

	if (props.oracle && props.flavor) {
		const buffer = await readFile(`.${flavorTextDividerUrl}`);
		flavorTextDivider = `data:image/png;base64,${buffer.toString("base64")}`;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: "100%",
				top: 555,
				height: 240,
				paddingLeft: 60,
				paddingRight: 50,
				position: "absolute",
			}}
		>
			{props.oracle && (
				<pre
					style={{
						margin: 0,
						fontSize: 24.5,
						lineHeight: 1.2,
						fontWeight: 500,
						display: "flex",
						flexDirection: "column",
						whiteSpace: "pre-wrap",
					}}
				>
					{replaceGraphemes(props.oracle)
						.split("\n")
						.map((line, index) => (
							<div
								style={{
									marginTop: index > 0 ? 10 : 0,
								}}
							>
								{line}
							</div>
						))}
				</pre>
			)}
			{flavorTextDivider && (
				<img
					src={flavorTextDivider}
					style={{
						marginTop: 10,
						marginBottom: 10,
					}}
				/>
			)}
			{props.flavor && (
				<pre
					style={{
						margin: 0,
						fontStyle: "italic",
						whiteSpace: "pre-wrap",
						fontSize: 24,
					}}
				>
					{props.flavor}
				</pre>
			)}
		</div>
	);
}

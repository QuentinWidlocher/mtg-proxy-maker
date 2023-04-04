import flavorTextDividerUrl from "../assets/images/flavor-text-divider.png";
import { replaceGraphemes } from "../types/symbols";

type DescriptionProps = {
	oracle?: string;
	flavor?: string;
};

export default function Description(props: DescriptionProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: "100%",
				top: 555,
				height: 240,
				paddingLeft: 50,
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
			{props.oracle && props.flavor && (
				<img
					src={flavorTextDividerUrl}
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

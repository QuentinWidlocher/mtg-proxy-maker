type TypeBarProps = {
	type: string;
};

export default function TypeBar({ type }: TypeBarProps) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-around",
				width: "100%",
				top: 500,
				height: 40,
				paddingLeft: 50,
				paddingRight: 50,
				position: "absolute",
			}}
		>
			<h1
				style={{
					margin: 0,
					marginTop: "auto",
					marginBottom: "auto",
					fontFamily: "Beleren",
					fontSize: 28,
					flex: 1,
				}}
			>
				{type}
			</h1>
		</div>
	);
}

type MetadataProps = {
	collectorNumber?: string;
	set?: string;
	rarity?: string;
	artist?: string;
	lang?: string;
};

export default function Metadata(props: MetadataProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				bottom: 25,
				height: 35,
				paddingLeft: 45,
				paddingRight: 40,
				position: "absolute",
				color: "white",
				fontFamily: "Prompt",
				fontSize: 16,
				lineHeight: 0.6,
			}}
		>
			<div style={{ display: "flex", flex: 1 }}>
				{props.collectorNumber ?? ""} {props.rarity?.[0].toUpperCase() ?? ""}
				{" · Proxy"}
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					width: "100%",
				}}
			>
				<div style={{ flex: 1, display: "flex" }}>
					{props.set && <span>{props.set.toUpperCase()}</span>}
					{props.set && props.lang && (
						<span style={{ margin: "0 5px" }}>{"·"}</span>
					)}
					{props.lang && <span>{props.lang.toUpperCase()}</span>}
					{props.artist && (
						<span
							style={{
								marginLeft: 10,
								fontFamily: "Beleren Small Caps",
								transform: "translateY(2px)",
							}}
						>
							{props.artist}
						</span>
					)}
				</div>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "flex-end",
						fontFamily: "serif",
						fontSize: 12,
						marginTop: 5,
					}}
				>
					{`TM ${new Date().getFullYear()} Wizards of the Coast`}
				</div>
			</div>
		</div>
	);
}

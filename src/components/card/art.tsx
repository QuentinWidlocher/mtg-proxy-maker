type ArtProps = {
	url: string;
};

export default function Art(props: ArtProps) {
	return (
		<img
			style={{
				width: "53.4mm",
				height: "38.8mm",
				position: "absolute",
				top: "10.3mm",
				left: "4.9mm",
				"object-fit": "cover",
			}}
			src={props.url}
		/>
	);
}

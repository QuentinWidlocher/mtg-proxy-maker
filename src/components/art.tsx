type ArtProps = {
	url: string;
};

export default function Art(props: ArtProps) {
	return (
		<img
			style={{
				width: 540,
				height: 400,
				position: "absolute",
				top: 95,
				left: 45,
				objectFit: "cover",
			}}
			src={props.url}
		/>
	);
}

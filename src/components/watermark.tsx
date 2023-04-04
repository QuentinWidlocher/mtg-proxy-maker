import { Watermark, watermarkUrls } from "../types/watermarks";

type WatermarkComponentProps = {
	watermark: Watermark;
	lowOpacity?: boolean;
};

export default function WatermarkComponent(props: WatermarkComponentProps) {
	return (
		<img
			style={{
				width: "100%",
				top: 560,
				height: 250,
				paddingLeft: 50,
				paddingRight: 50,
				position: "absolute",
				opacity: props.lowOpacity ? 0.2 : 1,
				objectFit: "contain",
			}}
			src={watermarkUrls[props.watermark]}
		/>
	);
}

import { Card } from "../../types/card";

type MetadataProps = {
  collectorNumber?: string;
  set?: string;
  rarity?: string;
  artist?: string;
  lang?: string;
  category?: Card["category"];
};

export default function Metadata(props: MetadataProps) {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        bottom: "1.7mm",
        height: "4mm",
        left: "4.3mm",
        right: "4.2mm",
        position: "absolute",
        color: "white",
        "font-family": "Prompt",
        "font-size": "4.5pt",
        "line-height": 1,
        "z-index": 2,
      }}
    >
      <div style={{ display: "flex", flex: 1 }}>
        {props.collectorNumber ?? ""} {props.rarity?.[0]?.toUpperCase() ?? ""}
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
                "margin-left": "1mm",
                "font-family": "Beleren Small Caps",
                // 'transform': "translateY(2px)",
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
            "justify-content": "flex-end",
            "font-family": "serif",
            "font-size": "4.4pt",
          }}
        >
          {`™️ & ©️ ${new Date().getFullYear()} Wizards of the Coast`}
        </div>
      </div>
    </div>
  );
}

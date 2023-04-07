export function parseMtgo(string: string) {
	return string
		.split("\n")
		.map((line) => {
			line = line.trim();
			if (!line || line.startsWith("//")) return null;

			const [number, ...name] = line.split(" ");

			if (isNaN(parseInt(number))) {
				return { number: 1, name: line };
			}

			return { number: parseInt(number), name: name.join(" ") };
		})
		.filter(Boolean);
}

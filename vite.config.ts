import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		solidPlugin(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: [
					"**/*.{js,css,html,ico,png,svg}",
					"https://api.scryfall.com/*",
				],
				maximumFileSizeToCacheInBytes: 5_000_000,
			},
		}),
	],
});

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		solidPlugin(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
			manifest: {
				name: "MTG Proxy Maker",
				short_name: "MTG Proxy Maker",
				background_color: "#44403c",
				theme_color: "#f59e0c",
				scope: "/",
				orientation: "portrait",
				start_url: "/",
				display: "standalone",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.scryfall\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "scryfall-cache",
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/raw\.githubusercontent\.com\/*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "github-cache",
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /\.(png|svg|jpg|jpeg)$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "assets-cache",
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
});

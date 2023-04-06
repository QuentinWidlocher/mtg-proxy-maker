import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		...VitePluginNode({
			appPath: "./src/main.tsx",
			tsCompiler: "swc",
			adapter: "express",
		}),
	],
	build: {
		minify: true,
		assetsInlineLimit: 0,
		rollupOptions: {},
		ssr: true,
		emptyOutDir: false,
		// lib: {
		// 	entry: "src/main.tsx",
		// 	fileName: "main",
		// 	name: "main",
		// 	formats: ["es"],
		// },
	},
});

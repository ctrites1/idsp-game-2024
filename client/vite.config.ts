import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	root: path.resolve(__dirname),
	build: {
		outDir: path.resolve(__dirname, "dist"),
		emptyOutDir: true,
	},
	plugins: [],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
});

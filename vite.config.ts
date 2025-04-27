import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_API_URL ?? "http://localhost:8000"}`;
  return {
    server: {
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

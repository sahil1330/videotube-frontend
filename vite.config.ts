import path from "node:path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/

// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://videotube-backend-705995300768.europe-west1.run.app",
//         changeOrigin: true,
//       },
//     },
//   },
//   plugins: [],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });

// export default ({ mode }: { mode: any }) => {
//   const env = loadEnv(mode, process.cwd());
//   const API_URL = `${env.VITE_API_URL ?? 'http://localhost:8000'}`
//   return defineConfig({
//     server: {
//       proxy: {
//         "/api": {
//           target: API_URL,
//           changeOrigin: true
//         },
//       }
//     },

//     plugins: [],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "./src"),
//       },
//     },
//   })
// }

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    server: {
      host: true,
      port: 80,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
        }
      }
    },
    plugins: [],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src')
      }
    }
  }
})
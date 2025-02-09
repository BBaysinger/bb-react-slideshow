import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = command === "build";
  const baseUrl = isProduction ? env.PROD_BASE_URL : env.DEV_BASE_URL;

  return {
    base: baseUrl,
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "sass:map"; @use "sass:list";`,
        },
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    define: {
      basePath: JSON.stringify(baseUrl),
    },
    server: {
      host: true, // Ensures it binds to all network interfaces
      port: 5173, // Specify the port explicitly
    },
  };
});

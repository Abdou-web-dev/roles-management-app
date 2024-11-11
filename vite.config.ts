import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // Using '/api' as the prefix to match your request
  //     "/api": {
  //       target: "https://googlereviewsolicitor.azurewebsites.net",
  //       changeOrigin: true,
  //       secure: true, // Enables HTTPS, which might be necessary
  //       rewrite: (path) => path.replace(/^\/api/, ""), // Removes `/api` prefix
  //     },
  //   },
  // },
});

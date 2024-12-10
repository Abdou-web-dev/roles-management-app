import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  base: "/roles-management-app/", // Set the base path to the repository name
  plugins: [react()],
});
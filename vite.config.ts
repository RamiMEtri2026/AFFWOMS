import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" يخلي الموقع يشتغل على GitHub Pages حتى لو تحت اسم الريبو
export default defineConfig({
  plugins: [react()],
  base: "./",
});

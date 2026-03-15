import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://orderly-backend-hy15.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

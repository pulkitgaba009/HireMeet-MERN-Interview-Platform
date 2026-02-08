import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/piston": {
        target: "https://emkc.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/piston/, ""),
      },
    },
  },
});

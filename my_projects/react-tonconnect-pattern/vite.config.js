import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills() // Добавляем полифилы для Node.js
  ],
  server: {
    port: 3001, // Используйте нужный вам порт
  },
  define: {
    global: "globalThis", // Определяем global как globalThis
  },
});

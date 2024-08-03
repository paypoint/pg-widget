import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "PaymentGateway",
      fileName: () => "payment-gateway.js",
    },
    rollupOptions: {
      output: {
        format: "iife",
      },
    },
  },
  define: {
    "process.env": {},
  },
});

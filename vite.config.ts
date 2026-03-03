import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    /* 
      // TEMPORARILY DISABLED: The VitePWA plugin is causing the Lovable preview build to crash 
      // (likely due to Workbox minification exceeding memory limits in the cloud container).
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Liberta',
        short_name: 'Liberta',
        description: 'Gerencie suas finanças com propósito',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    }),
    */
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

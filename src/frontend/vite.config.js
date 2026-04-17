import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (development / production).
  // `envDir: __dirname` ensures .env is found next to this config file.
  const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [react()],
    envDir: __dirname,

    // Expose VITE_API_URL at build time so the bundle always has the correct
    // backend URL whether running locally or built on Render.
    define: {
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL ?? '')
    },

    server: {
      port: 3000,
      strictPort: true,
      // Local dev proxy: requests to /api are forwarded to the Spring Boot
      // backend so you can run both on the same origin without CORS issues.
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  };
});

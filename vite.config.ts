import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  assetsInclude: [
    '**/*.PNG',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.webp',
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 8080,
    https: {},
    proxy: {
      '/api': {
        // target: 'https://',
        changeOrigin: true,
        secure: false,
      },
      '/cdn': {
        target: 'https://cdn.esp.ovh',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, '')
      }
    },
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    host: '192.168.1.111',
    port: 8080,
    https: {},
  },
});

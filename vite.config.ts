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
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      '/cdn': {
        target: 'https://cdn.esp.ovh',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Accept', 'application/octet-stream');
          });
        },
      },
    },
  },
  preview: {
    host: '192.168.1.111',
    port: 8080,
    https: {},
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'vendor-antd';
            }
            if (id.includes('lottie-web') || id.includes('pako')) {
              return 'vendor-animations';
            }
            return 'vendor'; // все остальные node_modules
          }
        }
      }
    }
  }
});

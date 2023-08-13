import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';

const proxy = {
  '^/api/': {
    target: 'http://localhost:7000/',
    changeOrigin: true,
  },
};

export default defineConfig({
  server: {
    host: true,
    port: 4444,
    watch: {
      usePolling: true,
    },
    proxy,
  },
  preview: { port: 4445, proxy },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/],
      reactivityTransform: true,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: '[name].[hash].entry.js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: ({ name }) => {
          let extPath = '[ext]';
          if (/\.(gif|jpe?g|png|svg|tiff|bmp|ico)$/.test(name ?? '')) {
            extPath = 'images';
          }
          if (/\.css$/.test(name ?? '')) {
            extPath = 'css';
          }
          if (/\.(woff2?|ttf|eot|otf)$/.test(name ?? '')) {
            extPath = 'fonts';
          }
          return `assets/${extPath}/[name].[hash][extname]`;
        },
      },
    },
  },
})

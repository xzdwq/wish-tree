import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { type ProxyOptions, defineConfig, UserConfig, loadEnv } from 'vite';

export default defineConfig((): UserConfig => {
  process.env = {
    ...process.env,
    ...loadEnv('', path.resolve(__dirname, '..', 'api'), ''),
  };

  const proxy: Record<string, string | ProxyOptions> = {
    '^/api/': {
      target: `http://localhost:${process.env.API_PORT}/`,
      changeOrigin: true,
    },
  };

  return {
    server: {
      host: true,
      port: process.env?.APP_PORT ? +process.env.APP_PORT : 4444,
      watch: {
        usePolling: true,
      },
      proxy,
    },
    preview: {
      port: process.env?.APP_PORT ? +process.env.APP_PORT : 4444,
      proxy,
    },
    envDir: path.resolve(__dirname, '..', 'api'),
    envPrefix: ['APP_', 'OIDC_'],
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
  };
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
// export default defineConfig({
//   server: { port: 7979 },
//   optimizeDeps: {
//     exclude: ['js-big-decimal']
//   },
//   plugins: [react()],
//   resolve: {
//     alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
//   },
//   build: {
//     outDir: process.env.VITE_MODE
//   }
// });

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const dist = `${env.VITE_MODE}`;

  return {
    server: { port: 7979 },
    optimizeDeps: {
      exclude: ['js-big-decimal']
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
    },
    build: {
      outDir: dist
    }
  };
});

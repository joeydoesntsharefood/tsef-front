import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@styles/*": new URL('./src/styles/*', import.meta.url).pathname,
      "@types/*": new URL('./src/types/*', import.meta.url).pathname,
    },
  },
});
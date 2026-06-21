import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 開発サーバーは 5173。バックエンド(3000)へは api.js が絶対URLで直接アクセスし、
// バックエンド側で CORS が有効なためプロキシは不要。
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
});

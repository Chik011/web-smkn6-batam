import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        siswa: resolve(__dirname, 'siswa.html'),
        guru: resolve(__dirname, 'guru.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port: number = parseInt(env.PORT);

  return {
    plugins: [ react(), tailwindcss() ],
    server: {
      watch: {
        usePolling: true,
      },
      host: '0.0.0.0',
      port,
    },
  }
})
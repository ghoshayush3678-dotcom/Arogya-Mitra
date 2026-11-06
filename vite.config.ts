import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function githubPagesPlugin(): Plugin {
  return {
    name: 'github-pages-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      try {
        const indexPath = path.join(distDir, 'index.html');
        const notFoundPath = path.join(distDir, '404.html');
        const nojekyllPath = path.join(distDir, '.nojekyll');

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log('[github-pages-plugin] Copied dist/index.html to dist/404.html');
        }
        fs.writeFileSync(nojekyllPath, '');
        console.log('[github-pages-plugin] Created dist/.nojekyll');
      } catch (err) {
        console.error('[github-pages-plugin] Error preparing GitHub Pages files:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: process.env.VITE_BASE || '/',
    plugins: [react(), tailwindcss(), githubPagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/jspdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('src/assets/embeddedImages')) {
              return 'assets-images';
            }
          },
        },
      },
    },
  };
});


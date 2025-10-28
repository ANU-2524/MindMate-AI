import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // copy manifest.json and icons into dist after build so extension can be loaded
        {
          name: 'copy-manifest-and-icons',
          closeBundle() {
            try {
              const root = process.cwd();
              const manifestSrc = path.join(root, 'manifest.json');
              const outDir = path.join(root, 'dist');
              if (fs.existsSync(manifestSrc) && fs.existsSync(outDir)) {
                fs.copyFileSync(manifestSrc, path.join(outDir, 'manifest.json'));
                const iconsSrc = path.join(root, 'icons');
                if (fs.existsSync(iconsSrc)) {
                  const destIcons = path.join(outDir, 'icons');
                  // Node 16+ supports cpSync
                  if ((fs as any).cpSync) {
                    (fs as any).cpSync(iconsSrc, destIcons, { recursive: true });
                  } else {
                    // Fallback: simple recursive copy
                    const copyRecursive = (src: string, dest: string) => {
                      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                      for (const name of fs.readdirSync(src)) {
                        const srcPath = path.join(src, name);
                        const destPath = path.join(dest, name);
                        const stat = fs.statSync(srcPath);
                        if (stat.isDirectory()) copyRecursive(srcPath, destPath);
                        else fs.copyFileSync(srcPath, destPath);
                      }
                    };
                    copyRecursive(iconsSrc, destIcons);
                  }
                }
              }
            } catch (e) {
              // Do not fail the build because of optional copy step
              // eslint-disable-next-line no-console
              console.warn('copy-manifest-and-icons plugin failed:', e);
            }
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

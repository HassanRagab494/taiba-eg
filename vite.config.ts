import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import sharp from 'sharp';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'optimized-local-images',
        enforce: 'pre',
        apply: 'build',
        async load(id) {
          if (!/\/assets\/images\/.*\.(jpe?g|png)\?url$/.test(id.replace(/\\/g, '/'))) return null;
          const filename = id.slice(0, -4);
          const source = await sharp(filename).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
          const ref = this.emitFile({ type: 'asset', name: path.basename(filename).replace(/\.[^.]+$/, '.webp'), source });
          return `export default import.meta.ROLLUP_FILE_URL_${ref};`;
        },
      },
      react(), tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

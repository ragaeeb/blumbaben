import { defineConfig } from './tools/tsdown/src/index';

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    external: ['react', 'react-dom'],
    format: ['esm'],
    minify: true,
    sourcemap: true,
    target: 'esnext',
});

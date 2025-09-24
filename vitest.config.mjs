import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { URL } from 'url';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['**/node_modules/**', '**/tests-e2e/**'],
    coverage: {
      exclude: [
        'next.config.ts',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'vitest.config.mjs',
        'vitest.setup.ts',
        'eslint.config.mjs',
        'src/app/layout.tsx',
        // Purely structural, often not tested
        'src/app/page.tsx',
        // Often purely structural, can be tested if complex
        'src/app/api/**/*.ts',
        // API routes are tested separately
        'src/lib/api_auth.ts',
        // Auth middleware, tested via API routes
        'src/canon/**',
        // Content files, not code
        'content/**', // Content files, not code
      ],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});

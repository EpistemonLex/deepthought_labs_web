import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { URL } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/tests-e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/*.config.ts',
        '**/*.config.mjs',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/node_modules/**',
        '**/tests-e2e/**',
        '**/coverage/**',
        '**/.next/**',
        '**/.storybook/**',
        '**/playwright-report/**',
        'server.ts',
        'vitest.setup.ts',
        'src/app/layout.tsx',
        'src/lib/api_auth.ts',
        'src/canon/**',
        'content/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});

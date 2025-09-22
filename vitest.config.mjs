import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { URL } from 'url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
    projects: [
      {
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});

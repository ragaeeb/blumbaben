import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const projects = [
    {
        extends: true,
        test: {
            name: 'unit',
        },
    },
];

if (process.env.STORYBOOK_VITEST === 'true') {
    projects.push({
        extends: true,
        plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
            name: 'storybook',
            browser: {
                enabled: true,
                headless: true,
                provider: () => import('@vitest/browser/providers/playwright'),
                instances: [{ browser: 'chromium' }],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
        },
    });
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            '@testing-library/react': path.join(dirname, 'tools/testing-library-react/index.tsx'),
        },
    },
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
        },
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        mockReset: true,
        restoreMocks: true,
        setupFiles: ['vitest.setup.ts'],
        projects,
    },
});

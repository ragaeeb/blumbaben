import { afterEach } from 'vitest';

const { cleanup } = await import('@testing-library/react');

afterEach(() => {
    cleanup();
});

await import('@testing-library/jest-dom/vitest');

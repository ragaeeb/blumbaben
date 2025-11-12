# Contributor Guidance

Welcome! Please follow these conventions when working anywhere in this repository:

1. **Tooling**
   - Format and lint with Biome (`bun run format` / `bun run lint`) before sending changes whenever possible.
   - Prefer `import type` for type-only imports in TypeScript/TSX files.
   - Keep tests colocated in `src/**/__tests__` or `src/__tests__` using Vitest.

2. **Testing**
   - Add high-value unit tests with Vitest and the lightweight testing utilities in `tools/testing-library-react` when modifying logic.
   - Run `bun test`, `bun run build`, and `bun run build-storybook` to verify the project before opening a PR.

3. **Build system**
   - Library builds rely on the custom `tsdown` tool defined in `tools/tsdown`. Update `tsdown.config.ts` if entry points or externals change.

4. **Documentation**
   - Update `README.md` when user-facing behaviour changes.

Thanks for contributing!

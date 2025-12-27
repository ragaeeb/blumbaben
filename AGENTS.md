# AGENTS.md - AI Agent Guidance for blumbaben

## Project Overview

**blumbaben** is a lightweight TypeScript React hook library for adding contextual formatting toolbars to text inputs and textareas. The library uses a global state pattern to manage a single shared toolbar instance across all inputs in an application.

- **GitHub**: [ragaeeb/blumbaben](https://github.com/ragaeeb/blumbaben)
- **NPM**: [blumbaben](https://www.npmjs.com/package/blumbaben)
- **Live Demo**: [blumbaben.vercel.app](https://blumbaben.vercel.app) (Storybook showcase)
- **License**: MIT

### Core Purpose

The library enables developers to:
1. Show contextual formatting toolbars when users focus on input/textarea elements
2. Apply text transformations (uppercase, bold, markdown formatting, etc.) to selected text or entire content
3. Manage toolbar visibility and positioning automatically via a global singleton pattern

---

## Repository Structure

```
blumbaben/
├── .github/
│   └── workflows/
│       ├── build.yml          # CI workflow: test, build, coverage upload
│       └── publish.yml        # Semantic release to npm
├── .storybook/                # Storybook configuration
│   ├── main.ts               # Storybook main config
│   ├── preview.ts            # Preview settings
│   └── vitest.setup.ts       # Vitest browser test setup
├── src/
│   ├── index.ts              # Public API exports
│   ├── types.ts              # TypeScript type definitions
│   ├── formatting-toolbar.tsx # FormattingToolbar React component
│   ├── withFormattingToolbar.ts # Higher-order component (HOC)
│   ├── hooks/
│   │   ├── useFormattingToolbar.ts      # Main hook with full functionality
│   │   └── useFormattingToolbarState.ts # Lightweight state-only hook
│   ├── utils/
│   │   ├── domUtils.ts       # DOM utilities for text manipulation
│   │   ├── domUtils.test.ts  # Unit tests for domUtils
│   │   └── globalToolbarManager.ts # Global singleton state manager
│   └── stories/
│       ├── FormattingToolbar.stories.tsx # Storybook stories
│       └── FormattingToolbarDocs.mdx     # Storybook docs
├── biome.json                # Biome linter/formatter config
├── bun.lock                  # Bun lockfile
├── package.json              # Package manifest
├── tsconfig.json             # TypeScript config
├── tsdown.config.ts          # Build config (tsdown bundler)
├── vitest.config.ts          # Vitest test config
├── vercel.json               # Vercel deployment config
├── release.config.mjs        # Semantic release config
├── README.md                 # User documentation
└── LICENSE.md                # MIT license
```

---

## Technology Stack

| Category | Technology | Details |
|----------|------------|---------|
| **Runtime** | Bun | Primary package manager and test runner |
| **Language** | TypeScript | Strict mode enabled, ESNext target |
| **Framework** | React 19 | Peer dependency, uses hooks |
| **Build** | tsdown | ESM output, minified, with source maps |
| **Testing** | Vitest + Playwright | Browser-based Storybook tests |
| **Linting** | Biome | Replaces ESLint + Prettier |
| **CI/CD** | GitHub Actions | Build, test, semantic-release |
| **Docs** | Storybook 10 | Component showcase and visual testing |
| **Deployment** | Vercel | Storybook hosted at blumbaben.vercel.app |

---

## Coding Conventions

### Code Style (enforced by Biome)

- **Indentation**: 4 spaces
- **Line width**: 120 characters max
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Always required
- **Trailing commas**: Always (`all`)
- **Arrow parens**: Always (`(x) => ...`)
- **Bracket spacing**: `{ x }` not `{x}`

### Naming Conventions

- **Files**: `camelCase.ts` or `camelCase.tsx` for components
- **Components**: PascalCase (`FormattingToolbar`)
- **Hooks**: `useCamelCase` prefix
- **Types**: PascalCase, prefer `type` over `interface`
- **Constants**: camelCase (not SCREAMING_CASE)

### Import Organization

Biome automatically organizes imports. The order is:
1. External packages
2. Internal modules (using `@/` path alias)
3. Relative imports

```typescript
import { useCallback, useEffect, useState } from 'react';

import type { FormatterFunction, ToolbarState } from '@/types';

import { globalToolbarManager } from '@/utils/globalToolbarManager';
```

### TypeScript Patterns

- **Path alias**: Use `@/` for `./src/*` imports
- **React JSX transform**: `react-jsx` (no React import needed)
- **Strict mode**: Enabled
- **Type exports**: Export types explicitly via `export type`

### Documentation

- All public APIs must have **JSDoc comments** with:
  - Description
  - `@param` for parameters
  - `@returns` description
  - `@example` with code blocks

Example:
```typescript
/**
 * Applies a formatting function to either selected text or entire content.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} element - The target element
 * @param {(text: string) => string} formatter - Transformation function
 * @returns {string} The formatted text
 *
 * @example
 * ```typescript
 * const result = applyFormattingOnSelection(textarea, text => text.toUpperCase());
 * ```
 */
```

---

## Architecture & Key Concepts

### Global State Pattern

The library uses a **singleton pattern** via `globalToolbarManager` to ensure only one toolbar is visible at a time:

```
┌─────────────────────┐     subscribes     ┌────────────────────┐
│  Input A            │──────────────────▶│                    │
│  (useFormattingToolbar)                 │ globalToolbarManager│
├─────────────────────┤                   │  (singleton)        │
│  Input B            │──────────────────▶│                    │
│  (useFormattingToolbar)                 └────────────────────┘
├─────────────────────┤                            │
│  FormattingToolbar  │◀───────────────────────────┘
│  (component)        │         state updates
└─────────────────────┘
```

### Key Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `globalToolbarManager.ts` | Singleton state manager; handles show/hide, scheduling, subscriptions |
| `useFormattingToolbar.ts` | Full hook; creates input props, subscribes to state |
| `useFormattingToolbarState.ts` | Lightweight hook; state subscription only (for toolbar components) |
| `FormattingToolbar.tsx` | Ready-to-use component with positioning |
| `withFormattingToolbar.ts` | HOC for wrapping existing input components |
| `domUtils.ts` | Pure utilities for text selection and element updates |
| `types.ts` | All TypeScript type definitions |

### Public API (`src/index.ts`)

```typescript
export * from './formatting-toolbar';      // FormattingToolbar component
export * from './hooks/useFormattingToolbar'; // Main hook
export * from './types';                   // All types
export * from './utils/domUtils';          // DOM utilities
export * from './withFormattingToolbar';   // HOC
```

---

## Development Workflow

### Prerequisites

- **Bun** (latest): Primary package manager and runtime
- **Node.js 18+**: For GitHub Actions compatibility

### Common Commands

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run tests (with coverage)
bun run test

# Start Storybook dev server
bun run storybook

# Build Storybook for deployment
bun run build-storybook

# Lint code
bun run lint

# Format code
bun run format
```

### Build Output

The library builds to `dist/` with:
- `index.js` - ESM bundle (minified)
- `index.d.ts` - TypeScript declarations
- `index.js.map` - Source maps

### Testing Strategy

1. **Unit Tests**: Located alongside source files as `*.test.ts`
2. **Storybook Tests**: Browser-based tests via `@storybook/addon-vitest`
3. **Visual Testing**: Storybook stories serve as visual regression tests

Test files use Bun's test runner with Jest-compatible APIs:
```typescript
import { describe, expect, it, jest, spyOn } from 'bun:test';
```

---

## CI/CD Pipeline

### Build Workflow (`.github/workflows/build.yml`)

Triggers on: Push/PR to `main`

1. Checkout code
2. Setup Bun
3. Install dependencies (frozen lockfile)
4. Build project
5. Run tests
6. Upload coverage to Codecov

### Publish Workflow (`.github/workflows/publish.yml`)

Triggers on: Push to `main`

1. Checkout code
2. Setup Bun
3. Install dependencies
4. Build project
5. Run `semantic-release` (auto-version, changelog, npm publish)

### Versioning

Uses **semantic-release** with conventional commits:
- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` → major version bump

---

## Guidelines for AI Agents

### When Modifying Code

1. **Run linting** after changes: `bun run lint`
2. **Run tests** to verify: `bun run test`
3. **Build** to catch TypeScript errors: `bun run build`
4. **Update JSDoc** for any public API changes

### When Adding Features

1. Add types to `src/types.ts` if new types are needed
2. Export new functionality in `src/index.ts`
3. Add unit tests in corresponding `*.test.ts` file
4. Consider adding a Storybook story for visual features
5. Update README.md for user-facing changes

### When Fixing Bugs

1. Write a failing test first (if possible)
2. Fix the bug
3. Verify the test passes
4. Check for similar issues elsewhere in the codebase

### Common Patterns to Follow

**Adding a new utility function:**
```typescript
// src/utils/newUtil.ts
/**
 * Description of what this does.
 *
 * @param {ParamType} param - Description
 * @returns {ReturnType} Description
 */
export const myNewUtil = (param: ParamType): ReturnType => {
    // implementation
};
```

**Adding tests:**
```typescript
// src/utils/newUtil.test.ts
import { describe, expect, it } from 'bun:test';
import { myNewUtil } from './newUtil';

describe('myNewUtil', () => {
    it('should do something specific', () => {
        expect(myNewUtil(input)).toBe(expected);
    });
});
```

### Things to Avoid

- ❌ Don't use `require()` - this is an ESM-only project
- ❌ Don't import React in components (uses new JSX transform)
- ❌ Don't modify `dist/` directly - it's generated
- ❌ Don't skip type annotations for public APIs
- ❌ Don't use `any` type (though the linter rule is disabled, prefer proper types)

---

## Useful Context

### The "Formatter Function" Pattern

The core pattern of this library is the `FormatterFunction`:

```typescript
type FormatterFunction = (text: string) => string;
```

Users create simple functions that transform text:
```typescript
const bold = (text: string) => `**${text}**`;
const uppercase = (text: string) => text.toUpperCase();
```

These are applied via `applyFormat(formatter)`, which:
1. Gets the currently focused element from global state
2. Extracts selected text (or all text if no selection)
3. Applies the formatter function
4. Updates the element's value
5. Dispatches events for React state sync

### Why Global State?

The singleton pattern ensures:
- Only one toolbar visible at a time (UX requirement)
- No prop drilling needed
- Components can be placed anywhere in the tree
- Separation between input handling and toolbar rendering

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Types not resolving | Check `@/` path alias is configured |
| Tests failing in CI | Verify Playwright browsers are installed |
| Build errors | Run `bun install` to sync dependencies |
| Storybook not loading | Clear `.cache` and rebuild |

---

## Contact

- **Author**: Ragaeeb Haq
- **Issues**: https://github.com/ragaeeb/blumbaben/issues
- **Project Name Origin**: Named by Asmāʾ

# blumbaben

A lightweight TypeScript React hook library for adding formatting toolbars to text inputs and textareas. Show contextual formatting options when users focus on input fields.

🔭 Explore the live Storybook showcase at [blumbaben.vercel.app](https://blumbaben.vercel.app).

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/f3f86e51-f640-45b9-b5c1-8612a6c8b84c.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/f3f86e51-f640-45b9-b5c1-8612a6c8b84c)
[![codecov](https://codecov.io/gh/ragaeeb/blumbaben/graph/badge.svg?token=Y0VF63CGJM)](https://codecov.io/gh/ragaeeb/blumbaben)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
[![Node.js CI](https://github.com/ragaeeb/blumbaben/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/blumbaben/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/blumbaben)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/blumbaben)
[![Size](https://deno.bundlejs.com/badge?q=blumbaben@latest&badge=detailed)](https://bundlejs.com/?q=blumbaben%40latest)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![npm](https://img.shields.io/npm/dm/blumbaben)
![GitHub issues](https://img.shields.io/github/issues/ragaeeb/blumbaben)
![GitHub stars](https://img.shields.io/github/stars/ragaeeb/blumbaben?style=social)
[![npm version](https://badge.fury.io/js/blumbaben.svg)](https://badge.fury.io/js/blumbaben)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎯 Global State Management** - Single toolbar instance shared across all inputs
- **📱 Smart Positioning** - Automatic toolbar positioning with customizable placement
- **🎨 Flexible Styling** - Bring your own UI components and styles
- **⚡ TypeScript Support** - Full type safety and excellent DX
- **🪶 Lightweight** - Minimal bundle size with no external dependencies
- **🔧 Configurable** - Customizable behavior and positioning
- **♿ Accessible** - Built with accessibility in mind

## 📦 Installation

```bash
npm install blumbaben
```

```bash
bun add blumbaben
```

```bash
pnpm add blumbaben
```

## 🚀 Quick Start

### Basic Usage with Hook

```tsx
import React, { useState } from 'react';
import { useFormattingToolbar } from 'blumbaben';

function MyComponent() {
    const [content, setContent] = useState('');
    const { getInputProps, isVisible, applyFormat } = useFormattingToolbar();

    return (
        <div>
            <textarea
                {...getInputProps()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Focus me to see the toolbar!"
            />

            {isVisible && (
                <div className="toolbar">
                    <button onClick={() => applyFormat((text) => text.toUpperCase())}>UPPERCASE</button>
                    <button onClick={() => applyFormat((text) => `**${text}**`)}>Bold</button>
                </div>
            )}
        </div>
    );
}
```

### Using the FormattingToolbar Component

```tsx
import React, { useState } from 'react';
import { useFormattingToolbar, FormattingToolbar } from 'blumbaben';

function MyComponent() {
    const [content, setContent] = useState('');
    const { getInputProps } = useFormattingToolbar();

    return (
        <div>
            <textarea
                {...getInputProps()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Focus me to see the toolbar!"
            />

            <FormattingToolbar>
                {(applyFormat) => (
                    <div className="flex gap-2 p-2 bg-white border rounded shadow">
                        <button
                            onClick={() => applyFormat((text) => text.toUpperCase())}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            UPPERCASE
                        </button>
                        <button
                            onClick={() => applyFormat((text) => `**${text}**`)}
                            className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => applyFormat((text) => text.replace(/\n/g, ' '))}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                            Remove Line Breaks
                        </button>
                    </div>
                )}
            </FormattingToolbar>
        </div>
    );
}
```

### Using the Higher-Order Component

```tsx
import React, { useState } from 'react';
import { withFormattingToolbar, FormattingToolbar } from 'blumbaben';

// Enhance your existing textarea component
const MyTextarea = ({ value, onChange, ...props }) => <textarea value={value} onChange={onChange} {...props} />;

const TextareaWithToolbar = withFormattingToolbar(MyTextarea);

function App() {
    const [content, setContent] = useState('');

    return (
        <div>
            <TextareaWithToolbar
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Focus me to see the toolbar!"
            />

            <FormattingToolbar>
                {(applyFormat) => (
                    <div className="toolbar-buttons">
                        <button onClick={() => applyFormat((text) => text.toUpperCase())}>UPPERCASE</button>
                        <button onClick={() => applyFormat((text) => text.toLowerCase())}>lowercase</button>
                    </div>
                )}
            </FormattingToolbar>
        </div>
    );
}
```

## 🔧 Configuration

### Toolbar Configuration Options

```tsx
interface ToolbarConfig {
    // Custom positioning function
    getPosition?: (element: TextInputElement) => ToolbarPosition;

    // Delay before hiding toolbar after blur (ms)
    hideDelay?: number; // default: 500

    // Prevent toolbar from closing when clicked
    preventCloseOnClick?: boolean; // default: true
}
```

### Custom Positioning

```tsx
const { getInputProps, isVisible, applyFormat } = useFormattingToolbar({
    getPosition: (element) => {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top - 50, // Position above the element
        };
    },
    hideDelay: 300,
    preventCloseOnClick: true,
});
```

### Styling the Toolbar

```tsx
<FormattingToolbar
  className="my-custom-toolbar"
  style={{
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px'
  }}
>
  {(applyFormat) => (
    // Your toolbar content
  )}
</FormattingToolbar>
```

## 📚 API Reference

### Hooks

#### `useFormattingToolbar(config?: ToolbarConfig)`

Main hook for managing toolbar functionality.

**Returns:**

- `getInputProps()` - Props to spread on input/textarea elements
- `getToolbarProps()` - Props for toolbar container (includes positioning)
- `applyFormat(formatter)` - Apply formatting to active element
- `showToolbar(element)` - Manually show toolbar
- `hideToolbar()` - Manually hide toolbar
- `isVisible` - Whether toolbar is visible
- `toolbarState` - Current toolbar state

#### `useFormattingToolbarState()`

Lightweight hook for toolbar-only components that don't handle input events.

**Returns:**

- `applyFormat(formatter)` - Apply formatting to active element
- `isVisible` - Whether toolbar is visible
- `toolbarState` - Current toolbar state

### Components

#### `FormattingToolbar`

Renders the toolbar when an input is focused.

**Props:**

- `children` - Render function receiving `applyFormat` callback
- `as?` - Container element type (default: 'div')
- `className?` - CSS class name
- `config?` - Toolbar configuration
- `style?` - Inline styles

#### `withFormattingToolbar(Component, config?)`

Higher-order component that adds toolbar functionality to input components.

### Types

```tsx
type FormatterFunction = (text: string) => string;

type TextInputElement = HTMLInputElement | HTMLTextAreaElement;

type ToolbarPosition = {
    x: number;
    y: number;
};

type ToolbarState = {
    activeElement: TextInputElement | null;
    isVisible: boolean;
    position: ToolbarPosition | null;
};
```

## 💡 Common Formatting Functions

Here are some useful formatting functions you can use:

```tsx
// Text transformations
const toUpperCase = (text: string) => text.toUpperCase();
const toLowerCase = (text: string) => text.toLowerCase();
const toTitleCase = (text: string) =>
    text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Markdown formatting
const makeBold = (text: string) => `**${text}**`;
const makeItalic = (text: string) => `*${text}*`;
const makeCode = (text: string) => `\`${text}\``;

// Text cleaning
const removeLineBreaks = (text: string) => text.replace(/\n/g, ' ');
const trimWhitespace = (text: string) => text.trim();
const removeExtraSpaces = (text: string) => text.replace(/\s+/g, ' ');

// Usage
<button onClick={() => applyFormat(makeBold)}>Bold</button>;
```

## 🎨 Styling Examples

### With Tailwind CSS

```tsx
<FormattingToolbar className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
    {(applyFormat) => (
        <div className="flex gap-1">
            <button
                onClick={() => applyFormat(toUpperCase)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ABC
            </button>
            <button
                onClick={() => applyFormat(toLowerCase)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
                abc
            </button>
        </div>
    )}
</FormattingToolbar>
```

### With CSS Modules

```css
/* styles.module.css */
.toolbar {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 8px;
}

.toolbarButton {
    padding: 4px 12px;
    margin-right: 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.toolbarButton:hover {
    background-color: #f1f5f9;
}
```

```tsx
import styles from './styles.module.css';

<FormattingToolbar className={styles.toolbar}>
    {(applyFormat) => (
        <div>
            <button className={styles.toolbarButton} onClick={() => applyFormat(makeBold)}>
                Bold
            </button>
        </div>
    )}
</FormattingToolbar>;
```

## 🔍 Advanced Usage

### Multiple Input Fields

The library automatically manages a single toolbar across multiple inputs:

```tsx
function MultiInputForm() {
    const { getInputProps } = useFormattingToolbar();
    const [field1, setField1] = useState('');
    const [field2, setField2] = useState('');

    return (
        <div>
            <input
                {...getInputProps()}
                value={field1}
                onChange={(e) => setField1(e.target.value)}
                placeholder="First field"
            />

            <textarea
                {...getInputProps()}
                value={field2}
                onChange={(e) => setField2(e.target.value)}
                placeholder="Second field"
            />

            <FormattingToolbar>
                {(applyFormat) => (
                    <div>
                        <button onClick={() => applyFormat(toUpperCase)}>UPPERCASE</button>
                    </div>
                )}
            </FormattingToolbar>
        </div>
    );
}
```

### Custom Formatter with Selection

```tsx
const wrapWithQuotes = (text: string) => `"${text}"`;
const addPrefix = (text: string) => `• ${text}`;

// The library automatically handles whether text is selected or not
<button onClick={() => applyFormat(wrapWithQuotes)}>Add Quotes</button>;
```

### Conditional Toolbar Content

```tsx
<FormattingToolbar>
    {(applyFormat) => {
        const { activeElement } = useFormattingToolbarState().toolbarState;
        const isTextarea = activeElement?.tagName === 'TEXTAREA';

        return (
            <div>
                <button onClick={() => applyFormat(toUpperCase)}>UPPERCASE</button>
                {isTextarea && <button onClick={() => applyFormat(removeLineBreaks)}>Remove Line Breaks</button>}
            </div>
        );
    }}
</FormattingToolbar>
```

## 🧪 Development

This project is built with [Bun](https://bun.sh). Install dependencies and run the following scripts to work locally:

```bash
bun install
```

### Key scripts

- `bun run build` &mdash; bundles the library using the custom [`tsdown`](./tsdown.config.ts) configuration and emits type declarations.
- `bun test` &mdash; runs the Vitest suite, including unit tests powered by `@testing-library/react`/`@testing-library/dom` and Storybook checks.
- `bun run build-storybook` &mdash; generates the static Storybook showcase.

Testing helpers that mimic `@testing-library/react` live in [`tools/testing-library-react`](./tools/testing-library-react) to keep unit tests lightweight in this Bun environment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and React
- Inspired by modern text editing interfaces
- Designed for developer experience and flexibility
- Asmāʾ for the project name

---

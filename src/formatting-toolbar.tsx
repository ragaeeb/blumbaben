import React, { type JSX } from 'react';

import type { FormatterFunction, ToolbarConfig } from './types';

import { useFormattingToolbarState } from './hooks/useFormattingToolbarState';

/**
 * Props for the FormattingToolbar component.
 *
 * @interface FormattingToolbarProps
 */
type FormattingToolbarProps = {
    /**
     * Container element type for the toolbar.
     * Can be any valid HTML element tag name.
     *
     * @default 'div'
     */
    as?: keyof JSX.IntrinsicElements;

    /**
     * Render function that receives the applyFormat callback.
     * Use this function to render your toolbar buttons and controls.
     *
     * @param {(formatter: FormatterFunction) => void} applyFormat - Function to apply text formatting
     * @returns {React.ReactNode} The toolbar content to render
     */
    children: (applyFormat: (formatter: FormatterFunction) => void) => React.ReactNode;

    /**
     * Custom CSS class name for styling the toolbar container.
     */
    className?: string;

    /**
     * Toolbar configuration options.
     * Merged with default configuration.
     */
    config?: ToolbarConfig;

    /**
     * Custom inline styles for the toolbar container.
     * These styles are merged with the positioning styles (position, top, left, zIndex).
     */
    style?: React.CSSProperties;
};

/**
 * Formatting toolbar component that renders when an input is focused.
 * Automatically uses the global toolbar state - no need to pass a toolbar instance.
 * Only renders when the global toolbar is visible and has a position.
 *
 * The toolbar automatically positions itself relative to the focused input element
 * and provides an applyFormat function to child components for text transformation.
 *
 * @param {FormattingToolbarProps} props - Component props
 * @returns {React.ReactElement | null} The toolbar element or null if not visible
 *
 * @example
 * ```typescript
 * import { FormattingToolbar } from 'blumbaben';
 * import { Button } from './ui/button';
 *
 * function App() {
 *   return (
 *     <div>
 *       <textarea {...getInputProps()} />
 *
 *       <FormattingToolbar className="my-toolbar" as="section">
 *         {(applyFormat) => (
 *           <>
 *             <Button onClick={() => applyFormat(text => text.toUpperCase())}>
 *               UPPERCASE
 *             </Button>
 *             <Button onClick={() => applyFormat(text => `**${text}**`)}>
 *               Bold
 *             </Button>
 *             <Button onClick={() => applyFormat(text => text.replace(/\n/g, ' '))}>
 *               Remove Line Breaks
 *             </Button>
 *           </>
 *         )}
 *       </FormattingToolbar>
 *     </div>
 *   );
 * }
 * ```
 */
export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
    as: Component = 'div',
    children,
    className = '',
    config = {},
    style = {},
}) => {
    const { applyFormat, toolbarState } = useFormattingToolbarState();
    const { preventCloseOnClick = true } = config;

    if (!toolbarState.isVisible || !toolbarState.position) {
        return null;
    }

    const handleMouseDown = preventCloseOnClick
        ? (e: React.MouseEvent) => {
              e.preventDefault(); // Prevent blur event when clicking toolbar
          }
        : undefined;

    return React.createElement(
        Component,
        {
            className,
            onMouseDown: handleMouseDown,
            style: {
                left: toolbarState.position.x,
                position: 'fixed',
                top: toolbarState.position.y,
                zIndex: 1000,
                ...style,
            },
        },
        children(applyFormat),
    );
};

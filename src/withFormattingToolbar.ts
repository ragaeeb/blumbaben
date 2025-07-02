import React, { forwardRef } from 'react';

import type { TextInputElement, ToolbarConfig } from './types';

import { useFormattingToolbar } from './hooks/useFormattingToolbar';

/**
 * Higher-order component that adds formatting toolbar functionality to input components.
 * Since the library uses global state, all wrapped components automatically share the same toolbar.
 * Only one toolbar will be visible at a time, appearing for whichever input is currently focused.
 *
 * @template P - The props type of the wrapped component
 * @param {React.ComponentType<P>} Component - The input component to enhance with toolbar functionality
 * @param {ToolbarConfig} [config={}] - Optional configuration for toolbar behavior
 * @returns {React.ForwardRefExoticComponent} Enhanced component with toolbar functionality
 *
 * @example
 * ```typescript
 * import { Textarea } from './ui/textarea';
 * import { withFormattingToolbar } from 'blumbaben';
 *
 * const TextareaWithToolbar = withFormattingToolbar(Textarea, {
 *   hideDelay: 300,
 *   getPosition: (element) => {
 *     const rect = element.getBoundingClientRect();
 *     return { x: rect.left, y: rect.top - 50 }; // Above the element
 *   }
 * });
 *
 * // Usage
 * <TextareaWithToolbar
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Start typing..."
 * />
 * ```
 */
export const withFormattingToolbar = <P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    config: ToolbarConfig = {},
) => {
    const WrappedComponent = forwardRef<TextInputElement, P>((props, ref) => {
        // All instances share the same global toolbar state
        const { getInputProps } = useFormattingToolbar(config);
        const toolbarProps = getInputProps();

        const handleFocusEvent = (e: React.FocusEvent<TextInputElement>) => {
            toolbarProps.onFocus(e);
            if (props.onFocus && typeof props.onFocus === 'function') {
                props.onFocus(e);
            }
        };

        const handleBlurEvent = (e: React.FocusEvent<TextInputElement>) => {
            toolbarProps.onBlur(e);
            if (props.onBlur && typeof props.onBlur === 'function') {
                props.onBlur(e);
            }
        };

        const enhancedProps = {
            ...props,
            onBlur: handleBlurEvent,
            onFocus: handleFocusEvent,
            ref,
        } as P & { ref: React.ForwardedRef<TextInputElement> };

        return React.createElement(Component, enhancedProps);
    });

    WrappedComponent.displayName = `withFormattingToolbar(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

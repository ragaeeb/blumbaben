import { useCallback, useEffect, useState } from 'react';

import type { FormatterFunction, TextInputElement, ToolbarConfig, ToolbarState } from '@/types';

import { globalToolbarManager } from '@/utils/globalToolbarManager';

/**
 * Default positioning function that places the toolbar below the focused element.
 *
 * @param {TextInputElement} element - The focused input or textarea element
 * @returns {ToolbarPosition} Position coordinates for the toolbar
 */
const defaultGetPosition = (element: TextInputElement) => {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.bottom + 5,
    };
};

/**
 * Return type for the useFormattingToolbar hook containing all toolbar functionality.
 *
 * @interface UseFormattingToolbarResult
 */
type UseFormattingToolbarResult = {
    /**
     * Apply formatting to the currently active element.
     *
     * @param {FormatterFunction} formatter - Function to transform the selected or entire text
     */
    applyFormat: (formatter: FormatterFunction) => void;

    /**
     * Props to spread on your input/textarea components.
     * Includes onFocus and onBlur handlers for toolbar management.
     *
     * @returns {object} Props object with focus and blur handlers
     */
    getInputProps: () => {
        onBlur: (e: React.FocusEvent<TextInputElement>) => void;
        onFocus: (e: React.FocusEvent<TextInputElement>) => void;
    };

    /**
     * Props for the toolbar container element.
     * Includes positioning styles and optional mouse event handlers.
     *
     * @returns {object} Props object with styles and event handlers
     */
    getToolbarProps: () => {
        onMouseDown?: (e: React.MouseEvent) => void;
        style: React.CSSProperties;
    };

    /** Function to manually hide the toolbar */
    hideToolbar: () => void;

    /** Whether the toolbar is currently visible */
    isVisible: boolean;

    /**
     * Function to manually show the toolbar for a specific element.
     *
     * @param {TextInputElement} element - The element to show the toolbar for
     */
    showToolbar: (element: TextInputElement) => void;

    /** Current toolbar state (shared globally across all instances) */
    toolbarState: ToolbarState;
};

/**
 * Hook for managing formatting toolbar functionality.
 * Uses global state so all instances share the same toolbar - only one toolbar
 * can be visible at a time across the entire application.
 *
 * @param {ToolbarConfig} [config={}] - Optional configuration for toolbar behavior
 * @returns {UseFormattingToolbarResult} Object containing toolbar state and control functions
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { getInputProps, isVisible, applyFormat } = useFormattingToolbar({
 *     hideDelay: 300,
 *     getPosition: (element) => ({ x: 100, y: 200 })
 *   });
 *
 *   return (
 *     <div>
 *       <textarea {...getInputProps()} />
 *       {isVisible && (
 *         <div>
 *           <button onClick={() => applyFormat(text => text.toUpperCase())}>
 *             UPPERCASE
 *           </button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useFormattingToolbar = (config: ToolbarConfig = {}): UseFormattingToolbarResult => {
    const { getPosition = defaultGetPosition, hideDelay = 500, preventCloseOnClick = true } = config;

    // Subscribe to global toolbar state
    const [toolbarState, setToolbarState] = useState<ToolbarState>(globalToolbarManager.getState());

    useEffect(() => {
        const unsubscribe = globalToolbarManager.subscribe(setToolbarState);
        return unsubscribe;
    }, []);

    const showToolbar = useCallback(
        (element: TextInputElement) => {
            globalToolbarManager.showToolbar(element, getPosition);
        },
        [getPosition],
    );

    const hideToolbar = useCallback(() => {
        globalToolbarManager.hideToolbar();
    }, []);

    const handleFocus = useCallback(
        (e: React.FocusEvent<TextInputElement>) => {
            showToolbar(e.currentTarget);
        },
        [showToolbar],
    );

    const handleBlur = useCallback(() => {
        globalToolbarManager.scheduleHide(hideDelay);
    }, [hideDelay]);

    const applyFormat = useCallback((formatter: FormatterFunction) => {
        globalToolbarManager.applyFormat(formatter);
    }, []);

    const getInputProps = useCallback(
        () => ({
            onBlur: handleBlur,
            onFocus: handleFocus,
        }),
        [handleFocus, handleBlur],
    );

    const getToolbarProps = useCallback(
        () => ({
            style: {
                left: toolbarState.position?.x ?? 0,
                position: 'fixed' as const,
                top: toolbarState.position?.y ?? 0,
                zIndex: 1000,
            },
            ...(preventCloseOnClick && {
                onMouseDown: (e: React.MouseEvent) => {
                    e.preventDefault(); // Prevent blur event when clicking toolbar
                    globalToolbarManager.cancelScheduledHide();
                },
            }),
        }),
        [toolbarState.position, preventCloseOnClick],
    );

    return {
        applyFormat,
        getInputProps,
        getToolbarProps,
        hideToolbar,
        isVisible: toolbarState.isVisible,
        showToolbar,
        toolbarState,
    };
};

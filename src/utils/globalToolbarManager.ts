import type React from 'react';

import type { FormatterFunction, TextInputElement, ToolbarPosition, ToolbarState } from '@/types';

import { applyFormattingOnSelection, updateElementValue } from './domUtils';

/**
 * Default positioning function that places the toolbar below the focused element.
 * Positions the toolbar 5 pixels below the bottom edge of the element, aligned to the left.
 *
 * @param {TextInputElement} element - The focused input or textarea element
 * @returns {ToolbarPosition} Position coordinates with toolbar below the element
 */
const defaultGetPosition = (element: TextInputElement): ToolbarPosition => {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.bottom + 5,
    };
};

/**
 * Interface defining the contract for managing global toolbar state.
 * Provides methods for showing/hiding the toolbar and applying formatting.
 *
 * @interface ToolbarStateManager
 */
type ToolbarStateManager = {
    /**
     * Apply a formatting function to the currently active element.
     *
     * @param {FormatterFunction} formatter - Function to transform the text
     * @param {(e: React.ChangeEvent<TextInputElement>) => void} [onChange] - Optional change handler
     */
    applyFormat(
        formatter: FormatterFunction,
        onChange?: (e: React.ChangeEvent<TextInputElement>) => void,
    ): void;

    /** Cancel any scheduled toolbar hide operation */
    cancelScheduledHide(): void;

    /** Get the current toolbar state */
    getState(): ToolbarState;

    /** Immediately hide the toolbar */
    hideToolbar(): void;

    /**
     * Schedule the toolbar to hide after a delay.
     *
     * @param {number} delay - Delay in milliseconds
     */
    scheduleHide(delay: number): void;

    /**
     * Show the toolbar for a specific element.
     *
     * @param {TextInputElement} element - The element to show the toolbar for
     * @param {(element: TextInputElement) => ToolbarPosition} getPosition - Function to determine toolbar position
     */
    showToolbar(
        element: TextInputElement,
        getPosition: (element: TextInputElement) => ToolbarPosition,
    ): void;

    /**
     * Subscribe to toolbar state changes.
     *
     * @param {(state: ToolbarState) => void} callback - Function called when state changes
     * @returns {() => void} Unsubscribe function
     */
    subscribe(callback: (state: ToolbarState) => void): () => void;
};

/**
 * Global toolbar state manager - single source of truth for all formatting toolbars.
 * Implements the singleton pattern to ensure only one toolbar is visible at a time
 * across the entire application.
 *
 * @class GlobalToolbarManager
 * @implements {ToolbarStateManager}
 */
class GlobalToolbarManager implements ToolbarStateManager {
    private activeElementOnChange: ((e: React.ChangeEvent<TextInputElement>) => void) | undefined;

    private hideTimeout: NodeJS.Timeout | null = null;
    private state: ToolbarState = {
        activeElement: null,
        isVisible: false,
        position: null,
    };
    private subscribers: Set<(state: ToolbarState) => void> = new Set();

    applyFormat(
        formatter: FormatterFunction,
        onChange?: (e: React.ChangeEvent<TextInputElement>) => void,
    ): void {
        const { activeElement } = this.state;

        if (!activeElement) {
            console.warn('No active element found for formatting');
            return;
        }

        const newValue = applyFormattingOnSelection(activeElement, formatter);

        // Use provided onChange or the stored one from the element
        const onChangeHandler = onChange || this.activeElementOnChange;
        updateElementValue(activeElement, newValue, onChangeHandler);

        // Keep focus on the element after formatting
        activeElement.focus();
    }

    cancelScheduledHide(): void {
        this.clearHideTimeout();
    }

    getState(): ToolbarState {
        return { ...this.state };
    }

    hideToolbar(): void {
        this.clearHideTimeout();
        this.activeElementOnChange = undefined;
        this.setState({
            activeElement: null,
            isVisible: false,
            position: null,
        });
    }

    scheduleHide(delay: number): void {
        this.clearHideTimeout();
        this.hideTimeout = setTimeout(() => this.hideToolbar(), delay);
    }

    showToolbar(
        element: TextInputElement,
        getPosition: (element: TextInputElement) => ToolbarPosition = defaultGetPosition,
    ): void {
        this.clearHideTimeout();

        // Store the onChange handler from the element for later use
        const elementWithProps = element as TextInputElement & {
            props?: {
                onChange?: (e: React.ChangeEvent<TextInputElement>) => void;
            };
        };
        this.activeElementOnChange = elementWithProps.props?.onChange;

        this.setState({
            activeElement: element,
            isVisible: true,
            position: getPosition(element),
        });
    }

    subscribe(callback: (state: ToolbarState) => void): () => void {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private clearHideTimeout(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    private setState(newState: Partial<ToolbarState>): void {
        this.state = { ...this.state, ...newState };
        this.subscribers.forEach((callback) => {
            callback(this.getState());
        });
    }
}

/**
 * Global singleton instance of the toolbar manager.
 * This instance is shared across all components using the formatting toolbar.
 *
 * @example
 * ```typescript
 * import { globalToolbarManager } from './globalToolbarManager';
 *
 * // Show toolbar for an element
 * globalToolbarManager.showToolbar(textareaElement);
 *
 * // Apply formatting
 * globalToolbarManager.applyFormat((text) => text.toUpperCase());
 * ```
 */
const globalToolbarManager = new GlobalToolbarManager();

export { globalToolbarManager };

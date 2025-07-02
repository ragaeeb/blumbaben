/**
 * Function type for text formatting operations.
 * Takes a string input and returns a transformed string.
 *
 * @example
 * ```typescript
 * const boldFormatter: FormatterFunction = (text) => `**${text}**`;
 * const upperCaseFormatter: FormatterFunction = (text) => text.toUpperCase();
 * ```
 */
export type FormatterFunction = (text: string) => string;

/**
 * Union type representing supported HTML input elements for text formatting.
 * Includes both single-line inputs and multi-line textareas.
 */
export type TextInputElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Configuration options for the formatting toolbar behavior and appearance.
 */
export type ToolbarConfig = {
    /**
     * Custom positioning function to determine where the toolbar appears relative to the focused element.
     * If not provided, defaults to positioning below the element.
     *
     * @param {TextInputElement} element - The focused input or textarea element
     * @returns {ToolbarPosition} Position coordinates for the toolbar
     *
     * @example
     * ```typescript
     * const config: ToolbarConfig = {
     *   getPosition: (element) => {
     *     const rect = element.getBoundingClientRect();
     *     return { x: rect.left, y: rect.top - 50 }; // Above the element
     *   }
     * };
     * ```
     */
    getPosition?: (element: TextInputElement) => ToolbarPosition;

    /**
     * Delay in milliseconds before hiding the toolbar after the input loses focus.
     * This allows users to click on toolbar buttons without the toolbar disappearing.
     *
     * @default 500
     */
    hideDelay?: number;

    /**
     * Whether to prevent the toolbar from closing when clicked.
     * When true, clicking toolbar buttons won't cause the input to lose focus.
     *
     * @default true
     */
    preventCloseOnClick?: boolean;
};

/**
 * Represents the x,y coordinates for positioning the toolbar on screen.
 *
 * @interface ToolbarPosition
 */
export type ToolbarPosition = {
    /** Horizontal position in pixels from the left edge of the viewport */
    x: number;
    /** Vertical position in pixels from the top edge of the viewport */
    y: number;
};

/**
 * Current state of the formatting toolbar including visibility, position, and active element.
 *
 * @interface ToolbarState
 */
export type ToolbarState = {
    /** The currently focused input/textarea element, or null if no element is active */
    activeElement: null | TextInputElement;
    /** Whether the toolbar is currently visible to the user */
    isVisible: boolean;
    /** Current position of the toolbar, or null if not positioned */
    position: null | ToolbarPosition;
};

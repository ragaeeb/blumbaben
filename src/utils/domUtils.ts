/**
 * Applies a formatting function to either selected text or entire content of an element.
 * If text is selected (selectionStart !== selectionEnd), formats only the selected portion.
 * If no text is selected, formats the entire content of the element.
 * Returns the formatted result without modifying the original element.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} element - The HTML input or textarea element containing the text
 * @param {(text: string) => string} formatter - Function that takes a string and returns a formatted version
 * @returns {string} The formatted text with either selected portion or entire content transformed
 *
 * @example
 * ```typescript
 * const textarea = document.querySelector('textarea');
 * const uppercaseFormatter = (text: string) => text.toUpperCase();
 * const result = applyFormattingOnSelection(textarea, uppercaseFormatter);
 * ```
 */
export const applyFormattingOnSelection = (
    element: HTMLInputElement | HTMLTextAreaElement,
    formatter: (text: string) => string,
): string => {
    const selectionEnd = element.selectionEnd ?? 0;
    const selectionStart = element.selectionStart ?? 0;
    const value = element.value ?? '';

    if (selectionEnd > selectionStart) {
        // Format only selected text
        const before = value.substring(0, selectionStart);
        const selected = value.substring(selectionStart, selectionEnd);
        const after = value.substring(selectionEnd);

        return before + formatter(selected) + after;
    }

    // Format entire text if no selection
    return formatter(value);
};

/**
 * Updates the value of an input or textarea element and optionally triggers onChange event.
 * Creates a synthetic React change event if onChange callback is provided.
 * Useful for programmatically updating form elements while maintaining React state consistency.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} element - The HTML input or textarea element to update
 * @param {string} newValue - The new string value to set on the element
 * @param {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} [onChange] - Optional React onChange event handler to call after updating the value
 *
 * @example
 * ```typescript
 * const handleChange = (e) => setFormValue(e.target.value);
 * updateElementValue(textareaRef.current, 'New content', handleChange);
 * ```
 */
export const updateElementValue = (
    element: HTMLInputElement | HTMLTextAreaElement,
    newValue: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
) => {
    element.value = newValue;

    // Dispatch input event for React to detect the change
    element.dispatchEvent(new Event('input', { bubbles: true }));

    // Call onChange if provided (for controlled components)
    if (onChange) {
        const syntheticEvent = {
            currentTarget: element,
            target: element,
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        onChange(syntheticEvent);
    }
};

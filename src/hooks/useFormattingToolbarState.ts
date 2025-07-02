import { useCallback, useEffect, useState } from 'react';

import type { FormatterFunction, ToolbarState } from '@/types';

import { globalToolbarManager } from '@/utils/globalToolbarManager';

/**
 * Lightweight hook that only subscribes to toolbar state without creating input handlers.
 * Useful for toolbar-only components that don't need to handle input focus/blur events.
 * Perfect for creating separate toolbar components that respond to the global toolbar state.
 *
 * @returns {object} Object containing applyFormat function, visibility state, and toolbar state
 *
 * @example
 * ```typescript
 * function ToolbarComponent() {
 *   const { applyFormat, isVisible, toolbarState } = useFormattingToolbarState();
 *
 *   if (!isVisible) return null;
 *
 *   return (
 *     <div style={{ position: 'fixed', top: toolbarState.position?.y, left: toolbarState.position?.x }}>
 *       <button onClick={() => applyFormat(text => `**${text}**`)}>
 *         Bold
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useFormattingToolbarState = () => {
    const [toolbarState, setToolbarState] = useState<ToolbarState>(globalToolbarManager.getState());

    useEffect(() => {
        const unsubscribe = globalToolbarManager.subscribe(setToolbarState);
        return unsubscribe;
    }, []);

    const applyFormat = useCallback((formatter: FormatterFunction) => {
        globalToolbarManager.applyFormat(formatter);
    }, []);

    return {
        applyFormat,
        isVisible: toolbarState.isVisible,
        toolbarState,
    };
};

import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@testing-library/react';

import { globalToolbarManager } from '@/utils/globalToolbarManager';

import { useFormattingToolbarState } from '../useFormattingToolbarState';

describe('useFormattingToolbarState', () => {
    beforeEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    it('returns the latest toolbar state', () => {
        const { result } = renderHook(() => useFormattingToolbarState());
        const element = document.createElement('textarea');

        act(() => {
            globalToolbarManager.showToolbar(element, () => ({ x: 40, y: 60 }));
        });

        expect(result.current.isVisible).toBe(true);
        expect(result.current.toolbarState.position).toEqual({ x: 40, y: 60 });
    });

    it('delegates applyFormat to the manager', () => {
        const applySpy = vi.spyOn(globalToolbarManager, 'applyFormat');
        const { result } = renderHook(() => useFormattingToolbarState());
        const formatter = vi.fn();

        act(() => {
            result.current.applyFormat(formatter);
        });

        expect(applySpy).toHaveBeenCalledWith(formatter);
    });
});

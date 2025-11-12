import type { FocusEvent } from 'react';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@testing-library/react';

import { globalToolbarManager } from '@/utils/globalToolbarManager';
import type { FormatterFunction } from '@/types';

import { useFormattingToolbar } from '../useFormattingToolbar';

const describeIfDocument = typeof globalThis.document === 'undefined' ? describe.skip : describe;

const createInput = () => {
    const element = document.createElement('input');
    element.getBoundingClientRect = () =>
        ({
            bottom: 20,
            height: 10,
            left: 10,
            right: 30,
            top: 10,
            width: 20,
            x: 10,
            y: 10,
            toJSON: () => ({}),
        }) as DOMRect;
    return element;
};

describeIfDocument('useFormattingToolbar', () => {
    beforeEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    it('subscribes to global state updates', () => {
        const { result } = renderHook(() => useFormattingToolbar());
        const element = createInput();

        act(() => {
            globalToolbarManager.showToolbar(element, () => ({ x: 32, y: 48 }));
        });

        expect(result.current.isVisible).toBe(true);
        expect(result.current.toolbarState.position).toEqual({ x: 32, y: 48 });
    });

    it('cleans up the subscription on unmount', () => {
        const originalSubscribe = globalToolbarManager.subscribe.bind(globalToolbarManager);
        const unsubscribeSpy = vi.fn();
        vi.spyOn(globalToolbarManager, 'subscribe').mockImplementation((callback) => {
            const unsubscribe = originalSubscribe(callback);
            return () => {
                unsubscribe();
                unsubscribeSpy();
            };
        });

        const { unmount } = renderHook(() => useFormattingToolbar());
        unmount();

        expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('uses focus and blur handlers from getInputProps', () => {
        const showSpy = vi.spyOn(globalToolbarManager, 'showToolbar');
        const hideSpy = vi.spyOn(globalToolbarManager, 'scheduleHide');
        const { result } = renderHook(() => useFormattingToolbar({ hideDelay: 150 }));

        const input = createInput();
        const handlers = result.current.getInputProps();

        act(() => {
            handlers.onFocus({ currentTarget: input } as FocusEvent<HTMLInputElement>);
        });

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(showSpy.mock.calls[0][0]).toBe(input);

        act(() => {
            handlers.onBlur({ currentTarget: input } as FocusEvent<HTMLInputElement>);
        });

        expect(hideSpy).toHaveBeenCalledWith(150);
    });

    it('delegates hideToolbar and applyFormat helpers', () => {
        const hideSpy = vi.spyOn(globalToolbarManager, 'hideToolbar');
        const formatSpy = vi.spyOn(globalToolbarManager, 'applyFormat');
        const { result } = renderHook(() => useFormattingToolbar());
        const formatter: FormatterFunction = (text) => text.toUpperCase();

        act(() => {
            result.current.hideToolbar();
        });

        expect(hideSpy).toHaveBeenCalledTimes(1);

        act(() => {
            result.current.applyFormat(formatter);
        });

        expect(formatSpy).toHaveBeenCalledWith(formatter);
    });

    it('respects custom getPosition when showing the toolbar', () => {
        const { result } = renderHook(() =>
            useFormattingToolbar({
                getPosition: () => ({ x: 90, y: 120 }),
            }),
        );
        const element = createInput();

        act(() => {
            result.current.showToolbar(element);
        });

        expect(globalToolbarManager.getState().position).toEqual({ x: 90, y: 120 });
    });

    it('exposes toolbar props with default preventCloseOnClick behaviour', () => {
        const cancelSpy = vi.spyOn(globalToolbarManager, 'cancelScheduledHide');
        const { result } = renderHook(() => useFormattingToolbar());
        const preventDefault = vi.fn();

        act(() => {
            globalToolbarManager.showToolbar(createInput(), () => ({ x: 12, y: 24 }));
        });

        const toolbarProps = result.current.getToolbarProps();
        expect(toolbarProps.style).toMatchObject({ left: 12, top: 24, position: 'fixed' });

        toolbarProps.onMouseDown?.({ preventDefault } as unknown as React.MouseEvent);

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('omits onMouseDown when preventCloseOnClick is disabled', () => {
        const { result } = renderHook(() => useFormattingToolbar({ preventCloseOnClick: false }));

        act(() => {
            globalToolbarManager.showToolbar(createInput(), () => ({ x: 0, y: 0 }));
        });

        expect(result.current.getToolbarProps().onMouseDown).toBeUndefined();
    });
});

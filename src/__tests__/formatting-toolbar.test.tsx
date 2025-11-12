import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render } from '@testing-library/react';

import { globalToolbarManager } from '@/utils/globalToolbarManager';

import { FormattingToolbar } from '../formatting-toolbar';

const describeIfDocument = typeof globalThis.document === 'undefined' ? describe.skip : describe;

describeIfDocument('FormattingToolbar', () => {
    beforeEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        globalToolbarManager.hideToolbar();
        vi.restoreAllMocks();
    });

    it('does not render when the toolbar is hidden', () => {
        const { container } = render(
            <FormattingToolbar>{() => <button type="button">Bold</button>}</FormattingToolbar>,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders children when the toolbar is visible', () => {
        const applySpy = vi.spyOn(globalToolbarManager, 'applyFormat');
        const anchor = document.createElement('textarea');

        act(() => {
            globalToolbarManager.showToolbar(anchor, () => ({ x: 10, y: 20 }));
        });

        const { getByRole } = render(
            <FormattingToolbar>
                {(applyFormat) => (
                    <button type="button" onClick={() => applyFormat(() => 'formatted')}>
                        Bold
                    </button>
                )}
            </FormattingToolbar>,
        );

        const button = getByRole('button', { name: 'Bold' });
        fireEvent.click(button);

        expect(applySpy).toHaveBeenCalledTimes(1);
        const toolbar = button.parentElement as HTMLElement;
        expect(toolbar).toHaveStyle({ left: '10px', top: '20px', position: 'fixed' });
    });

    it('supports custom element props and disables preventCloseOnClick when configured', () => {
        const anchor = document.createElement('textarea');

        act(() => {
            globalToolbarManager.showToolbar(anchor, () => ({ x: 5, y: 6 }));
        });

        const { getByRole } = render(
            <FormattingToolbar
                as="section"
                className="custom"
                config={{ preventCloseOnClick: false }}
                style={{ background: 'red' }}
            >
                {() => (
                    <button type="button" onMouseDown={(event) => event.preventDefault()}>
                        Italic
                    </button>
                )}
            </FormattingToolbar>,
        );

        const toolbar = getByRole('button', { name: 'Italic' }).parentElement as HTMLElement;
        expect(toolbar.tagName.toLowerCase()).toBe('section');
        expect(toolbar).toHaveClass('custom');
        expect(toolbar).toHaveStyle({ background: 'red', left: '5px', top: '6px' });

        const event = fireEvent.mouseDown(toolbar);
        expect(event).toBe(true);
    });
});

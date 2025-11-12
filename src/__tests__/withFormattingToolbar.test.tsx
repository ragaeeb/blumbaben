import type { ComponentProps, FC, FocusEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { fireEvent, render } from '@testing-library/react';

import { withFormattingToolbar } from '../withFormattingToolbar';

const describeIfDocument = typeof globalThis.document === 'undefined' ? describe.skip : describe;

type HookReturn = {
    getInputProps: () => {
        onBlur: (event: FocusEvent<Element>) => void;
        onFocus: (event: FocusEvent<Element>) => void;
    };
};

const isVitest = typeof vi?.fn === 'function' && typeof vi?.mock === 'function';
const mockUseFormattingToolbar: MockInstance<HookReturn, []> =
    (isVitest
        ? vi.fn<HookReturn, []>()
        : (Object.assign(
              () => ({
                  getInputProps: () => ({
                      onBlur: () => undefined,
                      onFocus: () => undefined,
                  }),
              }),
              { mockReturnValue: () => undefined, mockReset: () => undefined },
          ) as MockInstance<HookReturn, []>));

if (isVitest) {
    vi.mock('../hooks/useFormattingToolbar', () => ({
        useFormattingToolbar: () => mockUseFormattingToolbar(),
    }));
}

describeIfDocument('withFormattingToolbar', () => {
    beforeEach(() => {
        mockUseFormattingToolbar.mockReset();
    });

    it('merges focus and blur handlers', () => {
        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        const onFocusToolbar = vi.fn();
        const onBlurToolbar = vi.fn();

        mockUseFormattingToolbar.mockReturnValue({
            getInputProps: () => ({
                onBlur: onBlurToolbar,
                onFocus: onFocusToolbar,
            }),
        });

        const Component: FC<ComponentProps<'input'>> = (props) => <input {...props} />;
        Component.displayName = 'Input';

        const Enhanced = withFormattingToolbar(Component);
        const { getByRole } = render(<Enhanced onBlur={blurSpy} onFocus={focusSpy} />);

        const input = getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(onFocusToolbar).toHaveBeenCalledTimes(1);
        expect(onBlurToolbar).toHaveBeenCalledTimes(1);
        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it('forwards refs to the wrapped component', () => {
        mockUseFormattingToolbar.mockReturnValue({
            getInputProps: () => ({
                onBlur: vi.fn(),
                onFocus: vi.fn(),
            }),
        });

        const Component = vi.fn((props: ComponentProps<'textarea'>) => <textarea {...props} />);
        const Enhanced = withFormattingToolbar(Component);

        const ref = vi.fn();
        render(<Enhanced ref={ref} />);

        expect(ref).toHaveBeenCalled();
        expect(Component).toHaveBeenCalledWith(
            expect.objectContaining({ ref: expect.any(Function) }),
            expect.anything(),
        );
    });

    it('sets a descriptive display name', () => {
        mockUseFormattingToolbar.mockReturnValue({
            getInputProps: () => ({
                onBlur: vi.fn(),
                onFocus: vi.fn(),
            }),
        });

        const Component: FC = () => null;
        Component.displayName = 'SampleComponent';

        const Enhanced = withFormattingToolbar(Component);

        expect(Enhanced.displayName).toBe('withFormattingToolbar(SampleComponent)');
    });
});

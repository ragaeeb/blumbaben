import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode, TextareaHTMLAttributes } from 'react';
import { forwardRef, useEffect, useId, useState } from 'react';

import { FormattingToolbar } from '@/formatting-toolbar';
import { useFormattingToolbar } from '@/hooks/useFormattingToolbar';
import { globalToolbarManager } from '@/utils/globalToolbarManager';
import { withFormattingToolbar } from '@/withFormattingToolbar';

const storyBackdropStyle: CSSProperties = {
    alignItems: 'flex-start',
    background: 'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), rgba(2, 6, 23, 0.92))',
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '3.5rem 1.5rem 8rem',
    width: '100%',
};

const demoCardStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '2rem',
    boxShadow: '0 35px 85px rgba(15, 23, 42, 0.22)',
    boxSizing: 'border-box',
    display: 'grid',
    gap: '2.25rem',
    margin: '0 auto',
    maxWidth: '960px',
    padding: '2.75rem 3rem',
    width: '100%',
};

const headingStyle: CSSProperties = { color: '#0f172a', display: 'grid', gap: '0.75rem' };

const headingTitleStyle: CSSProperties = { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 };

const headingDescriptionStyle: CSSProperties = { color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 };

const inputsGridStyle: CSSProperties = {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
};

const fieldWrapperStyle: CSSProperties = { display: 'grid', gap: '0.75rem' };

const labelStyle: CSSProperties = {
    color: '#1e293b',
    fontSize: '0.9rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
};

const hintStyle: CSSProperties = { color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 };

const textAreaStyle: CSSProperties = {
    backgroundColor: '#f8fafc',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '1rem',
    boxShadow: 'inset 0 1px 1px rgba(15, 23, 42, 0.08)',
    color: '#0f172a',
    font: 'inherit',
    lineHeight: 1.6,
    minHeight: '8.5rem',
    padding: '1rem 1.25rem',
    resize: 'vertical',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const toolbarSurfaceStyle: CSSProperties = {
    alignItems: 'center',
    backdropFilter: 'blur(18px)',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.88))',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '999px',
    boxShadow: '0 22px 55px rgba(15, 23, 42, 0.35)',
    color: '#f8fafc',
    display: 'flex',
    gap: '0.5rem',
    padding: '0.4rem 0.55rem',
};

const toolbarHeadlineStyle: CSSProperties = {
    color: 'rgba(226, 232, 240, 0.8)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    marginRight: '0.35rem',
    textTransform: 'uppercase',
};

const toolbarBadgeStyle: CSSProperties = {
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(129, 140, 248, 0.4))',
    borderRadius: '999px',
    color: '#e2e8f0',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    padding: '0.2rem 0.7rem',
    textTransform: 'uppercase',
};

const toolbarActionsStyle: CSSProperties = { alignItems: 'center', display: 'flex', gap: '0.45rem' };

type FormatAction = { label: string; tooltip: string; format: (text: string) => string };

const formatActions: FormatAction[] = [
    {
        format: (text) => text.toUpperCase(),
        label: 'Uppercase',
        tooltip: 'Convert the current selection to uppercase characters',
    },
    {
        format: (text) => text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
        label: 'Title case',
        tooltip: 'Capitalize every word in the current selection',
    },
    {
        format: (text) => (text.trim().length ? `“${text.trim()}”` : text),
        label: 'Quote',
        tooltip: 'Wrap the selection in smart quotes',
    },
    {
        format: (text) =>
            text
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, ''),
        label: 'Slugify',
        tooltip: 'Transform the current selection into a URL-friendly slug',
    },
];

type FormatButtonsProps = { dense?: boolean; onFormat: (formatter: FormatAction['format']) => void };

const FormatButtons: React.FC<FormatButtonsProps> = ({ dense = false, onFormat }) => (
    <div style={{ ...toolbarActionsStyle, gap: dense ? '0.35rem' : toolbarActionsStyle.gap }}>
        {formatActions.map((action) => (
            <button
                key={action.label}
                onClick={() => onFormat(action.format)}
                style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.32), rgba(99, 102, 241, 0.55))',
                    border: '1px solid rgba(148, 163, 184, 0.45)',
                    borderRadius: '0.85rem',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.35)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: dense ? '0.78rem' : '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    padding: dense ? '0.35rem 0.75rem' : '0.45rem 0.9rem',
                    transition: 'transform 0.15s ease',
                    whiteSpace: 'nowrap',
                }}
                title={action.tooltip}
                type="button"
            >
                {action.label}
            </button>
        ))}
    </div>
);

type DemoLayoutProps = { children: ReactNode; description: ReactNode; title: string };

const DemoLayout: React.FC<DemoLayoutProps> = ({ children, description, title }) => (
    <div style={demoCardStyle}>
        <header style={headingStyle}>
            <h2 style={headingTitleStyle}>{title}</h2>
            <p style={headingDescriptionStyle}>{description}</p>
        </header>

        <div style={{ display: 'grid', gap: '1.75rem' }}>{children}</div>
    </div>
);

const useToolbarCleanup = () => {
    useEffect(
        () => () => {
            globalToolbarManager.hideToolbar();
        },
        [],
    );
};

const storyMeta = {
    args: { children: () => null },
    component: FormattingToolbar,
    parameters: { layout: 'fullscreen', options: { showPanel: true } },
    tags: ['autodocs'],
    title: 'Formatting toolbar/Examples',
} satisfies Meta<typeof FormattingToolbar>;

export default storyMeta;

type Story = StoryObj<typeof storyMeta>;

const StoryBackdrop: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div style={storyBackdropStyle}>{children}</div>
);

export const FocusTriggeredToolbar: Story = {
    name: 'Focus-triggered toolbar',
    render: () => {
        useToolbarCleanup();

        const [message, setMessage] = useState(
            'Highlight a portion of this note and try applying one of the formatting helpers from the floating toolbar.',
        );
        const [checklist, setChecklist] = useState(
            'You can focus a different input to reuse the same toolbar. The formatting applies to the selection or entire value.',
        );
        const { getInputProps } = useFormattingToolbar({
            getPosition: (element) => {
                const rect = element.getBoundingClientRect();
                const toolbarHeight = 60;
                const viewportHeight = window.innerHeight;

                // Position above if too close to bottom
                if (rect.bottom + toolbarHeight > viewportHeight - 20) {
                    return { x: rect.left, y: rect.top - toolbarHeight - 5 };
                }
                return { x: rect.left, y: rect.bottom + 5 };
            },
        });
        const primaryId = useId();
        const secondaryId = useId();

        return (
            <StoryBackdrop>
                <DemoLayout
                    title="Shared toolbar state"
                    description="Both inputs subscribe to the same global toolbar instance. Focus moves the toolbar, and the formatting helpers work on either the current selection or the entire field when nothing is selected."
                >
                    <div style={inputsGridStyle}>
                        <label htmlFor={primaryId} style={fieldWrapperStyle}>
                            <span style={labelStyle}>Product update draft</span>
                            <textarea
                                {...getInputProps()}
                                id={primaryId}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Draft a quick update, then highlight text to try a formatter."
                                style={textAreaStyle}
                                value={message}
                            />
                            <p style={hintStyle}>Select a phrase to see formatters act on just that snippet.</p>
                        </label>

                        <label htmlFor={secondaryId} style={fieldWrapperStyle}>
                            <span style={labelStyle}>Launch day checklist</span>
                            <textarea
                                {...getInputProps()}
                                id={secondaryId}
                                onChange={(event) => setChecklist(event.target.value)}
                                placeholder="Focus this field to move the toolbar."
                                style={{ ...textAreaStyle, minHeight: '10rem' }}
                                value={checklist}
                            />
                            <p style={hintStyle}>
                                The toolbar follows focus automatically, ensuring there is only one instance visible.
                            </p>
                        </label>
                    </div>

                    <FormattingToolbar style={toolbarSurfaceStyle}>
                        {(applyFormat) => (
                            <>
                                <span aria-hidden style={toolbarHeadlineStyle}>
                                    Formatting helpers
                                </span>
                                <span aria-hidden style={toolbarBadgeStyle}>
                                    Select & format
                                </span>
                                <FormatButtons onFormat={applyFormat} />
                            </>
                        )}
                    </FormattingToolbar>
                </DemoLayout>
            </StoryBackdrop>
        );
    },
};

export const CustomPlacement: Story = {
    name: 'Custom positioning & behaviour',
    render: () => {
        useToolbarCleanup();

        const [value, setValue] = useState(
            'This example builds a bespoke toolbar using only the hook. It positions the surface above the focused field and keeps it visible until the focus changes.',
        );
        const { applyFormat, getInputProps, getToolbarProps, isVisible } = useFormattingToolbar({
            getPosition: (element) => {
                const rect = element.getBoundingClientRect();
                const width = 340;
                const centeredX = rect.left + rect.width / 2 - width / 2;

                return { x: Math.max(centeredX, 24), y: Math.max(rect.top - 90, 24) };
            },
            hideDelay: 0,
            preventCloseOnClick: false,
        });
        const fieldId = useId();

        const toolbarProps = getToolbarProps();

        return (
            <StoryBackdrop>
                <DemoLayout
                    title="Build your own surface"
                    description="Use the hook directly when you need full control. Here the toolbar floats above the input, stays visible while you interact with the buttons, and relies on the hook for positioning information."
                >
                    <div style={inputsGridStyle}>
                        <label htmlFor={fieldId} style={fieldWrapperStyle}>
                            <span style={labelStyle}>Editorial blurb</span>
                            <textarea
                                {...getInputProps()}
                                id={fieldId}
                                onChange={(event) => setValue(event.target.value)}
                                placeholder="Focus the field to reveal the custom toolbar above it."
                                style={{ ...textAreaStyle, minHeight: '11rem' }}
                                value={value}
                            />
                            <p style={hintStyle}>
                                The toolbar uses custom positioning and stays around until focus changes.
                            </p>
                        </label>
                    </div>

                    {isVisible && (
                        <div
                            {...toolbarProps}
                            style={{
                                ...toolbarProps.style,
                                ...toolbarSurfaceStyle,
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(12, 74, 110, 0.9))',
                                flexWrap: 'wrap',
                                gap: '0.65rem',
                                justifyContent: 'space-between',
                                maxWidth: '340px',
                                padding: '0.55rem 0.75rem',
                            }}
                        >
                            <div style={{ alignItems: 'center', display: 'flex', gap: '0.4rem' }}>
                                <span aria-hidden style={toolbarBadgeStyle}>
                                    Hook only
                                </span>
                                <span style={{ ...toolbarHeadlineStyle, marginRight: 0 }}>
                                    Built with getToolbarProps()
                                </span>
                            </div>
                            <FormatButtons dense onFormat={applyFormat} />
                        </div>
                    )}
                </DemoLayout>
            </StoryBackdrop>
        );
    },
};

const BaseTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
    <textarea
        {...props}
        ref={ref}
        style={{ ...textAreaStyle, minHeight: props.rows ? undefined : '12rem', ...(props.style ?? {}) }}
    />
));

BaseTextarea.displayName = 'BaseTextarea';

const TextareaWithToolbar = withFormattingToolbar(BaseTextarea, {
    getPosition: (element) => {
        const rect = element.getBoundingClientRect();
        const toolbarHeight = 60;
        const viewportHeight = window.innerHeight;

        if (rect.bottom + toolbarHeight > viewportHeight - 20) {
            return { x: rect.left, y: rect.top - toolbarHeight - 5 };
        }
        return { x: rect.left, y: rect.bottom + 5 };
    },
    hideDelay: 250,
});

export const HigherOrderComponent: Story = {
    name: 'Higher-order component',
    render: () => {
        useToolbarCleanup();

        const [notes, setNotes] = useState(
            'The HOC wires focus and blur events into an existing textarea. You can drop in your UI framework component and still reuse the global toolbar instance.',
        );

        return (
            <StoryBackdrop>
                <DemoLayout
                    title="Enhance existing inputs"
                    description="Wrap an existing input component with the higher-order helper to add toolbar behaviour without touching its implementation."
                >
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <TextareaWithToolbar
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Focus the field, select text, and apply different transformations."
                            value={notes}
                        />
                        <p style={hintStyle}>
                            The toolbar instance is still global, so this input plays nicely with any other usage in
                            your application.
                        </p>
                    </div>

                    <FormattingToolbar style={{ ...toolbarSurfaceStyle, gap: '0.6rem' }}>
                        {(applyFormat) => (
                            <>
                                <span aria-hidden style={toolbarHeadlineStyle}>
                                    Shared toolbar
                                </span>
                                <FormatButtons dense onFormat={applyFormat} />
                            </>
                        )}
                    </FormattingToolbar>
                </DemoLayout>
            </StoryBackdrop>
        );
    },
};

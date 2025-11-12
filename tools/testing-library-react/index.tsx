import { fireEvent, getQueriesForElement, prettyDOM, queries } from '@testing-library/dom';
import type { FC, ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, type Root } from 'react-dom/client';

type BoundQueries = ReturnType<typeof getQueriesForElement<typeof queries>>;

type RenderResult = BoundQueries & {
    asFragment: () => DocumentFragment;
    baseElement: HTMLElement;
    container: HTMLElement;
    debug: (element?: Element | DocumentFragment | null) => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
};

type MountedTree = {
    baseElement: HTMLElement;
    container: HTMLElement;
    root: Root;
};

const mountedTrees = new Set<MountedTree>();

const createQueriesForContainer = (baseElement: HTMLElement) => getQueriesForElement(baseElement, queries);

const ensureContainer = (container?: HTMLElement) => {
    if (container) {
        return container;
    }

    const element = document.createElement('div');
    document.body.append(element);
    return element;
};

export const render = (
    ui: ReactElement,
    options: { baseElement?: HTMLElement; container?: HTMLElement } = {},
): RenderResult => {
    const container = ensureContainer(options.container);
    const baseElement = options.baseElement ?? container;

    const root = createRoot(container);

    act(() => {
        root.render(ui);
    });

    const mountedTree: MountedTree = { baseElement, container, root };
    mountedTrees.add(mountedTree);

    const boundQueries = createQueriesForContainer(baseElement);

    return {
        ...boundQueries,
        asFragment: () => container.cloneNode(true) as DocumentFragment,
        baseElement,
        container,
        debug: (element) => {
            // eslint-disable-next-line no-console -- debugging helper mirrors RTL implementation
            console.log(prettyDOM(element ?? baseElement));
        },
        rerender: (nextUi: ReactElement) => {
            act(() => {
                root.render(nextUi);
            });
        },
        unmount: () => {
            act(() => {
                root.unmount();
            });

            mountedTrees.delete(mountedTree);

            if (!options.container) {
                container.remove();
            }
        },
    };
};

export const cleanup = () => {
    for (const tree of [...mountedTrees]) {
        act(() => {
            tree.root.unmount();
        });

        if (!tree.container.isConnected) {
            continue;
        }

        if (tree.container.parentElement === document.body) {
            tree.container.remove();
        }

        mountedTrees.delete(tree);
    }

};

type Screen = BoundQueries;

export const screen: Screen = new Proxy({} as Screen, {
    get(_target, property: string | symbol) {
        const boundQueries = getQueriesForElement(document.body, queries) as Record<string | symbol, unknown>;
        return boundQueries[property];
    },
}) as Screen;

type HookRenderOptions<P> = {
    initialProps: P;
};

type HookResult<Result, Props> = {
    rerender: (newProps?: Props) => void;
    result: {
        current: Result;
    };
    unmount: () => void;
};

export const renderHook = <Result, Props = void>(
    callback: (props: Props) => Result,
    options?: HookRenderOptions<Props>,
): HookResult<Result, Props> => {
    const { initialProps } = options ?? {};

    const result: { current: Result } = {
        current: undefined as unknown as Result,
    };

    type HookProps = { callback: (props: Props) => Result; hookProps: Props };

    const HookComponent: FC<HookProps> = ({ callback: hookCallback, hookProps }) => {
        result.current = hookCallback(hookProps);
        return null;
    };

    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    const renderWithProps = (hookProps: Props) => {
        act(() => {
            root.render(<HookComponent callback={callback} hookProps={hookProps} />);
        });
    };

    renderWithProps(initialProps as Props);

    return {
        rerender: (newProps?: Props) => {
            renderWithProps((newProps ?? initialProps) as Props);
        },
        result,
        unmount: () => {
            act(() => {
                root.unmount();
            });

            container.remove();
        },
    };
};

export { fireEvent };

export type { RenderResult };

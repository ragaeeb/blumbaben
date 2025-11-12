export type OutputFormat = 'esm';

export type TsdownConfig = {
    clean?: boolean;
    dts?: boolean;
    entry: string[];
    external?: string[];
    format?: OutputFormat[];
    minify?: boolean;
    outDir?: string;
    sourcemap?: boolean;
    target?: string;
};

export const defineConfig = (config: TsdownConfig): TsdownConfig => config;

#!/usr/bin/env bun

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import ts from 'typescript';

import type { TsdownConfig } from '../src/index';

const cwd = process.cwd();

const resolveConfig = async (): Promise<TsdownConfig> => {
    const configPath = ['tsdown.config.ts', 'tsdown.config.js']
        .map((file) => path.resolve(cwd, file))
        .find((file) => fs.existsSync(file));

    if (!configPath) {
        throw new Error('Could not find tsdown.config.ts');
    }

    const module = await import(pathToFileURL(configPath).href);

    if (module.default) {
        return module.default as TsdownConfig;
    }

    return module as TsdownConfig;
};

const emitDeclarations = (outDir: string) => {
    const buildConfigPath = path.resolve(cwd, 'tsconfig.build.json');

    if (!fs.existsSync(buildConfigPath)) {
        throw new Error('Missing tsconfig.build.json required for declaration emit');
    }

    const configFile = ts.readConfigFile(buildConfigPath, ts.sys.readFile);

    if (configFile.error) {
        throw new Error(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => cwd,
            getNewLine: () => '\n',
        }));
    }

    const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(buildConfigPath));

    const program = ts.createProgram({
        options: parsed.options,
        rootNames: parsed.fileNames,
    });

    const emitResult = program.emit(undefined, undefined, undefined, true);
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    if (diagnostics.length > 0) {
        const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => cwd,
            getNewLine: () => '\n',
        });
        throw new Error(formatted);
    }

    // Ensure the declaration output directory exists when tsconfig uses relative paths
    fs.mkdirSync(outDir, { recursive: true });
};

const run = async () => {
    const config = await resolveConfig();
    const outDir = path.resolve(cwd, config.outDir ?? 'dist');

    if (config.clean) {
        fs.rmSync(outDir, { force: true, recursive: true });
    }

    const supportedTargets = new Set(['browser', 'bun', 'node']);
    const resolvedTarget = supportedTargets.has(config.target ?? '')
        ? (config.target as 'browser' | 'bun' | 'node')
        : 'bun';

    const resolvedSourceMap =
        typeof config.sourcemap === 'string'
            ? (config.sourcemap as 'none' | 'inline' | 'external')
            : config.sourcemap === false
              ? 'none'
              : 'external';

    const build = await Bun.build({
        entrypoints: config.entry.map((entry) => path.resolve(cwd, entry)),
        external: config.external ?? [],
        format: 'esm',
        minify: config.minify ?? true,
        outdir: outDir,
        sourcemap: resolvedSourceMap,
        target: resolvedTarget,
    });

    if (!build.success) {
        const messages = build.logs.map((log) => `${log.level.toUpperCase()}: ${log.message}`);
        throw new Error(['Failed to build library with tsdown', ...messages].join('\n'));
    }

    if (config.dts) {
        emitDeclarations(outDir);
    }
};

run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});

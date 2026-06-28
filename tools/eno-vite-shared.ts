import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, UserConfig } from 'vite';

/**
 * Feste Asset-Dateinamen — wichtig für FTP-Deploy:
 * index.html und assets/app.js / assets/app.css bleiben stabil,
 * Hashes ändern sich nicht bei jedem Build.
 */
export const enoStableAssetBuild: UserConfig['build'] = {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
        output: {
            entryFileNames: 'assets/app.js',
            chunkFileNames: 'assets/chunk-[name].js',
            assetFileNames: 'assets/app.[ext]',
        },
    },
};

/** Dev-Server: /shared/* aus dem Repo-Root ausliefern (Menü-Scripts). */
export function enoSharedStaticPlugin(toolDir: string): Plugin {
    const sharedDir = path.resolve(toolDir, '../../shared');

    return {
        name: 'eno-shared-static',
        configureServer(server) {
            server.middlewares.use('/shared', (req, res, next) => {
                const urlPath = (req.url ?? '/').split('?')[0];
                const filePath = path.normalize(path.join(sharedDir, urlPath));

                if (!filePath.startsWith(sharedDir)) {
                    res.statusCode = 403;
                    res.end();
                    return;
                }

                if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                    next();
                    return;
                }

                const ext = path.extname(filePath);
                const types: Record<string, string> = {
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.webmanifest': 'application/manifest+json',
                };
                res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream');
                fs.createReadStream(filePath).pipe(res);
            });
        },
    };
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { enoSharedStaticPlugin, enoStableAssetBuild } from '../eno-vite-shared';

const toolDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: '/tools/abnehmlexikon/',
    plugins: [enoSharedStaticPlugin(toolDir)],
    build: enoStableAssetBuild,
});

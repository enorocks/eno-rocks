import { cp, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '.deploy');

const ROOT_FILES = ['index.html', 'eno-landing.css', 'eno-legal.css', 'manifest.webmanifest', 'sw.js'];

const ROOT_DIRS = ['assets', 'fonts', 'impressum', 'datenschutz'];

const SHARED_DIRS = ['shared/css', 'shared/js', 'shared/vendor'];

const TOOLS = ['kalorienrechner', 'makrorechner', 'dailytogether', 'uebungen', 'pedia'];

async function copyInto(src, dest) {
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(src, dest, { recursive: true });
}

async function main() {
    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });

    for (const file of ROOT_FILES) {
        await copyInto(path.join(root, file), path.join(out, file));
    }

    for (const dir of ROOT_DIRS) {
        await copyInto(path.join(root, dir), path.join(out, dir));
    }

    for (const dir of SHARED_DIRS) {
        await copyInto(path.join(root, dir), path.join(out, dir));
    }

    for (const tool of TOOLS) {
        const dist = path.join(root, 'tools', tool, 'dist');
        await copyInto(dist, path.join(out, 'tools', tool));
    }

    console.log(`Deploy-Bundle bereit: ${out}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

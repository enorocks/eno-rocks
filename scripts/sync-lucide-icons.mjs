import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'node_modules', 'lucide-static');
const target = path.join(root, 'shared', 'vendor', 'lucide');

const files = ['sprite.svg', 'tags.json', 'icon-nodes.json', 'LICENSE'];

async function main() {
    await mkdir(target, { recursive: true });

    for (const file of files) {
        await copyFile(path.join(source, file), path.join(target, file));
    }

    const tags = JSON.parse(await readFile(path.join(source, 'tags.json'), 'utf8'));
    const names = Object.keys(tags).sort();

    await writeFile(path.join(target, 'icon-names.json'), `${JSON.stringify(names, null, 0)}\n`);

    console.log(`Lucide sync OK: ${names.length} icons → shared/vendor/lucide/`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

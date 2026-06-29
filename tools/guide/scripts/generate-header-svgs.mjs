import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/headers');

const HEADERS = [
    { file: 'top-proteinquellen.svg', a: '#3a6fd4', b: '#254f99' },
    { file: 'top-tiefkuehl.svg', a: '#4a8fd4', b: '#2d6aa8' },
    { file: 'top-unverzichtbar.svg', a: '#1f6f5b', b: '#124838' },
    { file: 'top-snacks.svg', a: '#d4920a', b: '#a86f08' },
    { file: 'top-getraenke.svg', a: '#5ba4c9', b: '#3a7a99' },
    { file: 'top-saucen.svg', a: '#c45c3e', b: '#8f3f28' },
    { file: 'top-supplements.svg', a: '#7b5ea7', b: '#5a4080' },
    { file: 'top-marken.svg', a: '#6f675f', b: '#4a4540' },
    { file: 'top-apps.svg', a: '#3a6fd4', b: '#1f6f5b' },
    { file: 'top-hardware.svg', a: '#23211f', b: '#4a4540' },
    { file: 'top-organisation.svg', a: '#e07a5f', b: '#b85a42' },
    { file: 'top-gewohnheiten.svg', a: '#1f6f5b', b: '#7b5ea7' },
    { file: 'rezept-cheesecake.svg', a: '#e07a5f', b: '#d4920a' },
    { file: 'gedanken-cheat-day.svg', a: '#7b5ea7', b: '#4a3560' },
    { file: 'tipp-waage.svg', a: '#3a6fd4', b: '#7b5ea7' },
    { file: 'placeholder-toplist.svg', a: '#1f6f5b', b: '#124838' },
    { file: 'placeholder-recipe.svg', a: '#c45c3e', b: '#8f3f28' },
    { file: 'placeholder-thoughts.svg', a: '#7b5ea7', b: '#4a3560' },
    { file: 'placeholder-tip.svg', a: '#3a6fd4', b: '#254f99' },
];

function svg(a, b) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="480" fill="url(#g)"/>
  <circle cx="920" cy="100" r="140" fill="#ffffff" opacity="0.12"/>
  <circle cx="180" cy="360" r="80" fill="#ffffff" opacity="0.08"/>
</svg>
`;
}

async function main() {
    await mkdir(outDir, { recursive: true });
    for (const header of HEADERS) {
        await writeFile(path.join(outDir, header.file), svg(header.a, header.b), 'utf8');
        console.log(header.file);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

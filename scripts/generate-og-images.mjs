import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets', 'og');

const IMAGES = [
    {
        file: 'eno-calories.png',
        name: 'enoCalories',
        tagline: 'Kalorienbedarf realistisch berechnen',
        color: '#3a6fd4',
    },
    {
        file: 'eno-macros.png',
        name: 'enoMacros',
        tagline: 'Protein, Fett und Carbs aufteilen',
        color: '#7b5ea7',
    },
    {
        file: 'eno-pedia.png',
        name: 'Abnehmlexikon',
        tagline: 'Fitness und Ernährung einfach erklärt',
        color: '#d4920a',
    },
    {
        file: 'eno-exercises.png',
        name: 'Lieblingsübungen',
        tagline: 'Übungen für Zuhause',
        color: '#d4534a',
    },
];

function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildSvg({ name, tagline, color }) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f3ec"/>
  <rect width="1200" height="14" fill="${color}"/>
  <text x="72" y="108" font-family="Inter, ui-sans-serif, Arial, sans-serif" font-size="34" fill="#6f675f">eno.rocks</text>
  <text x="72" y="290" font-family="Inter, ui-sans-serif, Arial, sans-serif" font-size="78" font-weight="700" fill="#191817">${escapeXml(name)}</text>
  <text x="72" y="370" font-family="Inter, ui-sans-serif, Arial, sans-serif" font-size="38" fill="#6f675f">${escapeXml(tagline)}</text>
  <circle cx="1040" cy="500" r="120" fill="${color}" opacity="0.12"/>
  <circle cx="1100" cy="420" r="48" fill="${color}" opacity="0.2"/>
</svg>`;
}

async function main() {
    await mkdir(outDir, { recursive: true });

    for (const image of IMAGES) {
        const svg = buildSvg(image);
        const target = path.join(outDir, image.file);
        await sharp(Buffer.from(svg)).png().toFile(target);
        console.log('OG:', image.file);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

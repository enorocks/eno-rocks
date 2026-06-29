import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://eno.rocks';

const STATIC_PAGES = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/tools/kalorienrechner/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/tools/makrorechner/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/tools/abnehmlexikon/', changefreq: 'weekly', priority: '0.9' },
    { loc: '/tools/lieblingsuebungen/', changefreq: 'monthly', priority: '0.7' },
];

function slug(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

async function readPediaTermIds() {
    const termsPath = path.join(root, 'tools', 'abnehmlexikon', 'src', 'data', 'terms.ts');
    const source = await readFile(termsPath, 'utf8');
    const titles = [...source.matchAll(/term\('([^']+)'/g)].map((match) => match[1]);
    return titles.map(slug);
}

function urlEntry(loc, changefreq, priority) {
    return `  <url>
    <loc>${SITE}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
    const termIds = await readPediaTermIds();
    const entries = [
        ...STATIC_PAGES.map((page) => urlEntry(page.loc, page.changefreq, page.priority)),
        ...termIds.map((id) => urlEntry(`/tools/abnehmlexikon/#${id}`, 'monthly', '0.6')),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

    const target = path.join(root, 'sitemap.xml');
    await writeFile(target, xml, 'utf8');
    console.log(`Sitemap: ${entries.length} URLs → ${target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

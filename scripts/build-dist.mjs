import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const srcJsDir = path.join(rootDir, 'js');
const distJsDir = path.join(distDir, 'js');

const args = new Set(process.argv.slice(2));

const copyTargets = [
  'index.html',
  'resume',
  'images',
  'fonts',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'CNAME',
  'matthew-mcgrath-resume.pdf',
];

const cleanDist = async () => {
  await rm(distDir, { recursive: true, force: true });
};

const buildDistJs = async () => {
  await mkdir(distJsDir, { recursive: true });

  const entries = (await readdir(srcJsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => entry.name);

  for (const entry of entries) {
    const sourcePath = path.join(srcJsDir, entry);
    const outputPath = path.join(distJsDir, entry);
    const source = await readFile(sourcePath, 'utf8');
    const result = await transform(source, {
      format: 'esm',
      minify: true,
      target: 'es2020',
      legalComments: 'none',
    });

    await writeFile(outputPath, result.code, 'utf8');
  }

  console.log(`Built ${entries.length} minified JS file(s) into dist/js`);
};

const copyDistAssets = async () => {
  await mkdir(distDir, { recursive: true });

  for (const target of copyTargets) {
    const from = path.join(rootDir, target);
    const to = path.join(distDir, target);
    await cp(from, to, { recursive: true });
  }

  console.log('Copied static site assets into dist');
};

if (args.has('--clean')) {
  await cleanDist();
}

if (args.has('--js')) {
  await buildDistJs();
}

if (args.has('--copy')) {
  await copyDistAssets();
}

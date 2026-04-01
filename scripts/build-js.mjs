import { transform } from 'esbuild';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src', 'js');
const outDir = path.join(srcDir, 'min');

const toMinName = (filename) => filename.replace(/\.js$/i, '.min.js');
const rewriteImports = (code) =>
  code
    .replace(/(from\s+['"])(\.\/[^'"]+)\.js(['"])/g, '$1$2.min.js$3')
    .replace(/(import\s*\(\s*['"])(\.\/[^'"]+)\.js(['"]\s*\))/g, '$1$2.min.js$3');

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const entries = (await readdir(srcDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
  .map((entry) => entry.name);

for (const entry of entries) {
  const sourcePath = path.join(srcDir, entry);
  const outputPath = path.join(outDir, toMinName(entry));
  const source = await readFile(sourcePath, 'utf8');
  const rewritten = rewriteImports(source);
  const result = await transform(rewritten, {
    format: 'esm',
    minify: true,
    target: 'es2020',
    legalComments: 'none',
  });

  await writeFile(outputPath, result.code, 'utf8');
}

console.log(`Minified ${entries.length} JS file(s) into ${path.relative(rootDir, outDir)}`);

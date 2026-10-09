import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { minify } from 'html-minifier-terser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const srcJsDir = path.join(srcDir, 'js');
const distDir = path.join(rootDir, 'dist');
const distJsDir = path.join(distDir, 'js');

const args = new Set(process.argv.slice(2));

const copyTargets = ['index.html', 'resume', 'assets', 'manifest.json', 'robots.txt', 'sitemap.xml', 'CNAME', '.well-known'];
const htmlTargets = ['index.html', path.join('resume', 'index.html')];

const cleanDist = async () => {
  await rm(distDir, { recursive: true, force: true });
};

const buildDistJs = async () => {
  await mkdir(distJsDir, { recursive: true });

  await build({
    entryPoints: {
      ui: path.join(srcJsDir, 'ui.js'),
      resume: path.join(srcJsDir, 'resume.js'),
      analytics: path.join(srcJsDir, 'analytics.js'),
    },
    bundle: true,
    splitting: true,
    outdir: distJsDir,
    format: 'esm',
    minify: true,
    target: 'es2020',
    legalComments: 'none',
  });

  console.log('Built bundled & minified production JS (ui.js, resume.js, analytics.js) into dist/js');
};

const minifyHtmlFiles = async () => {
  const minifierOptions = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    keepClosingSlash: true,
  };

  for (const relPath of htmlTargets) {
    const filePath = path.join(distDir, relPath);
    try {
      const content = await readFile(filePath, 'utf8');
      const minified = await minify(content, minifierOptions);
      await writeFile(filePath, minified, 'utf8');
      console.log(`Minified ${relPath} (${content.length} -> ${minified.length} bytes, -${Math.round(((content.length - minified.length) / content.length) * 100)}%)`);
    } catch (err) {
      console.warn(`Could not minify ${relPath}:`, err.message);
    }
  }
};

const copyDistAssets = async () => {
  await mkdir(distDir, { recursive: true });

  for (const target of copyTargets) {
    const from = path.join(srcDir, target);
    const to = path.join(distDir, target);
    await cp(from, to, { recursive: true });
  }

  await minifyHtmlFiles();

  console.log('Copied static site assets and minified HTML into dist');
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

import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(root, 'dist');
const publicFiles = [
  'index.html', 'favicon.svg', 'styles.css', 'chords.css', 'practice.css', 'account.css', 'learning.css',
  'app.js', 'audio.js', 'account.js', 'home.js', 'learning.js', 'store.js', 'ui.js', 'music.js',
  'fretboard.js', 'ear.js', 'tuner.js', 'chords.js', 'practice.js',
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) await cp(resolve(root, file), resolve(output, file));
console.log(`Prepared ${publicFiles.length} public files in dist/`);

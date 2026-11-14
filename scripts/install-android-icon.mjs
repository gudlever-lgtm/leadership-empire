import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const artwork = join(root, 'assets', 'leadership-icon-v2.png');
if (!existsSync(manifestPath)) throw new Error('AndroidManifest.xml mangler. Kør Capacitor add/sync først.');
if (!existsSync(artwork)) throw new Error('Leadership Empire app-ikon mangler.');

const drawablePath = join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi');
mkdirSync(drawablePath, {recursive: true});
copyFileSync(artwork, join(drawablePath, 'leadership_launcher.png'));

const original = readFileSync(manifestPath, 'utf8');
const application = original.match(/<application\b[^>]*>/);
if (!application) throw new Error('AndroidManifest.xml mangler application-tag.');
let updatedTag = application[0]
  .replace(/android:icon="[^"]*"/, 'android:icon="@drawable/leadership_launcher"')
  .replace(/android:roundIcon="[^"]*"/, 'android:roundIcon="@drawable/leadership_launcher"');
if (!updatedTag.includes('android:icon=')) updatedTag = updatedTag.replace('<application', '<application android:icon="@drawable/leadership_launcher"');
if (!updatedTag.includes('android:roundIcon=')) updatedTag = updatedTag.replace('<application', '<application android:roundIcon="@drawable/leadership_launcher"');
if (updatedTag !== application[0]) writeFileSync(manifestPath, original.replace(application[0], updatedTag));
console.log('Leadership Empire Android launcher icon installed.');

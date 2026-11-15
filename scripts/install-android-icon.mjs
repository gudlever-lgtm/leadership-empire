import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const artwork = join(root, 'assets', 'leadership-icon-v2.png');
const logo = join(root, 'assets', 'leadership-logo-v2.png');
if (!existsSync(manifestPath)) throw new Error('AndroidManifest.xml mangler. Kør Capacitor add/sync først.');
if (!existsSync(artwork) || !existsSync(logo)) throw new Error('Leadership Empire logo/app-ikon mangler.');

const drawablePath = join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi');
mkdirSync(drawablePath, {recursive: true});
copyFileSync(artwork, join(drawablePath, 'leadership_launcher.png'));
copyFileSync(artwork, join(drawablePath, 'leadership_splash_art.png'));
writeFileSync(join(drawablePath, 'leadership_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item><shape android:shape="rectangle"><solid android:color="#103d43" /></shape></item>
    <item><bitmap android:gravity="center" android:src="@drawable/leadership_splash_art" /></item>
</layer-list>
`);

const original = readFileSync(manifestPath, 'utf8');
const application = original.match(/<application\b[^>]*>/);
if (!application) throw new Error('AndroidManifest.xml mangler application-tag.');
let updatedTag = application[0]
  .replace(/android:icon="[^"]*"/, 'android:icon="@drawable/leadership_launcher"')
  .replace(/android:roundIcon="[^"]*"/, 'android:roundIcon="@drawable/leadership_launcher"');
if (!updatedTag.includes('android:icon=')) updatedTag = updatedTag.replace('<application', '<application android:icon="@drawable/leadership_launcher"');
if (!updatedTag.includes('android:roundIcon=')) updatedTag = updatedTag.replace('<application', '<application android:roundIcon="@drawable/leadership_launcher"');
if (updatedTag !== application[0]) writeFileSync(manifestPath, original.replace(application[0], updatedTag));
const stylesDir = join(root, 'android', 'app', 'src', 'main', 'res', 'values');
const stylesPath = join(stylesDir, 'styles.xml');
if (!existsSync(stylesPath)) throw new Error('Android styles.xml mangler. Kan ikke opsætte native splash.');
const styles = readFileSync(stylesPath, 'utf8');
const launchStylePattern = /<style\b[^>]*name="AppTheme\.NoActionBarLaunch"[^>]*>[\s\S]*?<\/style>/;
const launchStyle = styles.match(launchStylePattern)?.[0];
if (!launchStyle) throw new Error('Android launch-theme blev ikke fundet i styles.xml.');
function setItem(style, name, value) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<item\\s+name="${escaped}"[^>]*>[\\s\\S]*?<\\/item>`);
  const item = `<item name="${name}">${value}</item>`;
  return pattern.test(style) ? style.replace(pattern, item) : style.replace('</style>', `    ${item}\n</style>`);
}
let nativeLaunch = setItem(launchStyle, 'android:windowBackground', '@drawable/leadership_splash');
nativeLaunch = setItem(nativeLaunch, 'android:background', '@drawable/leadership_splash');
writeFileSync(stylesPath, styles.replace(launchStylePattern, nativeLaunch));

// Android 12+ has a system-managed splash icon separate from the web loading page.
const v31Dir = join(root, 'android', 'app', 'src', 'main', 'res', 'values-v31');
mkdirSync(v31Dir, {recursive:true});
const v31Path = join(v31Dir, 'styles.xml');
const existingV31 = existsSync(v31Path) ? readFileSync(v31Path, 'utf8') : null;
const v31Style = existingV31?.match(launchStylePattern)?.[0] || launchStyle;
let android12 = setItem(v31Style, 'android:windowSplashScreenBackground', '#103d43');
android12 = setItem(android12, 'android:windowSplashScreenAnimatedIcon', '@drawable/leadership_launcher');
if (existingV31?.match(launchStylePattern)) writeFileSync(v31Path, existingV31.replace(launchStylePattern, android12));
else if (existingV31) writeFileSync(v31Path, existingV31.replace('</resources>', `${android12}\n</resources>`));
else writeFileSync(v31Path, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${android12}\n</resources>\n`);
console.log('Leadership Empire Android launcher icon and native splash installed.');

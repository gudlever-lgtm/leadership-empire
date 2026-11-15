import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

test('Android branding installs icon and splash for pre-Android-12 and Android-12+',()=>{
 const root=mkdtempSync(join(tmpdir(),'leadership-brand-'));
 try{
  for(const path of ['scripts','assets','android/app/src/main/res/values'])mkdirSync(join(root,path),{recursive:true});
  const source=new URL('../',import.meta.url);
  for(const name of ['leadership-icon-v2.png','leadership-logo-v2.png'])copyFileSync(new URL('assets/'+name,source),join(root,'assets',name));
  copyFileSync(new URL('scripts/install-android-icon.mjs',source),join(root,'scripts/install-android-icon.mjs'));
  writeFileSync(join(root,'android/app/src/main/AndroidManifest.xml'),'<manifest><application android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round"><activity android:theme="@style/AppTheme.NoActionBarLaunch" /></application></manifest>');
  writeFileSync(join(root,'android/app/src/main/res/values/styles.xml'),'<resources><style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar"><item name="android:background">@drawable/splash</item></style></resources>');
  const script=join(root,'scripts/install-android-icon.mjs');
  // The standalone file is ESM even without a package.json.
  writeFileSync(join(root,'package.json'),'{"type":"module"}');
  execFileSync(process.execPath,[script]);
  execFileSync(process.execPath,[script]); // Repeated sync must be idempotent.
  const main=join(root,'android/app/src/main');
  const manifest=readFileSync(join(main,'AndroidManifest.xml'),'utf8');
  const styles=readFileSync(join(main,'res/values/styles.xml'),'utf8');
  const android12=readFileSync(join(main,'res/values-v31/styles.xml'),'utf8');
  assert.match(manifest,/android:icon="@drawable\/leadership_launcher"/);
  assert.match(manifest,/android:roundIcon="@drawable\/leadership_launcher"/);
  assert.match(styles,/android:windowBackground">@drawable\/leadership_splash/);
  assert.match(android12,/android:windowSplashScreenAnimatedIcon">@drawable\/leadership_launcher/);
  assert.equal((styles.match(/android:background/g)||[]).length,1);
  for(const name of ['leadership_launcher.png','leadership_splash_art.png','leadership_splash.xml'])assert.ok(existsSync(join(main,'res/drawable-nodpi',name)));
 }finally{rmSync(root,{recursive:true,force:true})}
});

test('web startup holds the real premium logo while the application loads',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/id="startup-logo"[^>]*leadership-logo-v2\.png/);
 assert.match(html,/1800-\(Date\.now\(\)-splashStartedAt\)/);
});

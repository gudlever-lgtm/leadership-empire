import {cpSync, mkdirSync, copyFileSync, existsSync, rmSync} from 'node:fs';
import {join, resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const target=join(root,'www');
if(existsSync(target)) rmSync(target,{recursive:true,force:true});
mkdirSync(target,{recursive:true});
for(const name of ['index.html','styles.css','v02.css','app.js','manifest.webmanifest','service-worker.js']) copyFileSync(join(root,name),join(target,name));
cpSync(join(root,'assets'),join(target,'assets'),{recursive:true});
console.log('Android web bundle prepared in www/');

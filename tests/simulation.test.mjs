import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

function game(storage=new Map()){
 const elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',value:'',style:{},addEventListener(){},classList:{toggle(){}}});return elements.get(id)};
 const context={document:{getElementById:element,querySelector(){return null},querySelectorAll(){return []}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:true})},navigator:{},location:{protocol:'file:'},confirm:()=>true,alert(){},setInterval(){},console};
 runInNewContext(readFileSync(new URL('../engine.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../scenarios.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../crises.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../academy.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../advisors.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../performance.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../app.js',import.meta.url),'utf8'),context);
 return code=>runInNewContext(code,context);
}

test('first dialogue changes trust and advances stage',()=>{
 const run=game();
 assert.equal(run('state.stage'),0);
 run('applyChoice(1)');
 assert.equal(run('state.stage'),1);
 assert.equal(run('state.trust'),65);
 run('applyFollowup(0)');
 assert.equal(run('state.stage'),2);
 assert.equal(run('state.budget'),74);
});

test('new dilemmas emerge after day fourteen and alter relations',()=>{
 const run=game();
 run('applyChoice(1);applyFollowup(0)');
 for(let i=1;i<15;i++)run('advance()');
 assert.equal(run('state.day'),15);
 assert.equal(run('state.stage'),3);
 assert.equal(run('state.eventOpen'),true);
 const before=run('state.relations[1]');
 run('resolveEvent(0)');
 assert.equal(run('state.relations[1]'),before+7);
 assert.equal(run('state.eventIndex'),1);
 assert.equal(run('state.eventOpen'),false);
});

test('reset includes independent relationship and energy arrays',()=>{
 const run=game();
 run('state.relations[0]=10;state={...DEFAULT,relations:DEFAULT.relations.slice(),energy:DEFAULT.energy.slice()}');
 assert.equal(run('state.relations[0]'),68);
});

test('v0.3 office zoom is bounded',()=>{
 const run=game();
 run('setZoom(3)');
 assert.equal(run('zoom'),1.6);
 run('setZoom(.2)');
 assert.equal(run('zoom'),1);
});

test('new illustrated office asset is referenced by stylesheet',()=>{
 const style=readFileSync(new URL('../v03.css',import.meta.url),'utf8');
 assert.match(style,/office-v03\.png/);
});

test('new career resets progress and adapts employee roles to department',()=>{
 const run=game();
 run('applyChoice(1);advance()');
 assert.equal(run('state.day'),2);
 assert.equal(run("startCareer({org:'ngo',size:'small',department:'hr'})"),true);
 assert.equal(run('state.day'),1);
 assert.equal(run('state.stage'),0);
 assert.equal(run('state.budget'),65);
 assert.equal(run('roleFor(PEOPLE[0])'),'Senior HR-partner');
});

test('later scenario reflects the selected department',()=>{
 const run=game();
 run("startCareer({org:'private',size:'large',department:'production'});state.eventIndex=2");
 assert.match(run('scenario().title'),/kvalitetsproces/);
});

test('unsupported department is rejected without replacing the game',()=>{
 const run=game();
 assert.equal(run("startCareer({org:'public',size:'small',department:'unknown'})"),false);
 assert.equal(run('state.config.department'),'it');
});

test('work engine advances tasks reproducibly and closes at day 100',()=>{
 const a=game(),b=game();
 while(a('state.day')<100){if(a('state.eventOpen')){a('resolveEvent(0)');b('resolveEvent(0)')}a('advance()');b('advance()')}
 assert.equal(a('state.day'),100);
 assert.equal(a('state.world.day'),100);
 assert.ok(a('state.world.completed')>0);
 assert.equal(a('JSON.stringify(state.world)'),b('JSON.stringify(state.world)'));
 a('advance()');
 assert.equal(a('state.day'),100);
});

test('employees can train and tasks can be reassigned',()=>{
 const run=game();
 const before=run('state.world.team[0].skill');
 run("employeeAction('train',0)");
 assert.equal(run('state.world.team[0].skill'),before+5);
 const id=run('state.world.tasks[0].id');
 run(`reassign(${id},3)`);
 assert.equal(run('state.world.tasks[0].assigned'),3);
});

test('departments have different task categories and demand',()=>{
 const it=game(),hr=game();
 hr("startCareer({org:'public',size:'medium',department:'hr'})");
 assert.notEqual(it('state.world.tasks[0].title'),hr('state.world.tasks[0].title'));
 for(let i=0;i<30;i++){it('advance()');hr('advance()')}
 assert.notEqual(it('state.world.tasks.length'),hr('state.world.tasks.length'));
});

test('priority policy can change without altering existing tasks',()=>{
 const run=game();
 const before=run('state.world.tasks.length');
 run("setWorkPolicy('deadline')");
 assert.equal(run('state.world.policy.priority'),'deadline');
 assert.equal(run('state.world.tasks.length'),before);
});

test('full hundred days plays through many decisions without exhausted cases',()=>{
 const run=game();
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<100){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 if(run('state.eventOpen'))run('resolveEvent(0)');
 assert.equal(run('state.day'),100);
 assert.ok(run('state.eventIndex')>=15);
 assert.equal(run('state.eventOpen'),false);
});

test('academy offers three complete modules and preserves reflection',()=>{
 const run=game();
 assert.equal(run('LeadershipAcademy.modules.length'),3);
 run("academySelect(1);academyAnswer(0);document.getElementById('reflection').value='Jeg ville aftale opfølgning efter to uger.';academySave()");
 assert.equal(run('state.academy.completed.length'),1);
 assert.equal(run('state.academy.selected'),1);
 assert.match(run('state.academy.notes.motivation'),/opfølgning/);
});

test('every scenario has three decisions and explanation text',()=>{
 const run=game();
 for(const dept of ['it','hr','production','software','support','finance','administration']){
  for(let i=0;i<run(`LeadershipScenarios.count('${dept}')`);i++){
   const entry=run(`LeadershipScenarios.get('${dept}',${i})`);
   assert.equal(entry.options.length,3);
   assert.ok(entry.title.length>5);
   assert.ok(entry.options.every(choice=>choice[1].length>10));
  }
 }
});

test('saved games can be imported into a fresh career',async()=>{
 const run=game();
 run('applyChoice(1);applyFollowup(0);advance()');
 const exported=run('JSON.stringify({format:"leadership-empire-save",version:1,game:state})');
 run("startCareer({org:'ngo',size:'small',department:'hr'})");
 assert.equal(run('state.day'),1);
 const validFile={text:async()=>exported};
 assert.equal(await run('importGame') (validFile),true);
 assert.equal(run('state.day'),2);
 assert.equal(run('state.config.department'),'it');
});

test('week advance pauses at leadership decisions',()=>{
 const run=game();
 run('applyChoice(1);applyFollowup(0);advanceWeek()');
 assert.equal(run('state.day'),8);
 run('advanceWeek()');
 assert.equal(run('state.day'),15);
 assert.equal(run('state.eventOpen'),true);
});

test('PWA has production icons and all mandatory scripts',()=>{
 const root=new URL('../',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('manifest.webmanifest',root),'utf8'));
 for(const icon of manifest.icons)assert.ok(existsSync(new URL(icon.src,root)),icon.src);
 const html=readFileSync(new URL('index.html',root),'utf8');
 for(const name of ['engine.js','scenarios.js','academy.js','app.js'])assert.match(html,new RegExp(name.replace('.','\\.')));
});

test('leadership actions are limited per day and reset next day',()=>{
 const run=game();
 for(let i=0;i<3;i++)run("employeeAction('talk',0)");
 assert.equal(run('state.world.actionsRemaining'),0);
 assert.equal(run("LeadershipEngine.action(state.world,'talk',0)"),false);
 run('advance()');
 assert.equal(run('state.world.actionsRemaining'),3);
});

test('organization size changes workload and private budget differs',()=>{
 const run=game();
 run("startCareer({org:'private',size:'large',department:'it'})");
 assert.equal(run('state.world.tasks.length'),18);
 assert.equal(run('state.world.organization'),'private');
 assert.equal(run('state.budget'),85);
 run("startCareer({org:'ngo',size:'small',department:'it'})");
 assert.equal(run('state.world.tasks.length'),10);
 assert.equal(run('state.budget'),65);
});

test('all seven departments finish a full career with valid values',()=>{
 for(const department of ['it','software','hr','finance','support','production','administration']){
  const run=game();
  run(`startCareer({org:'public',size:'medium',department:'${department}'})`);
  run('applyChoice(1);applyFollowup(0)');
  while(run('state.day')<100){if(run('state.eventOpen'))run('resolveEvent(1)');run('advance()')}
  if(run('state.eventOpen'))run('resolveEvent(1)');
  assert.equal(run('state.world.day'),100,department);
  assert.ok(run('state.eventIndex')>=15,department);
  assert.equal(run('state.world.completed')>0,true,department);
  assert.equal(run('validWorld(state.world)'),true,department);
  assert.match(run('finalReport()'),/100 dage gennemført/,department);
 }
});

test('100-day regression: 21 careers retain progress, metrics and deterministic results',()=>{
 const departments=['it','software','hr','finance','support','production','administration'];
 const organizations=['public','private','ngo'];
 let completed=0;
 for(const department of departments)for(const org of organizations){
  const storage=new Map(),run=game(storage);
  run(`startCareer({org:'${org}',size:'medium',department:'${department}'})`);
  run('applyChoice(1);applyFollowup(0)');
  while(run('state.day')<100){
   if(run('state.eventOpen'))run('resolveEvent(1)');
   const previous=run('state.day');
   run('advance()');
   assert.equal(run('state.day'),previous+1,`${department}/${org} stalled on day ${previous}`);
   assert.equal(run('validWorld(state.world)'),true,`${department}/${org} invalid world on day ${previous+1}`);
   for(const key of ['trust','wellbeing','delivery','budget','quality','learning']){
    const value=run(`state.world.metrics.${key}`);
    assert.ok(Number.isFinite(value)&&value>=0&&value<=100,`${department}/${org} ${key} day ${previous+1}`);
   }
  }
  if(run('state.eventOpen'))run('resolveEvent(1)');
  assert.equal(run('state.day'),100);
  assert.ok(run('state.world.completed')>0);
  assert.match(run('finalReport()'),/100 dage gennemført/);
  const saved=run('JSON.stringify(state)');
  const resumed=game(storage);
  assert.equal(resumed('JSON.stringify(state)'),saved,`${department}/${org} save/resume mismatch`);
  resumed('advance()');
  assert.equal(resumed('state.day'),100);
  completed++;
 }
 assert.equal(completed,21);
});

test('branded loading screen is shipped with the Android web bundle',()=>{
 const root=new URL('../',import.meta.url);
 const html=readFileSync(new URL('index.html',root),'utf8');
 const bundle=readFileSync(new URL('scripts/prepare-android.mjs',root),'utf8');
 assert.match(html,/id="startup-splash"/);
 assert.match(html,/startup-splash[\s\S]*leadership-logo-v2\.png/);
 assert.match(html,/is-ready/);
 assert.match(bundle,/cpSync\(join\(root,'assets'\)/);
});

test('configurable crises: 4 and 10 events with persisted leadership settings',()=>{
 for(const count of [4,10]){
  const storage=new Map(),run=game(storage);
  assert.equal(run(`startCareer({org:'public',size:'medium',department:'hr',position:'executive',experience:'veteran',risk:'cautious',incidentCount:${count},accountability:'off'})`),true);
  run('applyChoice(1);applyFollowup(0)');
  while(run('state.day')<100){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
  if(run('state.eventOpen'))run('resolveEvent(0)');
  assert.equal(run('state.crisis.resolved.length'),count);
  assert.equal(run('state.crisis.fired'),false);
  const resumed=game(storage);
  assert.equal(resumed('state.config.position'),'executive');
  assert.equal(resumed('state.config.incidentCount'),count);
  assert.equal(resumed('state.crisis.resolved.length'),count);
 }
});

test('repeated reckless crisis handling can fire the leader and stop the career',()=>{
 const run=game();
 run("startCareer({org:'private',size:'medium',department:'it',position:'team',experience:'new',risk:'bold',incidentCount:10,accountability:'strict'})");
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<100&&!run('state.crisis.fired')){
  if(run('state.eventOpen'))run('resolveEvent(state.crisis.open?2:0)');
  if(!run('state.crisis.fired'))run('advance()');
 }
 assert.equal(run('state.crisis.fired'),true);
 assert.ok(run('state.day')<100);
 assert.match(run('finalReport()'),/F\*CKING FYRET/);
 const before=run('state.day');run('advance()');assert.equal(run('state.day'),before);
});

test('V1 saves migrate without replaying crises from earlier days',()=>{
 const storage=new Map(),run=game(storage);
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<60){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 const old=JSON.parse(storage.get('leadership-empire-prototype-v2'));delete old.crisis;
 storage.set('leadership-empire-prototype-v2',JSON.stringify(old));
 const resumed=game(storage);
 assert.equal(resumed('state.day'),60);
 assert.equal(resumed('state.crisis.schedule[state.crisis.cursor].day')>60,true);
});

test('authority and experience change crisis outcomes',()=>{
 const team=game(),executive=game();
 team("startCareer({org:'public',size:'medium',department:'it',position:'team',experience:'new',risk:'balanced',incidentCount:4,accountability:'normal'})");
 executive("startCareer({org:'public',size:'medium',department:'it',position:'executive',experience:'veteran',risk:'balanced',incidentCount:4,accountability:'normal'})");
 for(const run of [team,executive]){run('applyChoice(1);applyFollowup(0)');while(!run('state.crisis.open')){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}run('resolveEvent(1)')}
 assert.ok(team('state.crisis.exposure')>executive('state.crisis.exposure'));
 assert.ok(team('state.trust')<executive('state.trust'));
});

test('JE and JM can be hired with game budget and deliver contextual advice',()=>{
 const run=game();
 assert.equal(run("LeadershipAdvisors.hire(state,'JE')"),true);
 assert.equal(run('state.budget'),66);
 assert.equal(run("LeadershipAdvisors.hire(state,'JE')"),false);
 assert.equal(run("LeadershipAdvisors.hire(state,'JM')"),true);
 assert.equal(run('state.budget'),59);
 assert.equal(run("LeadershipAdvisors.request(state,'JM')"),true);
 assert.match(run('state.advisors.messages[0].text'),/JM:/);
 assert.equal(run("LeadershipAdvisors.request(state,'JM')"),true);
 assert.equal(run('state.budget'),58);
});

test('advisors generate weekly advice and survive save/resume',()=>{
 const storage=new Map(),run=game(storage);
 run("LeadershipAdvisors.hire(state,'JE');LeadershipAdvisors.hire(state,'JM');save()");
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<14){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 assert.equal(run('state.advisors.autoDay'),14);
 assert.equal(run('state.advisors.messages.filter(m=>m.kind==="advice").length'),4);
 const saved=run('JSON.stringify(state.advisors)');
 const resumed=game(storage);
 assert.equal(resumed('JSON.stringify(state.advisors)'),saved);
});

test('floating guide and both advisors are included in Android and offline builds',()=>{
 const root=new URL('../',import.meta.url);
 const html=readFileSync(new URL('index.html',root),'utf8');
 const bundle=readFileSync(new URL('scripts/prepare-android.mjs',root),'utf8');
 const worker=readFileSync(new URL('service-worker.js',root),'utf8');
 assert.match(html,/id="guide-fab"/);
 assert.match(html,/id="guide-dialog"/);
 for(const file of ['advisors.js','v11.css']){
  assert.match(html,new RegExp(file.replace('.','\\.')));
  assert.ok(bundle.includes(file));
  assert.ok(worker.includes(file));
 }
});

test('performance center records seven appraisals by day 100 with manager and employee feedback',()=>{
 const run=game();
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<100){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 assert.equal(run('state.performance.reports.length'),7);
 assert.equal(run('JSON.stringify(state.performance.reports.map(r=>r.day))'),'[15,30,45,60,75,90,100]');
 for(const report of JSON.parse(run('JSON.stringify(state.performance.reports)'))){
  assert.equal(report.sections.length,2);
  assert.equal(report.sections[0].source,'Overordnet ledelse');
  assert.equal(report.sections[1].source,'Medarbejdernes vurdering');
  assert.ok(report.sections.every(s=>s.text.length>20&&s.recommendation.length>20));
  assert.ok(report.overall>=0&&report.overall<=100);
 }
 assert.match(run('performancePanel()'),/Performance Center/);
});

test('hired JE and JM participate in later appraisals and use distinct voices',()=>{
 const run=game();
 run("LeadershipAdvisors.hire(state,'JE');LeadershipAdvisors.hire(state,'JM')");
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<15){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 assert.equal(run('state.performance.reports[0].sections.length'),4);
 assert.match(run('state.performance.reports[0].sections[2].source'),/JE/);
 assert.match(run('state.performance.reports[0].sections[3].source'),/JM/);
 assert.match(run("LeadershipAdvisors.advice(state,'JE')"),/JE:/);
 assert.match(run("LeadershipAdvisors.advice(state,'JM')"),/JM:/);
 assert.notEqual(run("LeadershipAdvisors.advice(state,'JE')"),run("LeadershipAdvisors.advice(state,'JM')"));
});

test('performance reports are persisted and legacy saves initialize safely',()=>{
 const storage=new Map(),run=game(storage);
 run('applyChoice(1);applyFollowup(0)');
 while(run('state.day')<30){if(run('state.eventOpen'))run('resolveEvent(0)');run('advance()')}
 const saved=run('JSON.stringify(state.performance)');
 assert.equal(game(storage)('JSON.stringify(state.performance)'),saved);
 const old=JSON.parse(storage.get('leadership-empire-prototype-v2'));delete old.performance;
 storage.set('leadership-empire-prototype-v2',JSON.stringify(old));
 assert.equal(game(storage)('state.performance.reports.length'),0);
});

test('performance center assets are bundled for offline and Android',()=>{
 const root=new URL('../',import.meta.url);
 const html=readFileSync(new URL('index.html',root),'utf8');
 const bundle=readFileSync(new URL('scripts/prepare-android.mjs',root),'utf8');
 const worker=readFileSync(new URL('service-worker.js',root),'utf8');
 assert.match(html,/data-view="performance"/);
 for(const name of ['performance.js','v12.css']){assert.ok(html.includes(name));assert.ok(bundle.includes(name));assert.ok(worker.includes(name))}
});

test('invalid save data is rejected without replacing the current game',async()=>{
 const run=game();
 const data=JSON.parse(run('JSON.stringify({format:"leadership-empire-save",version:1,game:state})'));
 data.game.world.tasks[0].assigned=999;
 assert.equal(await run('importGame')({text:async()=>JSON.stringify(data)}),false);
 assert.equal(run('state.day'),1);
 assert.equal(run('state.world.tasks[0].assigned'),0);
});

test('v1 graphical assets are present and included in offline/android package',()=>{
 const root=new URL('../',import.meta.url);
 const html=readFileSync(new URL('index.html',root),'utf8');
 const stylesheet=readFileSync(new URL('v10.css',root),'utf8');
 const worker=readFileSync(new URL('service-worker.js',root),'utf8');
 const script=readFileSync(new URL('scripts/prepare-android.mjs',root),'utf8');
 for(const name of ['employee-female-v1.png','employee-male-v1.png']){
  assert.ok(existsSync(new URL('assets/'+name,root)),name);
  assert.ok(worker.includes(name),name);
 }
 assert.match(html,/v10\.css/);
 assert.match(stylesheet,/character-sprite/);
 assert.match(script,/v10\.css/);
 assert.match(worker,/leadership-empire-v(?:1\.0|2)/);
});

test('Windows APK target and standalone website card are configured',()=>{
 const root=new URL('../',import.meta.url);
 const build=readFileSync(new URL('build-android.ps1',root),'utf8');
 const card=readFileSync(new URL('deploy/dulmens-leadership-card.html',root),'utf8');
 assert.match(build,/C:\\Users\\osoma\\Downloads/);
 assert.match(build,/leader\.apk/);
 assert.match(build,/copiedChecksum/);
 for(const name of ['leader.apk','leader-logo.svg','leader-qr.svg'])assert.ok(card.includes('/downloads/'+name));
 assert.ok(existsSync(new URL('assets/leader-qr.svg',root)));
});

test('premium logo and four-column website download page are bundled',()=>{
 const root=new URL('../',import.meta.url);
 const html=readFileSync(new URL('index.html',root),'utf8');
 const homepage=readFileSync(new URL('deploy/dulmens-index-v2.html',root),'utf8');
 const manifest=JSON.parse(readFileSync(new URL('manifest.webmanifest',root),'utf8'));
 assert.ok(existsSync(new URL('assets/leadership-logo-v2.png',root)));
 assert.ok(existsSync(new URL('assets/leadership-icon-v2.png',root)));
 assert.match(html,/leadership-logo-v2\.png/);
 assert.match(homepage,/repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(homepage,/leader-logo\.png/);
 assert.equal((homepage.match(/<article class="card"/g)||[]).length,4);
 assert.ok(manifest.icons.some(icon=>icon.src==='assets/leadership-icon-v2.png'));
});

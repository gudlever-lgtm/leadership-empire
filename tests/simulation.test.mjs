import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

function game(){
 const elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',value:'',style:{},addEventListener(){},classList:{toggle(){}}});return elements.get(id)};
 const storage=new Map();
 const context={document:{getElementById:element,querySelectorAll(){return []}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:true})},navigator:{},location:{protocol:'file:'},confirm:()=>true,alert(){},setInterval(){},console};
 runInNewContext(readFileSync(new URL('../engine.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../scenarios.js',import.meta.url),'utf8'),context);
 runInNewContext(readFileSync(new URL('../academy.js',import.meta.url),'utf8'),context);
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
 for(let i=0;i<99;i++){a('advance()');b('advance()')}
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
 assert.match(worker,/leadership-empire-v1\.0/);
});

test('Windows APK target and standalone website card are configured',()=>{
 const root=new URL('../',import.meta.url);
 const build=readFileSync(new URL('build-android.ps1',root),'utf8');
 const card=readFileSync(new URL('deploy/dulmens-leadership-card.html',root),'utf8');
 assert.match(build,/C:\\Users\\osoman\\Downloads/);
 assert.match(build,/leader\.apk/);
 assert.match(build,/copiedChecksum/);
 for(const name of ['leader.apk','leader-logo.svg','leader-qr.svg'])assert.ok(card.includes('/downloads/'+name));
 assert.ok(existsSync(new URL('assets/leader-qr.svg',root)));
});

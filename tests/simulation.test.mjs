import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

function game(){
 const elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',value:'',addEventListener(){},classList:{toggle(){}}});return elements.get(id)};
 const storage=new Map();
 const context={document:{getElementById:element,querySelectorAll(){return []}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:true})},navigator:{},location:{protocol:'file:'},confirm:()=>true,setInterval(){},console};
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

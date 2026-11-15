/* Deterministic multi-day case threads. Fictional gameplay effects, not personnel predictions. */
(function(global){
 'use strict';
 const TYPES={
  conflict:{name:'Samarbejdet efter konflikten',person:'Maria og Peter',metric:'trust',risk:'Uenigheden kan påvirke den gensidige tillid.',advice:'Tal med begge parter, og skriv fælles aftaler ned.',good:'Maria og Peter fortæller, at ansvarsfordelingen er blevet mere tydelig.',bad:'Maria og Peter oplever fortsat friktion i samarbejdet.'},
  workload:{name:'Arbejdspres og prioritering',person:'Sara og Mette',metric:'wellbeing',risk:'En høj opgavemængde kan slide på medarbejdernes overskud.',advice:'Spørg til belastning og fravælg mindst én mindre vigtig opgave.',good:'Teamet oplever mere realistiske prioriteringer.',bad:'Flere medarbejdere oplever, at arbejdet fortsat er uoverskueligt.'},
  change:{name:'Indførelse af en ny arbejdsproces',person:'Thomas og Sara',metric:'delivery',risk:'En ændring uden feedback kan skabe skjulte fejl og modstand.',advice:'Afprøv ændringen med få medarbejdere, og aftal mål for kvalitet.',good:'De første erfaringer giver bedre fælles praksis.',bad:'Implementeringen skaber ekstra fejlretning og forsinkelser.'}
 };
 function initial(){return {threads:[],nextId:1,updates:[]}}
 function normalize(raw){const next={...initial(),...(raw||{})};next.threads=Array.isArray(next.threads)?next.threads.filter(t=>TYPES[t.type]&&Number.isInteger(t.start)&&Number.isInteger(t.close)).slice(-40):[];next.updates=Array.isArray(next.updates)?next.updates.slice(-60):[];next.nextId=Math.max(Number.isInteger(next.nextId)?next.nextId:1,...next.threads.map(t=>t.id+1),1);return next}
 function cap(n){return Math.max(0,Math.min(100,Math.round(n)))}
 function start(state,type,choice,decision){
  if(!TYPES[type]||![0,1,2].includes(choice))return false;
  const s=state.consequences;
  s.threads.push({id:s.nextId++,type,start:state.day,checkpoint:Math.min(100,state.day+4),close:Math.min(100,state.day+11),choice,decision:String(decision),response:null,status:'monitoring',feedback:[],outcome:null});
  s.threads=s.threads.slice(-40);return true;
 }
 function update(state,thread,text,stage){const note={day:state.day,threadId:thread.id,type:thread.type,stage,text};thread.feedback.push(note);state.consequences.updates.push(note);state.consequences.updates=state.consequences.updates.slice(-60);state.world.log.push({day:state.day,text})}
 function apply(state,impacts){for(const [key,delta] of Object.entries(impacts)){state.world.metrics[key]=cap(state.world.metrics[key]+delta);state[key]=state.world.metrics[key]}}
 function tick(state){
  for(const t of state.consequences.threads){
   if(t.status==='closed')continue;
   const data=TYPES[t.type];
   if(t.status==='monitoring'&&state.day>=t.checkpoint){
    t.status='awaiting';update(state,t,`${data.person}: ${data.risk} Du kan følge op før dag ${t.close}.`,'checkpoint');
   }
   if(state.day>=t.close){
    let delta=t.choice===0?2:t.choice===1?-3:-2;
    if(t.response==='dialog')delta+=4;
    if(t.response==='escalate')delta+=2;
    if(t.response==='wait')delta-=1;
    apply(state,{[data.metric]:delta});
    t.outcome={metric:data.metric,delta,result:state[data.metric]};t.status='closed';
    update(state,t,`${delta>=0?data.good:data.bad} ${data.metric==='trust'?'Tillid':data.metric==='wellbeing'?'Trivsel':'Leverancer'} ${delta>=0?'+':''}${delta}.`,'resolution');
   }
  }
 }
 function respond(state,id,kind){
  const t=state.consequences.threads.find(x=>x.id===id);
  if(!t||t.status!=='awaiting'||!['dialog','escalate','wait'].includes(kind)||state.day>=t.close)return false;
  if(kind==='escalate'&&state.budget<3)return false;
  if(kind==='escalate')apply(state,{budget:-3});
  t.response=kind;t.status='responded';
  const phrase=kind==='dialog'?'Du holder en opfølgende dialog og laver en konkret aftale.':kind==='escalate'?'Du henter tværgående hjælp og prioriterer ressourcer.':'Du vælger at observere udviklingen uden et nyt indgreb.';
  update(state,t,phrase,'response');return true;
 }
 global.LeadershipConsequences={TYPES,initial,normalize,start,tick,respond};
})(globalThis);

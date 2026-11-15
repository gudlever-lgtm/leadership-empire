/* Employee-initiated situations in a deterministic, fictional management game. */
(function(global){
 'use strict';
 const TYPES={
  idea:{title:'Forslag fra medarbejderen',description:'har en idé til at forbedre afdelingens arbejdsgange og vil gerne afprøve den.',goal:'change'},
  support:{title:'Ønske om faglig udvikling',description:'beder om sparring og et tydeligere udviklingsforløb.',goal:'support'},
  warning:{title:'Bekymring om arbejdspres',description:'gør opmærksom på opgaver, der skaber et stigende pres.',goal:'structure'},
  challenge:{title:'Udfordrer en beslutning',description:'stiller spørgsmål ved en nylig prioritering og ønsker større indflydelse.',goal:'autonomy'}
 };
 function initial(){return {items:[],nextId:1}}
 function normalize(raw){const s={...initial(),...(raw||{})};s.items=Array.isArray(s.items)?s.items.filter(x=>x&&TYPES[x.type]&&Number.isInteger(x.id)&&Number.isInteger(x.day)).slice(-24):[];s.nextId=Math.max(Number.isInteger(s.nextId)?s.nextId:1,...s.items.map(x=>x.id+1),1);return s}
 function cap(n){return Math.max(0,Math.min(100,Math.round(n*10)/10))}
 function generate(state){
  if(state.day<9||state.day%12!==9||state.day>93||state.crisis?.fired)return false;
  const id=Math.floor(state.day/12)*5%state.world.team.length;
  const member=state.world.team[id],profile=global.LeadershipPersonalities.personality(id);
  let type=profile.change>=4?'idea':profile.support>=4?'support':profile.structure>=4?'warning':'challenge';
  if(member.energy<48)type='warning';
  const item={id:state.initiatives.nextId++,personId:id,type,day:state.day,deadline:Math.min(100,state.day+6),status:'pending',response:null,effect:null};
  state.initiatives.items.push(item);state.initiatives.items=state.initiatives.items.slice(-24);
  state.world.log.push({day:state.day,text:`Medarbejder ${id+1} tager initiativ: ${TYPES[type].title}`});
  return true;
 }
 function impact(state,item,motivation,relation,trust,budget=0){
  const member=state.world.team[item.personId];
  member.motivation=cap(member.motivation+motivation);member.relation=cap(member.relation+relation);
  state.world.metrics.trust=cap(state.world.metrics.trust+trust);
  state.world.metrics.budget=cap(state.world.metrics.budget+budget);
  state.trust=Math.round(state.world.metrics.trust);state.budget=Math.round(state.world.metrics.budget);
  item.effect={motivation,relation,trust,budget};
 }
 function respond(state,id,action){
  const item=state.initiatives.items.find(x=>x.id===id);
  if(!item||item.status!=='pending'||state.day>item.deadline||!['listen','support','postpone'].includes(action))return false;
  if(action==='support'&&state.budget<3)return false;
  const profile=global.LeadershipPersonalities.personality(item.personId),member=state.world.team[item.personId];
  const need=TYPES[item.type].goal,match=profile[need]-3,relationship=member.relation>=75?1:member.relation<45?-1:0;
  const motivation=action==='listen'?3+match+relationship:action==='support'?5+match+relationship:-3-match;
  impact(state,item,motivation,Math.round(motivation/2),action==='postpone'?-2:1,action==='support'?-3:0);
  item.status='resolved';item.response=action;
  const choice=action==='listen'?'Du lytter og aftaler næste skridt.':action==='support'?'Du afsætter tid og ressourcer til idéen.':'Du udsætter ønsket uden ny aftale.';
  state.world.log.push({day:state.day,text:choice});
  return true;
 }
 function tick(state){
  for(const item of state.initiatives.items){
   if(item.status==='pending'&&state.day>item.deadline){item.status='expired';item.response='unanswered';impact(state,item,-4,-2,-2);state.world.log.push({day:state.day,text:'Et medarbejderinitiativ blev ikke besvaret.'})}
  }
  generate(state);
 }
 global.LeadershipInitiatives={TYPES,initial,normalize,generate,respond,tick};
})(globalThis);

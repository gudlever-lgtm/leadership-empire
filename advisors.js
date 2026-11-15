/* In-game management advisors. No remote AI service or real-money purchases. */
(function(global){
 'use strict';
 const CATALOG={
  JE:{name:'JE',title:'Topmanagement & strategi',cost:12,scope:'Direktion, governance, risiko, strategi'},
  JM:{name:'JM',title:'Ledelse i praksis',cost:7,scope:'Medarbejdere, prioritering, samarbejde, drift'}
 };
 function initial(){return {hired:[],lastDay:{},autoDay:0,lastSeenDay:0,messages:[]}}
 function normalize(raw){const a={...initial(),...(raw||{})};a.hired=Array.isArray(a.hired)?a.hired.filter(id=>CATALOG[id]):[];a.messages=Array.isArray(a.messages)?a.messages.slice(-30):[];a.lastDay=a.lastDay&&typeof a.lastDay==='object'?a.lastDay:{};return a}
 function advice(state,id){
  const metrics=state.world.metrics,crisis=state.crisis,open=state.world.tasks.filter(t=>t.status==='open').length;
  if(id==='JE'){
   if(crisis?.open)return 'JE: Afklar mandat og beslutningsvej. Eskalér væsentlige risici tidligt; dokumentér både konsekvenser og alternative valg.';
   if(crisis?.exposure>=2)return 'JE: Din samlede risikoeksponering vokser. Giv direktionen et ærligt risikobillede og en plan for genopretning.';
   if(metrics.budget<35)return 'JE: Budgettet er under pres. Prioritér strategiske mål, identificér bindinger og fremlæg realistiske besparelsesscenarier.';
   if(metrics.delivery<45)return 'JE: Leveranceevnen er udfordret. Aftal forventninger med interessenter og vis en prioriteret plan med tydelige risici.';
   return 'JE: Tænk på tværs af organisationen. Hvad skal direktionen vide nu, og hvad kan blive en væsentlig risiko om 30 dage?';
  }
  if(crisis?.open)return 'JM: Tal med medarbejderne om den konkrete påvirkning. Fordel ansvar, beskyt kapacitet og aftal en kort opfølgning.';
  if(metrics.wellbeing<50)return 'JM: Trivslen er lav. Undersøg belastning og motivation i samtaler, og fjern eller omfordel opgaver.';
  if(open>30)return 'JM: Opgavekøen vokser. Lav tydelig prioritering og undgå at sprede specialisterne over for mange samtidige opgaver.';
  if(metrics.trust<50)return 'JM: Tilliden er presset. Lyt først, forklar dine beslutninger og følg synligt op på aftaler.';
  return 'JM: Skab ro og fremdrift. Hold korte en-til-en-samtaler, anerkend gode leverancer og gør prioriteringer tydelige.';
 }
 function hire(state,id){const a=state.advisors,def=CATALOG[id];if(!def||a.hired.includes(id)||state.crisis?.fired||state.world.metrics.budget<def.cost)return false;a.hired.push(id);state.world.metrics.budget=Math.max(0,state.world.metrics.budget-def.cost);state.budget=Math.round(state.world.metrics.budget);a.messages.unshift({day:state.day,id,text:`${id} er nu tilknyttet som managementkonsulent.`,kind:'hire'});a.messages=a.messages.slice(0,30);return true}
 function request(state,id){const a=state.advisors;if(!a.hired.includes(id)||state.crisis?.fired)return false;const cost=a.lastDay[id]===state.day?1:0;if(state.world.metrics.budget<cost)return false;state.world.metrics.budget=Math.max(0,state.world.metrics.budget-cost);state.budget=Math.round(state.world.metrics.budget);a.lastDay[id]=state.day;a.messages.unshift({day:state.day,id,text:advice(state,id),kind:'advice'});a.messages=a.messages.slice(0,30);return true}
 function advance(state){const a=state.advisors;if(state.day<7||state.day%7!==0||a.autoDay===state.day||!a.hired.length||state.crisis?.fired)return false;a.autoDay=state.day;for(const id of a.hired)a.messages.unshift({day:state.day,id,text:advice(state,id),kind:'advice'});a.messages=a.messages.slice(0,30);return true}
 global.LeadershipAdvisors={CATALOG,initial,normalize,hire,request,advance,advice};
})(globalThis);

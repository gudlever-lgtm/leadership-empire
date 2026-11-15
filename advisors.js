/* In-game management advisors. No remote AI service or real-money purchases. */
(function(global){
 'use strict';
 const CATALOG={
  JE:{name:'JE',title:'Topmanagement & strategi',cost:12,scope:'Direktion, governance, risiko, strategi',persona:'Kontant, ambitiøs og analytisk. Taler i mandat, konsekvens og beslutningsrum.'},
  JM:{name:'JM',title:'Ledelse i praksis',cost:7,scope:'Medarbejdere, prioritering, samarbejde, drift',persona:'Jordnær, erfaren og direkte. Går efter den næste brugbare handling og tager temperaturen på teamet.'}
 };
 function initial(){return {hired:[],lastDay:{},autoDay:0,lastSeenDay:0,messages:[]}}
 function normalize(raw){const a={...initial(),...(raw||{})};a.hired=Array.isArray(a.hired)?a.hired.filter(id=>CATALOG[id]):[];a.messages=Array.isArray(a.messages)?a.messages.slice(-30):[];a.lastDay=a.lastDay&&typeof a.lastDay==='object'?a.lastDay:{};return a}
 function advice(state,id){
  const metrics=state.world.metrics,crisis=state.crisis,open=state.world.tasks.filter(t=>t.status==='open').length;
  if(id==='JE'){
   if(crisis?.open)return 'JE: Vi skal ikke håbe os ud af en krise. Afklar mandatet, eskalér væsentlige risici og læg tre reelle beslutningsmuligheder på direktionsbordet.';
   if(crisis?.exposure>=2)return 'JE: Du er ved at bruge din risikokapital. Direktionen skal have sandheden, konsekvensen og din genopretningsplan. Nu.';
   if(metrics.budget<35)return 'JE: Budgettet bløder. Stop med at fordele smerten ligeligt. Beskyt det strategisk vigtige og fremlæg tre tydelige besparelsesscenarier.';
   if(metrics.delivery<45)return 'JE: Der er for langt mellem løfter og leverancer. Genforhandl forventninger, sæt en prioriteret portefølje og få opbakning til fravalg.';
   return 'JE: Tænk et niveau højere. Hvilken beslutning skal direktionen træffe, og hvilken risiko vil du have dem til at eje?';
  }
  if(crisis?.open)return 'JM: Rolig nu. Find ud af hvem der er ramt, tag en kort snak med folkene, fordel opgaverne og aftal en opfølgning allerede i morgen.';
  if(metrics.wellbeing<50)return 'JM: Folk er trætte, og det går ikke væk med en pep-talk. Spørg hvad der presser dem, og fjern konkret arbejde fra dem i denne uge.';
  if(open>30)return 'JM: Der er for mange bolde i luften. Saml teamet i ti minutter, vælg tre vigtigste opgaver, og sæt resten på pause.';
  if(metrics.trust<50)return 'JM: De tror ikke helt på dig lige nu. Lyt uden at forsvare dig, hold hvad du lover, og kom tilbage med en status.';
  return 'JM: Gør det enkelt. Tal med et par medarbejdere i dag, ros det der virker, og sørg for at alle kender næste prioritet.';
 }
 function hire(state,id){const a=state.advisors,def=CATALOG[id];if(!def||a.hired.includes(id)||state.crisis?.fired||state.world.metrics.budget<def.cost)return false;a.hired.push(id);state.world.metrics.budget=Math.max(0,state.world.metrics.budget-def.cost);state.budget=Math.round(state.world.metrics.budget);a.messages.unshift({day:state.day,id,text:`${id} er nu tilknyttet som managementkonsulent.`,kind:'hire'});a.messages=a.messages.slice(0,30);return true}
 function request(state,id){const a=state.advisors;if(!a.hired.includes(id)||state.crisis?.fired)return false;const cost=a.lastDay[id]===state.day?1:0;if(state.world.metrics.budget<cost)return false;state.world.metrics.budget=Math.max(0,state.world.metrics.budget-cost);state.budget=Math.round(state.world.metrics.budget);a.lastDay[id]=state.day;a.messages.unshift({day:state.day,id,text:advice(state,id),kind:'advice'});a.messages=a.messages.slice(0,30);return true}
 function advance(state){const a=state.advisors;if(state.day<7||state.day%7!==0||a.autoDay===state.day||!a.hired.length||state.crisis?.fired)return false;a.autoDay=state.day;for(const id of a.hired)a.messages.unshift({day:state.day,id,text:advice(state,id),kind:'advice'});a.messages=a.messages.slice(0,30);return true}
 global.LeadershipAdvisors={CATALOG,initial,normalize,hire,request,advance,advice};
})(globalThis);

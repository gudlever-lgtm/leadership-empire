/* Deterministic fictional performance appraisals. Not a validated leadership assessment. */
(function(global){
 'use strict';
 const DAYS=[15,30,45,60,75,90,100];
 function initial(){return {reports:[],lastDay:0,seenDay:0}}
 function normalize(raw){const p={...initial(),...(raw||{})};p.reports=Array.isArray(p.reports)?p.reports.filter(r=>r&&Number.isInteger(r.day)&&Array.isArray(r.sections)).slice(-DAYS.length-1):[];p.lastDay=p.reports.length?p.reports[p.reports.length-1].day:0;p.seenDay=Number.isInteger(p.seenDay)?p.seenDay:0;return p}
 function clip(n){return Math.max(0,Math.min(100,Math.round(n)))}
 function measure(state){const m=state.world.metrics,team=state.world.team;
  const open=state.world.tasks.filter(t=>t.status==='open');
  return {trust:clip(m.trust),wellbeing:clip(m.wellbeing),delivery:clip(m.delivery),budget:clip(m.budget),quality:clip(m.quality),overdue:open.filter(t=>t.due<state.day).length,open:open.length,completed:state.world.completed,motivation:clip(team.reduce((s,t)=>s+t.motivation,0)/team.length)};
 }
 function rating(score){return score>=75?'Stærk':score>=55?'Tilfredsstillende':score>=40?'Under pres':'Kritisk'}
 function manager(s,score){
  const advice=s.delivery<50?'Genforhandl leveranceforventninger og offentliggør prioriteringer.':s.budget<40?'Fremlæg konkrete budgetvalg og konsekvenser for serviceniveauet.':s.quality<55?'Styrk kvalitetskontrol og læring fra fejl.':'Fasthold retningen med tydelige milepæle og dokumentér effekten.';
  const text=score>=75?'Ledelsen vurderer, at du skaber balance mellem resultater, økonomi og medarbejdere.':score>=50?'Ledelsen ser fremdrift, men forventer mere konsekvent håndtering af svagheder.':'Ledelsen er bekymret for din styring af resultater, risici eller ressourcer.';
  return {source:'Overordnet ledelse',rating:rating(score),score,text,recommendation:advice};
 }
 function employees(s,score){
  const text=score>=75?'Medarbejderne oplever overvejende tydelighed, tillid og et bæredygtigt arbejdspres.':score>=50?'Medarbejderne oplever både styrker og friktion i samarbejde og prioritering.':'Medarbejdernes tilbagemelding peger på betydelig belastning eller svækket tillid.';
  const recommendation=s.wellbeing<55?'Indfør faste belastningssamtaler og aflast de hårdest pressede.':s.trust<55?'Aftal tydelig opfølgning på beslutninger og invitér til ærlig feedback.':'Fortsæt med anerkendelse, klare roller og regelmæssige en-til-en-samtaler.';
  return {source:'Medarbejdernes vurdering',rating:rating(score),score,text,recommendation};
 }
 function consultant(state,id,s,score){
  if(id==='JE')return {source:'JE · Managementkonsulent',rating:rating(score),score,text:s.budget<45?'JE vurderer, at strategisk handlefrihed begrænses af økonomien.':'JE vurderer ledelsens evne til at forbinde retning, risici og resultater.',recommendation:state.crisis?.exposure>1?'Lav et eksplicit risikoregister og eskalér åbne risici til rette niveau.':'Forbered en kort ledelsesrapport med status, valgmuligheder og konsekvenser.'};
  return {source:'JM · Managementkonsulent',rating:rating(score),score,text:s.wellbeing<50?'JM ser tegn på, at arbejdspresset underminerer holdbar drift.':'JM vurderer kvaliteten af den daglige personaleledelse og opgaveprioritering.',recommendation:s.open>25?'Reducer samtidige opgaver og fordel belastningen mere jævnt.':'Følg op på medarbejderdialog og skab tydelige aftaler om ansvar.'};
 }
 function record(state,force=false){
  if(!force&&!DAYS.includes(state.day))return false;
  if(state.performance.lastDay===state.day){
   if(!force||!state.crisis?.fired)return false;
   state.performance.reports.pop();state.performance.lastDay=state.performance.reports.at(-1)?.day||0;
  }
  const s=measure(state),executiveScore=clip((s.delivery+s.quality+s.budget+s.trust)/4),peopleScore=clip((s.trust+s.wellbeing+s.motivation)/3);
  const sections=[manager(s,executiveScore),employees(s,peopleScore)];
  for(const id of state.advisors?.hired||[])sections.push(consultant(state,id,s,id==='JE'?executiveScore:peopleScore));
  const overall=clip((executiveScore+peopleScore)/2);
  const previous=state.performance.reports.at(-1);
  state.performance.reports.push({day:state.day,overall,rating:rating(overall),change:previous?overall-previous.overall:null,metrics:s,sections,termination:!!state.crisis?.fired});
  state.performance.lastDay=state.day;
  return true;
 }
 global.LeadershipPerformance={DAYS,initial,normalize,measure,record};
})(globalThis);

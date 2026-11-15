/* Fictional organizational incidents; deterministic per career. */
(function(global){
 'use strict';
 const CASES=[
  ['Databrud og personoplysninger','company','En leverandør melder om mulig eksponering af persondata. Flere afdelinger venter på retning.'],
  ['Pludselig budgetreduktion','company','Direktionen varsler et uventet sparekrav, som kan ramme bemandingen.'],
  ['Nøgleperson sygemeldt','department','En nøglemedarbejder er ude i en længere periode, mens kritiske opgaver presser sig på.'],
  ['Konflikt med anden afdeling','cross','En anden afdelingschef beskylder dit team for en forsinkelse i et fælles projekt.'],
  ['Kritisk leverandørsvigt','cross','Et vigtigt system fra en leverandør er nede og forstyrrer flere teams.'],
  ['Mediesag om virksomheden','company','En journalist kontakter organisationen om kritisable forhold og efterspørger et svar.'],
  ['Whistleblower-henvendelse','company','En anonym henvendelse rejser spørgsmål om ledelsesadfærd.'],
  ['Opsigelse fra nøglespecialist','department','En specialist har fået et jobtilbud og overvejer at sige op.'],
  ['Uventet strategisk omstilling','cross','Direktionen ændrer prioriteringen, mens to afdelinger konkurrerer om ressourcer.'],
  ['Alvorligt arbejdsmiljøproblem','department','Flere medarbejdere fortæller om belastning og manglende psykologisk tryghed.']
 ];
 const POSITION={team:'Teamleder',department:'Afdelingschef',executive:'Direktion'};
 const EXPERIENCE={new:'Ny leder',experienced:'Erfaren leder',veteran:'Rutineret leder'};
 const RISK={cautious:'Forsigtig',balanced:'Afbalanceret',bold:'Risikovillig'};
 const ACCOUNTABILITY={gentle:'Tilgivende',normal:'Normal',strict:'Hård'};
 const defaults={position:'team',experience:'experienced',risk:'balanced',incidentCount:6,accountability:'normal'};
 function settings(raw={}){return {...defaults,...raw,incidentCount:Math.min(10,Math.max(4,Number(raw.incidentCount)||6))}}
 function create(raw={}){
  const s=settings(raw),count=s.incidentCount;
  const positions=Array.from({length:count},(_,i)=>20+Math.round((i+.45)*75/count));
  return {schedule:positions.map((day,i)=>({day,id:i%CASES.length})),cursor:0,open:false,strikes:0,exposure:0,fired:false,reason:'',resolved:[]};
 }
 function migrate(raw,day){const c=create(raw);while(c.cursor<c.schedule.length&&c.schedule[c.cursor].day<=day)c.cursor++;return c}
 function current(c){return c.schedule[c.cursor]}
 function dilemma(c,raw){
  const s=settings(raw),item=current(c);if(!item)return null;
  const [title,scope,body]=CASES[item.id];
  const authority=s.position==='executive'?'Du kan træffe en koncernbeslutning.':s.position==='department'?'Du kan koordinere med andre chefer og eskalere.':'Du har kun mandat i dit team og må eskalere på tværs.';
  const canCommand=s.position!=='team';
  return {title:`⚡ Uforudset: ${title}`,body:`${body} ${authority}`,scope,options:[
   ['Eskalér og koordinér','Dokumentér risikoen, involvér rette beslutningstagere og lav en ansvarlig plan.',{trust:3,delivery:-2,budget:-2,wellbeing:2},0],
   [canCommand?'Opret tværgående krisestab':'Foreslå fælles krisestab','Organisér hurtig fælles respons; du bruger kapacitet og ressourcer.',{delivery:4,budget:-5,wellbeing:-2,trust:1},1],
   ['Tag chancen og minimer problemet','Undlad bred orientering og håb, at situationen går over.',{delivery:5,budget:2,trust:-9,wellbeing:-5},3]
  ]};
 }
 function resolve(c,raw,choice){
  if(!c.open||c.fired||![0,1,2].includes(choice))return null;
  const s=settings(raw),entry=dilemma(c,s),severity=choice===2?3:choice===1?1:0;
  const mitigation=s.experience==='veteran'?1:s.experience==='new'?-1:0;
  const appetite=s.risk==='bold'?1:s.risk==='cautious'?-1:0;
  const accountability=s.accountability==='strict'?1:s.accountability==='gentle'?-1:0;
  const authorityGap=choice===1&&entry.scope!=='department'&&s.position==='team'?1:0;
  const danger=Math.max(0,severity+appetite+accountability-mitigation+authorityGap);
  if(choice===2)c.strikes+=danger>=3?2:1;
  if(choice===1&&authorityGap)c.exposure++;
  else if(choice===0)c.strikes=Math.max(0,c.strikes-1);
  const penalty=choice===2?danger:0;
  c.exposure=Math.max(0,c.exposure+penalty-(choice===0?1:0));
  const threshold=s.accountability==='strict'?4:s.accountability==='gentle'?9:6;
  const fired=s.accountability!=='off'&&(c.exposure>=threshold||c.strikes>=threshold);
  const item=current(c);c.resolved.push({day:item.day,title:entry.title,scope:entry.scope,decision:entry.options[choice][0],danger,exposure:c.exposure});
  c.cursor++;c.open=false;
  if(fired){c.fired=true;c.reason=`Gentagen uforsvarlig håndtering af organisatoriske risici (risikoeksponering ${c.exposure}, advarsler ${c.strikes}).`}
  const impact={...entry.options[choice][2]};
  if(authorityGap){impact.trust=(impact.trust||0)-3;impact.delivery=(impact.delivery||0)-2}
  if(choice===0&&s.experience==='veteran')impact.trust=(impact.trust||0)+2;
  return {impact,fired,reason:c.reason,danger};
 }
 global.LeadershipCrises={CASES,POSITION,EXPERIENCE,RISK,ACCOUNTABILITY,settings,create,migrate,dilemma,resolve};
})(globalThis);

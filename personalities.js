/* Fictional employee preferences for deterministic game simulation. Not a personality test. */
(function(global){
 'use strict';
 const PROFILES=[
  {style:'Faglig autonomi',need:'Selvstændighed',experience:'veteran',autonomy:5,structure:1,support:1,change:1},
  {style:'Fællesskabende koordinator',need:'Samarbejde',experience:'experienced',autonomy:2,structure:4,support:4,change:3},
  {style:'Stabil drift',need:'Tydelige rammer',experience:'experienced',autonomy:2,structure:5,support:3,change:1},
  {style:'Nysgerrig fornyer',need:'Udvikling',experience:'experienced',autonomy:4,structure:2,support:2,change:5},
  {style:'Relationel problemløser',need:'Anerkendelse',experience:'developing',autonomy:2,structure:3,support:5,change:3},
  {style:'Samvittighedsfuld stabilisator',need:'Forudsigelighed',experience:'veteran',autonomy:2,structure:5,support:4,change:2},
  {style:'Selvstændig analytiker',need:'Faglig frihed',experience:'experienced',autonomy:5,structure:2,support:2,change:3},
  {style:'Samarbejdende drivkraft',need:'Indflydelse',experience:'experienced',autonomy:4,structure:3,support:4,change:4},
  {style:'Praktisk gennemfører',need:'Klar prioritering',experience:'developing',autonomy:2,structure:5,support:3,change:2},
  {style:'Kvalitetsforkæmper',need:'Ansvarlighed',experience:'veteran',autonomy:4,structure:4,support:2,change:2},
  {style:'Læringsorienteret junior',need:'Sparring',experience:'junior',autonomy:2,structure:4,support:5,change:4},
  {style:'Helhedsorienteret serviceleder',need:'Fælles retning',experience:'experienced',autonomy:3,structure:4,support:4,change:3}
 ];
 const ACTIONS={talk:'samtale',train:'uddannelse',recover:'aflastning'};
 function initial(){return {reactions:[]}}
 function normalize(raw){return {reactions:Array.isArray(raw?.reactions)?raw.reactions.filter(r=>Number.isInteger(r.id)&&r.id>=0&&r.id<PROFILES.length).slice(-80):[]}}
 function clamp(v){return Math.max(0,Math.min(100,Math.round(v*10)/10))}
 function personality(id){return PROFILES[id]||PROFILES[0]}
 function respond(state,id,kind){
  const p=personality(id),member=state.world.team[id];if(!member||!ACTIONS[kind])return null;
  const relation=member.relation;
  const adjustment=kind==='talk'?p.support-3:kind==='train'?Math.round((p.change+p.support)/2)-3:p.structure-3;
  const trustFactor=relation<45?-2:relation>75?2:0;
  const experienceFactor=p.experience==='junior'&&kind==='train'?2:p.experience==='veteran'&&kind==='talk'?-1:0;
  const delta=Math.max(-5,Math.min(6,adjustment+trustFactor+experienceFactor));
  member.motivation=clamp(member.motivation+delta);
  member.relation=clamp(member.relation+Math.round(delta/2));
  const tone=delta>=2?'tager positivt imod':delta<=-2?'reagerer skeptisk på':'tager imod';
  const reaction={day:state.day,id,kind,delta,text:`Medarbejderen ${tone} ${ACTIONS[kind]}. Foretrækker ${p.need.toLowerCase()}.`};
  state.peopleDynamics.reactions.push(reaction);state.peopleDynamics.reactions=state.peopleDynamics.reactions.slice(-80);
  return reaction;
 }
 function decision(state,ids,kind,choice){
  const results=[];
  for(const id of ids){
   const p=personality(id),member=state.world.team[id];if(!member)continue;
   const match=kind==='change'?p.change:kind==='conflict'?p.support:p.structure;
   const base=choice===0?2:choice===1?-2:-1;
   const delta=Math.max(-5,Math.min(5,base+match-3+(member.relation<45?-1:0)));
   member.motivation=clamp(member.motivation+delta);
   member.relation=clamp(member.relation+Math.round(delta/2));
   const reaction={day:state.day,id,kind:'decision',delta,text:`Beslutningen om ${kind==='conflict'?'konflikten':kind==='change'?'forandringen':'prioritering'} påvirkede motivationen. Vigtigt behov: ${p.need.toLowerCase()}.`};
   state.peopleDynamics.reactions.push(reaction);
   results.push({id,delta});
  }
  state.peopleDynamics.reactions=state.peopleDynamics.reactions.slice(-80);
  return results;
 }
 global.LeadershipPersonalities={PROFILES,initial,normalize,personality,respond,decision};
})(globalThis);

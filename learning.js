/* Offline learning loops: optional moments, practice, reflection and development goals. */
(function(global){
 'use strict';
 const AREAS={communication:'Kommunikation',motivation:'Motivation og delegation',change:'Forandringsledelse',conflict:'Konflikthåndtering',strategy:'Strategisk ledelse',finance:'Økonomistyring',crisis:'Krisestyring',coaching:'Medarbejderudvikling',delegation:'Delegering',executive:'Ledelse af ledere'};
 const MOMENTS={
  communication:{title:'Tydelig kommunikation',theory:'Beskriv observationen før din fortolkning. Undersøg årsager, aftal forventninger og en konkret opfølgning.',question:'Hvilke oplysninger mangler du, før du konkluderer noget om medarbejderens adfærd?'},
  motivation:{title:'Motivation i hverdagen',theory:'Undersøg om medarbejderen savner autonomi, kompetencer eller samhørighed. Støtte og ansvar bør tilpasses den konkrete situation.',question:'Hvad ville du spørge medarbejderen om, før du ændrer opgaver eller ansvar?'},
  change:{title:'Forandringer med feedback',theory:'Formulér formålet, involvér berørte medarbejdere, afprøv i lille skala og følg op med konkrete målinger.',question:'Hvordan vil du kunne se, at forandringen faktisk virker?'},
  conflict:{title:'Fra konflikt til aftale',theory:'Adskil person og problem. Giv parterne taletid, afklar ansvar og aftal spilleregler for samarbejdet.',question:'Hvad kan begge parter acceptere som et første fælles skridt?'},
  strategy:{title:'Strategisk prioritering',theory:'En strategi er også et fravalg. Afklar målet, konsekvenser for andre afdelinger og hvem der har mandat til at beslutte.',question:'Hvilket tiltag bør vente, hvis dette skal lykkes?'},
  finance:{title:'Budget som ledelsesværktøj',theory:'Budget er begrænset kapacitet. Vurdér alternativomkostninger og vis konsekvenser af investeringer, besparelser og udsættelser.',question:'Hvilke resultater mister du, hvis du bruger pengene her?'},
  crisis:{title:'Ledelse under usikkerhed',theory:'Afklar fakta, risici, mandat og kommunikationsveje. Følg op, så nye oplysninger kan ændre planen.',question:'Hvem skal informeres nu, og hvilken risiko kan du ikke selv acceptere?'},
  coaching:{title:'Udvikling gennem samtaler',theory:'Stil undersøgende spørgsmål, giv konkret feedback og aftal et lille næste skridt, som medarbejderen ejer.',question:'Hvilken handling vil medarbejderen selv foreslå?'},
  delegation:{title:'Ansvar med rammer',theory:'Deleger målet og beslutningsrummet tydeligt. Aftal støtte, kvalitet og tidspunktet for opfølgning.',question:'Hvilke beslutninger kan medarbejderen træffe uden dig?'},
  executive:{title:'Ledelse gennem andre ledere',theory:'Skab fælles retning og tydelig governance, men giv lokale ledere plads til at vælge deres virkemidler.',question:'Hvad skal du styre centralt, og hvad bør forblive lokalt?'}
 };
 const GOALS={trust:{label:'Øg medarbejdernes tillid',metric:'trust'},wellbeing:{label:'Forbedr trivsel',metric:'wellbeing'},delivery:{label:'Styrk leverancer',metric:'delivery'},budget:{label:'Skab økonomisk råderum',metric:'budget'}};
 function initial(){return {competence:Object.fromEntries(Object.keys(AREAS).map(k=>[k,20])),practice:{},moments:[],current:null,reflections:[],plans:[]}}
 function normalize(raw){const s={...initial(),...(raw||{})};s.competence={...initial().competence,...(s.competence||{})};s.practice=s.practice&&typeof s.practice==='object'?s.practice:{};s.moments=Array.isArray(s.moments)?s.moments.slice(-30):[];s.reflections=Array.isArray(s.reflections)?s.reflections.slice(-40):[];s.plans=Array.isArray(s.plans)?s.plans.slice(-15):[];if(s.current&&!MOMENTS[s.current.topic])s.current=null;return s}
 function cap(n){return Math.max(0,Math.min(100,Math.round(n)))}
 function practice(state,topic,label){const s=state.learning;if(!AREAS[topic])return false;s.practice[topic]=(s.practice[topic]||0)+1;s.competence[topic]=cap(s.competence[topic]+1);return offer(state,topic,label)}
 function offer(state,topic,context){const s=state.learning;if(!MOMENTS[topic])return false;const item={day:state.day,topic,context:String(context||'Ledelsesvalg')};s.moments.push(item);s.moments=s.moments.slice(-30);s.current=item;return true}
 function dismiss(state){state.learning.current=null}
 function reflect(state,text){const s=state.learning,m=s.current;if(!m||!MOMENTS[m.topic]||typeof text!=='string'||text.trim().length<10)return false;s.reflections.push({day:state.day,topic:m.topic,text:text.trim().slice(0,1000)});s.reflections=s.reflections.slice(-40);s.competence[m.topic]=cap(s.competence[m.topic]+3);s.current=null;return true}
 function complete(state,module){const s=state.learning,key=module.learningArea||module.id;if(!AREAS[key])return;s.competence[key]=cap(s.competence[key]+5)}
 function openPlan(state,reportDay,ids){const s=state.learning;if(!Array.isArray(ids)||ids.length<1||ids.length>3||ids.some(x=>!GOALS[x])||new Set(ids).size!==ids.length)return false;
  if(s.plans.some(p=>p.fromDay===reportDay))return false;
  const report=state.performance.reports.find(r=>r.day===reportDay);if(!report)return false;
  s.plans.push({fromDay:reportDay,goals:ids.map(id=>({id,label:GOALS[id].label,start:report.metrics[GOALS[id].metric],target:Math.min(100,report.metrics[GOALS[id].metric]+5),result:null,status:'active'}))});return true;
 }
 function evaluate(state,report){for(const plan of state.learning.plans){if(plan.fromDay>=report.day||plan.goals.every(g=>g.status!=='active'))continue;for(const goal of plan.goals){if(goal.status!=='active')continue;const value=report.metrics[GOALS[goal.id].metric];goal.result=value;goal.status=value>=goal.target?'achieved':'not-achieved'}}}
 global.LeadershipLearning={AREAS,MOMENTS,GOALS,initial,normalize,practice,offer,dismiss,reflect,complete,openPlan,evaluate};
})(globalThis);

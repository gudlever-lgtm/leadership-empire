/* Leadership Empire deterministic offline simulation. No DOM or external APIs. */
(function(global){
  'use strict';
  const CATALOG={
    it:['Incident','Netværksændring','Automatisering','Servicebestilling','Sikkerhedsopgave'],
    software:['Fejlrettelse','Feature','Kodegennemgang','Release','Teknisk gæld'],
    hr:['Rekruttering','Onboarding','Medarbejdersag','Kompetenceudvikling','Arbejdsmiljø'],
    finance:['Budgetopfølgning','Afstemning','Rapportering','Analyse','Revision'],
    support:['Kundehenvendelse','Klage','Vidensartikel','Servicemåling','Kompleks sag'],
    production:['Produktionsordre','Kvalitetskontrol','Vedligehold','Planlægning','Procesforbedring'],
    administration:['Sagsbehandling','Dokumentkontrol','Forbedringsopgave','Høring','Compliance']
  };
  const PROFILES={
    it:{label:'IT & Infrastruktur',kpi:'Drift og leverancer',demand:2.1,complexity:1.1,latePenalty:.45},
    software:{label:'Softwareudvikling',kpi:'Releasekvalitet',demand:1.7,complexity:1.25,latePenalty:.32},
    hr:{label:'HR & Personale',kpi:'Personaleservice',demand:1.5,complexity:1.05,latePenalty:.4},
    finance:{label:'Økonomi',kpi:'Rettidighed',demand:1.8,complexity:1,latePenalty:.52},
    support:{label:'Kundeservice',kpi:'Svartid og kvalitet',demand:2.6,complexity:.8,latePenalty:.55},
    production:{label:'Produktion',kpi:'Leverancekvalitet',demand:2.25,complexity:1.15,latePenalty:.48},
    administration:{label:'Administration',kpi:'Sagskvalitet',demand:1.8,complexity:1,latePenalty:.42}
  };
  const START_SEED=728194;
  function random(world){world.seed=(Math.imul(world.seed,1664525)+1013904223)>>>0;return world.seed/4294967296}
  function cap(value,min=0,max=100){return Math.max(min,Math.min(max,Math.round(value*10)/10))}
  function types(department){return CATALOG[department]||CATALOG.it}
  function create(config,people=12,seed=START_SEED){const world={schema:3,seed:seed>>>0,department:config.department||'it',organization:config.org||'public',size:config.size||'medium',day:1,nextId:1,tasks:[],completed:0,overdue:0,events:[],log:[],workload:0,capacity:0,onTime:0,actionsRemaining:3,team:Array.from({length:people},(_,id)=>({id,energy:70+(id%4)*4,motivation:60+(id%5)*5,skill:55+(id*7)%40,specialty:id%5,relation:60+(id*11)%25,training:0})),policy:{priority:'balanced'},metrics:{trust:58,wellbeing:63,delivery:67,budget:config.org==='ngo'?65:config.org==='private'?85:78,quality:70,learning:30}};const initial=config.size==='large'?18:config.size==='small'?10:14;for(let i=0;i<initial;i++)addTask(world);return world}
  function addTask(world){const pool=types(world.department),profile=PROFILES[world.department]||PROFILES.it,n=world.nextId++,r=random(world),category=Math.floor(r*pool.length),effort=Math.round((12+Math.floor(random(world)*36))*profile.complexity),priority=1+Math.floor(random(world)*3),due=world.day+4+Math.floor(random(world)*13);world.tasks.push({id:n,title:pool[category]+' #'+String(n).padStart(3,'0'),category,priority,due,effort,remaining:effort,assigned:(n-1)%world.team.length,status:'open',created:world.day});return n}
  function assign(world,taskId,personId){const task=world.tasks.find(t=>t.id===taskId&&t.status==='open');if(!task||!world.team.some(t=>t.id===personId))return false;task.assigned=personId;world.log.push({day:world.day,text:`Opgave #${task.id} omfordelt`});return true}
  function action(world,kind,id){const person=world.team.find(p=>p.id===id);if(!person||world.actionsRemaining<=0)return false;const m=world.metrics;
    if(kind==='talk'){person.motivation=cap(person.motivation+7);person.relation=cap(person.relation+8);m.trust=cap(m.trust+1);world.log.push({day:world.day,text:`Samtale med medarbejder ${id+1}`});}
    else if(kind==='train'){if(m.budget<3)return false;m.budget=cap(m.budget-3);person.training+=1;person.skill=cap(person.skill+5);person.energy=cap(person.energy-3);world.log.push({day:world.day,text:`Uddannelse for medarbejder ${id+1}`});}
    else if(kind==='recover'){person.energy=cap(person.energy+16);person.motivation=cap(person.motivation+2);world.log.push({day:world.day,text:`Aflastning for medarbejder ${id+1}`});}
    else return false;
    world.actionsRemaining--;
    return true;
  }
  function advance(world){if(world.day>=100)return world;world.day++;world.actionsRemaining=3;let capacity=0,done=0;
    const sorted=world.tasks.filter(t=>t.status==='open').sort((a,b)=>world.policy.priority==='deadline'?a.due-b.due:b.priority-a.priority||a.due-b.due);
    for(const person of world.team){const tasks=sorted.filter(t=>t.status==='open'&&t.assigned===person.id);let daily=(1+person.skill/38)*(0.45+person.energy/180)*(0.65+person.motivation/250)*(0.75+person.relation/400);daily=Math.max(.5,daily);capacity+=daily;let available=daily;
      for(const task of tasks){if(available<=0)break;const fit=task.category===person.specialty?1.3:.8;const progress=Math.min(available*fit,task.remaining);task.remaining=Math.max(0,task.remaining-progress);available-=progress/fit;if(task.remaining<.001){task.status='done';task.finished=world.day;world.completed++;done++;if(world.day<=task.due)world.onTime++;const revenue=world.organization==='private'?.28:world.organization==='ngo'?.08:.13;world.metrics.budget=cap(world.metrics.budget+revenue);world.log.push({day:world.day,text:`Afsluttet ${task.title}`})}}
      const overloaded=tasks.length>=4;person.energy=cap(person.energy+(overloaded?-2.4:tasks.length===0?2.2:-.2));person.motivation=cap(person.motivation+(overloaded?-.7:tasks.length===0?-.15:.2)+(world.metrics.budget<20?-.4:0));}
    const late=world.tasks.filter(t=>t.status==='open'&&t.due<world.day).length;
    world.overdue=late;world.capacity=Math.round(capacity*10)/10;world.workload=world.tasks.filter(t=>t.status==='open').length;
    const profile=PROFILES[world.department]||PROFILES.it;
    const sizeFactor=world.size==='large'?1.3:world.size==='small'?.8:1;
    const newCount=1+Math.floor(random(world)*profile.demand*sizeFactor);for(let i=0;i<newCount;i++)addTask(world);
    const mean=world.team.reduce((s,p)=>s+p.energy,0)/world.team.length;
    world.metrics.wellbeing=cap(.7*world.metrics.wellbeing+.3*mean);
    world.metrics.delivery=cap(world.metrics.delivery+done*1.25-late*profile.latePenalty*(world.organization==='public'?1.1:1)-.25);
    world.metrics.quality=cap(world.completed?world.onTime/world.completed*100-late*.2:70);
    world.metrics.learning=cap(world.team.reduce((sum,p)=>sum+p.training,0)*4+30);
    world.metrics.trust=cap(world.metrics.trust+(mean>55?.15:-.4));
    if(world.day%7===0)world.metrics.budget=cap(world.metrics.budget-1.8);
    if(late>6&&world.day%7===0)world.events.push({day:world.day,type:'warning',text:`${late} opgaver er over tid`});
    if(world.day%30===0)world.events.push({day:world.day,type:'review',text:'Månedsrapport er klar'});
    world.log=world.log.slice(-120);
    return world;
  }
  function summary(world){const open=world.tasks.filter(t=>t.status==='open');return {day:world.day,open:open.length,overdue:world.overdue,completed:world.completed,capacity:world.capacity,actionsRemaining:world.actionsRemaining,metrics:{...world.metrics},topTasks:open.slice().sort((a,b)=>a.due-b.due).slice(0,8),profile:PROFILES[world.department]||PROFILES.it}}
  global.LeadershipEngine={CATALOG,PROFILES,create,assign,action,advance,summary,cap};
})(globalThis);

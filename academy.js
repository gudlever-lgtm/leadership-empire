/* Leadership Academy Professional pilot, three facilitated reflection modules. */
(function(global){
 const modules=[
  {id:'communication',title:'Kommunikation og forventninger',duration:35,
   goals:['Skelne observationer fra fortolkninger','Stille undersøgende spørgsmål','Afslutte med konkret opfølgning'],
   theory:'Psykologisk tryghed handler om, at teammedlemmer oplever, at de kan tage interpersonelle risici, eksempelvis stille spørgsmål og fortælle om fejl. Det fritager ikke lederen for at tydeliggøre ansvar og forventninger.',
   source:{label:'Amy Edmondson, Psychological Safety and Learning Behavior in Work Teams (1999)',url:'https://journals.sagepub.com/doi/10.2307/2666999'},
   case:'En erfaren medarbejder leverer sent og reagerer defensivt på kritik. Du ved endnu ikke, om problemet skyldes opgavemængde, kompetencer eller forventninger.',
   choices:[['Start med fakta og åbne spørgsmål','Denne tilgang kan afdække årsagerne, men samtalen kræver tid og opfølgning.'],['Giv en skarp advarsel straks','En tydelig grænse kan være nødvendig, men uden forståelse af årsagen risikerer du at overse systemiske problemer.'],['Overtag medarbejderens opgaver','Det kan sikre en akut leverance, men løser sjældent det bagvedliggende mønster.']],
   reflection:'Hvordan vil du formulere dine første to spørgsmål, og hvad vil du aftale til næste samtale?'},
  {id:'motivation',title:'Motivation og delegation',duration:35,
   goals:['Genkende behov for autonomi, kompetence og tilhørsforhold','Tilpasse støtte og ansvar','Vurdere konsekvenser af delegering'],
   theory:'Self-Determination Theory beskriver autonomi, kompetence og samhørighed som centrale psykologiske behov. I en ledelsessituation kan man undersøge, om medarbejderen har tilstrækkelig handlefrihed, færdigheder og social støtte.',
   source:{label:'Ryan og Deci, Self-Determination Theory and the Facilitation of Intrinsic Motivation (2000)',url:'https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf'},
   case:'En motiveret medarbejder beder om ansvar for et nyt projekt, men har endnu ikke alle nødvendige kompetencer.',
   choices:[['Delegér med sparring og milepæle','Du skaber ansvar og læring, men bruger tid på støtte.'],['Behold alle beslutninger selv','Kvaliteten kan være lettere at kontrollere, men ejerskab og udvikling kan begrænses.'],['Giv fuldt ansvar uden støtte','Høj autonomi kan være positivt, men manglende kompetence og opfølgning øger risikoen.']],
   reflection:'Hvilke beslutninger vil du delegere, og hvor vil du tilbyde støtte?'},
  {id:'change',title:'Forandringsledelse og feedback',duration:40,
   goals:['Undersøge årsager til modstand','Vælge konkret involvering','Planlægge feedback og justering'],
   theory:'Feedback er ikke automatisk hjælpsom. En meta-analyse fandt betydelig variation i effekten af feedbackinterventioner. I øvelsen skal du arbejde med specifik, opgaverettet feedback og løbende dialog frem for generelle domme om personen.',
   source:{label:'Kluger og DeNisi, The Effects of Feedback Interventions on Performance (1996)',url:'https://doi.org/10.1037/0033-2909.119.2.254'},
   case:'Du vil indføre en fælles proces. En nøglemedarbejder er skeptisk og peger på tidligere projekter, der fejlede.',
   choices:[['Lav en afgrænset pilot med feedback','Deltagelse og læring kan øge kvaliteten, men tager tid.'],['Gennemfør ændringen for hele teamet nu','Tempoet øges, men modstand og skjulte fejl kan vokse.'],['Udsæt ændringen på ubestemt tid','Uro undgås kortvarigt, men problemerne bag processen fortsætter.']],
   reflection:'Hvilken observation vil vise, at ændringen virker, og hvornår vil du evaluere den?'}
 ];
 global.LeadershipAcademy={modules};
})(globalThis);

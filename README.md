# Leadership Empire — første prototype

En selvstændig, lokal browserprototype på dansk. Ingen eksterne tjenester, backend eller afhængigheder kræves.

## Kør

Åbn `index.html` i en browser. Alternativt: kør `python -m http.server 8080` fra denne mappe og åbn `http://localhost:8080`.

## Afprøv

1. Vælg **Beslutninger** og håndtér Thomas-situationen.
2. Vælg opfølgning og se dine KPI'er ændre sig.
3. Tryk **Næste dag** indtil dag 14 og se konsekvensen.
4. Åbn **Academy**, læs læringspunktet og gem din refleksion.
5. Se **Medarbejdere** og **Indsigt**.

Fremgang gemmes lokalt i browserens `localStorage`. **↻** nulstiller efter bekræftelse.

## Status og begrænsninger

- 12 fiktive medarbejdere, illustreret kontormiljø og fem navigationsområder.
- To beslutningstrin, tre valgmuligheder i hvert og forsinket opfølgning.
- Simpelt KPI-system; ikke en færdig realistisk simulationsmodel.
- Academy-introduktion og lokal privat refleksion. Ingen underviserfunktion endnu.
- Designet som et første spilbart udsnit, ikke færdigt Android/iOS-spil.

## Senere repository

Alle filer kan tilføjes til et GitHub-repository, når et sådant er oprettet.

## V0.2 Living Organization

Projektet ligger nu på GitHub. V0.2 tilføjer illustrerede, animerede medarbejdere, energi og relationsværdier, tre nye dilemmaer efter dag 14, et PWA-manifest og en vej til Android via Capacitor.

### Android

Der kræves Node.js, npm, Java/JDK og Android Studio med Android SDK. Kør fra denne mappe:

```bash
npm install
npm run android:add
npm run android:open
```

Efter ændringer i webkoden bruges `npm run android:sync`. Android-projektet genereres lokalt, og der er **ikke** bygget en APK i denne version. Package-id `eu.leadershipempire.app` er foreløbigt.

### Test

```bash
npm test
```

### App og hjemmeside

V0.2 er offline-first og bruger samme HTML/CSS/JavaScript-kerne på web og i Android-wrapper. Spiltilstanden gemmes lokalt. Der er endnu ingen konto, hjemmeside-backend eller synkronisering.

En senere hjemmeside kan rumme information, Academy-kurser og brugerportal. Et separat API kan håndtere godkendt synkronisering af spil og undervisningsforløb mellem platforme. Private refleksioner og underviserdata skal holdes adskilt. Domæne og produktnavn kan besluttes senere.

V0.2's figurer har idle-animation, ikke egentlig ruteplanlægning gennem kontoret. Beslutninger bruger fortsat en forenklet, håndskrevet simulationsmodel.

## V0.3 Visual Foundation

- Ny illustreret kontorbaggrund i varm, blød 2.5D-stil med mødelokale, lounge og seks arbejdsstationer. Genereret specifikt til spillet og gemt i `assets/office-v03.png`.
- Separat interaktivt lag med klikbare medarbejdere og tre områder.
- Fire medarbejdere bevæger sig mellem definerede stationer på en simpel tidsstyret rute; øvrige medarbejdere har idle-animationer.
- Zoomknapper, horisontal panorering på små skærme og opdateret UI-styling.
- Samme baggrund og interaktive funktioner inkluderes i Android-webpakken.

Grafikken er nu visuelt tættere på det godkendte koncept, men endnu ikke en fuld isometrisk 3D-simulation. Figurerne er CSS-illustrationer og deres bevægelsesruter er demonstrationslogik uden forhindringsdetektion. Afdelingstilpassede KPI'er og fuldt særskilt gameplay kommer i en senere version.

## V0.4 Career Setup

- Ny karriere-dialog med valg mellem offentlig organisation, privat virksomhed og NGO.
- Tre organisationsstørrelser og syv afdelingstyper.
- Medarbejdernes rollebetegnelser, afdelingens navn og en senere case tilpasses valget.
- Forskelligt startbudget efter organisationstype og en første opsamling efter 100 dage.
- Eksisterende lagring bevares; oprettelse af ny karriere kræver bekræftelse.

V0.4 er fortsat en prototype: De syv afdelinger deler hovedparten af beslutningsmotoren og har endnu ikke egne KPI'er og opgavemodeller. Se [V1_ROADMAP.md](V1_ROADMAP.md) for en realistisk vurdering af vejen til første egentlige spilversion.

## V0.5 Work and Capacity Engine

- Separat deterministisk `engine.js` med arbejdsopgaver, deadlines, kompetence, motivation, energi og relationer.
- Nye opgaver kommer ind hver dag; medarbejderne løser deres tildelte opgaver og kan overskride deadlines.
- Opgavetyperne tilpasses afdelingstype, og spilleren kan flytte opgaver mellem medarbejdere.
- Personalehandlinger: samtale, uddannelse og aflastning påvirker fremtidig kapacitet og arbejdsglæde.
- Ny side **Opgaver** viser backlog, forfaldne sager, afsluttede leverancer og teamkapacitet.
- Motoren bruger en fast seed og kan genafspilles i tests; tidligere gemte spil migreres til V0.5-modellen.

Det er en første egentlige driftssimulation, men endnu ikke en komplet organisatorisk simulation med tværgående relationer, budgetportefølje eller dybt afdelingsspecifikt indhold.

# Leadership Empire — The First 100 Days (V1.0)

En selvstændig, lokal browserprototype på dansk. Ingen eksterne tjenester, backend eller afhængigheder kræves.

**V1.0-kodekandidat:** Android- og webversionen bruger samme offline spilkerne. Spillet er klar til teknisk test; en faktisk Android-installation, signeret AAB og brugerafprøvning er ikke udført i udviklingsmiljøet. Se [RELEASE_NOTES.md](RELEASE_NOTES.md) for en verificerbar status.

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

## V0.6–V0.8 More Gameplay and Android Preparation

- Simulationsprofiler for syv afdelingstyper med forskellige opgavekategorier, tilstrømning, kompleksitet og leverancemålinger.
- Størrelsen af organisationen påvirker opgavemængden; organisationstypen påvirker budget og økonomisk afkast.
- Udvidet scenariebibliotek med flere dilemmaer gennem hele 100-dages forløbet.
- Leadership Academy har tre sammenhængende moduler med læringsmål, forskning, øvelser, refleksion og lokal underviservejledning.
- Spil kan eksporteres og importeres som JSON. Indlæsning erstatter lokal fremgang efter bekræftelse.
- Mulighed for at gå syv dage frem ad gangen, med pause ved større beslutninger.
- Daglig grænse på tre personalehandlinger.
- PWA-ikoner i 192 og 512 pixels og offline-cache.
- `build-apk.ps1`/`build-android.ps1` til lokal Windows-build og en manuel GitHub Actions-debugbuild.

Byg lokalt på Windows fra projektets rod:

```powershell
.\build-apk.ps1 -Platform apk
```

For AAB bruges `-Platform aab`. Release-AAB kræver separat signing. Android-pakken er endnu ikke valideret på en fysisk enhed i denne udviklingssession.

## V1.0 — samlet spilforløb og visuelt løft

- De første 100 dage kan spilles færdige med medarbejderhandlinger, opgavestyring, syv afdelingstyper, adskillige beslutningsforløb og en slutrapport.
- To nye illustrationer af ansatte i kontorets varme 2.5D-stil erstatter de simple CSS-figurer. Figurerne varierer i placering og bevægelse, men sprites anvendes på flere ansatte. Illustrationerne er AI-genereret specifikt til projektet.
- Bedre touch- og fokusmarkeringer, responsivt bundpanel og gennemarbejdet karrieredialog.
- Strengere kontrol af importerede gemmefiler, så åbenlyst ugyldige opgave- og medarbejderdata afvises.
- Tre faglige Academy-moduler med valgsituationer, refleksion, kilder og underviservejledning. Cases og konsekvensvægte er spilforfatterens model og ikke en videnskabeligt valideret lederbedømmelse.
- Regressionstest for alle syv afdelinger over 100 dage samt kontrol af offline-assets og Android-webpakke.

### V1.0 udviklingstest

```bash
npm test
npm run android:prepare
```

### Android-test på din Windows-pc

```powershell
git pull --ff-only origin main
.\build-apk.ps1 -Platform apk
```

Alternativt kan den manuelle GitHub Actions-workflow **Android debug build** køres fra fanen Actions. Den producerer en debug-APK som artifact, hvis workflowet lykkes. En signeret release-AAB kræver særskilt release-signering, keystore og test. Der er ikke integreret webkonto eller synkronisering i V1.0; eksport/import JSON er den private, manuelle overførsel.

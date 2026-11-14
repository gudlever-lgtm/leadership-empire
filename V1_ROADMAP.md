# Leadership Empire – vej til V1.0

Status pr. 14. november 2026. Dette er en produktvurdering, ikke en leverancedato.

## Hvad skal V1.0 være?

En komplet og stabil **The First 100 Days**-oplevelse på Android med en tilhørende webversion. Spilleren vælger organisationstype, størrelse og afdeling, leder 10–20 personer, gennemfører flere forskellige dilemmaer, ser konsekvenser over tid og får en forståelig evaluering på dag 100. Leadership Academy tilbyder mindst ét færdigt og fagligt gennemgået læringsforløb. Offline-spil og lagring er pålidelige.

## Nuværende status efter V0.4

| Område | Status | Mangler før V1.0 |
|---|---|---|
| Visuel identitet | Ny illustreret kontorbaggrund og enkel UI | Konsistente figurer/sprites, animationer, læsbar mobilvisning og visuel QA på faktiske enheder |
| Organisation | 12 medarbejdere, roller, relationstal og energital | Reelle arbejdsopgaver, teamdynamik, meningsfulde relationer og kapacitet |
| Konfiguration | Valg af 3 organisationstyper, 3 størrelser og 7 afdelinger | Afdelingstilpassede KPI'er, økonomiske rammer, scenarier og realistisk sværhedsgrad |
| Ledelsesbeslutninger | 1 hovedcase + 3 ekstra dilemmaer | Betydeligt flere sammenhængende cases, forsinkede effekter, feedback og balance |
| Tidsmodel | Dagsfremdrift og enkle ugeeffekter | Uge-/månedscyklus, opgavekø, hændelsesprioritering og meningsfuld 100-dages afslutning |
| Academy | Et indledende undervisningspanel og lokal refleksion | Fuldt modul med læringsmål, faglige kilder, case-debrief og brugerprøvning |
| Android | Capacitor-konfiguration og generering af webpakken | Android-projekt, rigtig APK/AAB, signering, permissions-review, tests på enheder |
| Web/hjemmeside | Samme spil kan åbnes på web | Vælg webhosting, app-/hjemmesidestruktur og deployment; konti er ikke nødvendig i V1.0 |
| Lagring | Lokal `localStorage` | Versionsstyrede gemmedata, migrations-/korruptionstest, backup/eksport eller gendannelse |
| Test | Enkle automatiske simulationsprøver | Browser-E2E, Android-smoketest, performance, accessibility og regression |

## Anbefalet sekvens

### V0.5 – Den fungerende afdeling

- En konkret opgavemodel: backlog, kapacitet, arbejdspres og leverancer.
- Medarbejdernes kompetencer og relationer påvirker opgaveløsning og hændelser.
- Simpel forklarbar konsekvensmotor med tidsforsinkelser.
- Test af deterministisk genafspilning af beslutningsforløb.

**Færdig når:** To forskellige ledelsesvalg kan give forskellige, forklarbare resultater over mindst fire simulerede uger.

### V0.6 – Reelt forskellige afdelinger

- Tre fuldt understøttede afdelingstyper i første omgang, fx IT, HR og Produktion.
- Forskellige KPI'er, roller, hændelser og budgetafvejninger.
- Udvid scenariebiblioteket og etabler content-skema med validering.
- De øvrige afdelinger markeres tydeligt som under udvikling, indtil indholdet er ligeværdigt.

**Færdig når:** Det føles mærkbart anderledes at spille mindst tre afdelinger, og ingen case omtaler et forkert fagområde.

### V0.7 – Academy og 100 dage

- Et fuldt undervisningsmodul med fagligt review, refleksion og debrief.
- Meningsfuld afsluttende rapport med årsagsforklaringer og hændelsestidslinje.
- Bedre dialoger, hints, onboarding og mulighed for at genspille forløb.

**Færdig når:** En testspiller uden introduktion kan gennemføre et helt forløb og forklare, hvorfor resultaterne ændrede sig.

### V0.8 – Mobilkvalitet

- Android UI i både stående og liggende format efter et bevidst layoutvalg.
- Figurer, knapper og paneler kvalitetssikret mod designreference på mindst to skærmstørrelser.
- Test af touch, navigation, gem/fortsæt, offline, pauser og tilgængelighed.
- Bygbar APK og AAB med dokumenteret lokal Windows-proces.

**Færdig når:** Hele 100-dages forløbet kan gennemføres på Android uden blocker-fejl eller tab af fremgang.

### V0.9 – Release candidate

- Fejlrettelser, balance og regression.
- Stabil save-migration, crash- og ydelsestest.
- Faglig gennemgang af Academy, privatlivstekster og konsekvensforklaringer.
- Endeligt app-id, navn, ikoner, versionsnummer og releasepakke.

**Færdig når:** Defineret testmatrix består, alle kritiske fejl er lukket, og V1.0-scope er låst.

## V1.0 releasekriterier

1. Komplet 100-dages karriereforløb med en reel afslutning.
2. Mindst tre afdelingstyper med forskellig mekanik og tilpasset indhold.
3. Et beslutningsbibliotek stort nok til at undgå ensartede gennemspilninger; konkret antal fastlægges efter playtest.
4. Varige, forståelige konsekvenser af medarbejder-, projekt- og budgetbeslutninger.
5. En fuld Academy-oplevelse med fagligt kvalitetssikret indhold.
6. Android APK og AAB kan bygges på Windows med dokumenteret og testet proces.
7. Spillet fungerer offline, og lokal fremgang bevares gennem lukning og appopdatering.
8. Ingen kendte kritiske fejl; mobil- og browserflow er manuelt gennemtestet.

## Bevidste fravalg i V1.0

Ingen online multiplayer, ingen omfattende organisationskoncern, ingen generativ AI som kritisk gameplayafhængighed og ingen krav om konto eller cloud-synkronisering. Facilitator Mode Professional kan være en selvstændig leverance efter den første stabile spiludgivelse. Websitet kan lanceres med information og download, før synkronisering bygges.

## Overordnet vurdering

V0.4 er stadig en **prototype**, især fordi beslutningsmotoren er for simpel og afdelingstyperne endnu deler for meget mekanik. Den kritiske vej til V1.0 er først simulationsdybde og indhold, derefter mobilkvalitet og release-sikkerhed. Et realistisk estimat kræver en spilbar vertikal slice, måling af produktionstid pr. case og en test af den lokale Android-buildkæde. Derfor er der ikke sat en dato eller et kunstigt procenttal på fremdriften.

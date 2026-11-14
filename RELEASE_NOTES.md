# Leadership Empire V1.0 — releasekandidat

Dato: 14. november 2026

## Omfang

Offline-first ledelsesspil på dansk med ét 100-dages karriereforløb, 12 fiktive medarbejdere, syv valgbare afdelingstyper, tre organisationstyper og tre organisationsstørrelser. Spilleren fordeler opgaver, prioriterer deadlines, understøtter medarbejderne, gennemfører dilemmaer og får en afsluttende evaluering. Academy har tre moduler til selvstudie og faciliteret diskussion.

## Visuelt

Kontor: `assets/office-v03.png`. To nye fuldkropsfigurer: `assets/employee-female-v1.png` og `assets/employee-male-v1.png`. UI i `v10.css`. Illustrationerne er lavet med billedgenerering til projektet. Medarbejderne er klikbare; rutebevægelser er en enkel iscenesættelse og ikke en fuld kollisionsfri isometrisk simulator. Samme sprites genbruges for flere medarbejdere. Der bør gennemføres visuel prøvning på rigtige skærme før offentlig distribution.

## Data, etik og privatliv

- Al spiltilstand, Academy-refleksioner og indstillinger ligger lokalt i browserens Web Storage.
- Der er ingen login, serverkonto, telemetri, reklamer eller automatiseret cloud-overførsel.
- JSON-eksport og import kan bruges til manuel backup. Backupfilen indeholder også personlige refleksioner fra spillet og bør håndteres privat.
- Modellen er pædagogisk fiktion. KPI-skalaer, kompetencescore og medarbejderreaktioner er ikke baseret på ægte ansatte og må ikke bruges til at evaluere menneskers ledelsesegnethed.
- Academy henviser til primære forskningskilder for teori; selve dilemmaernes udfald er konstruerede undervisningseksempler.

## Gennemført automatisk verificering

- Node-simulation: fulde 100-dages testforløb, herunder særskilt gennemspilning for alle syv afdelinger.
- Valg, personalehandlinger, deadlines, opgavefordeling, Academy, scenarier og lagring.
- Android-webbundle kopieres med CSS, billeder, spilkerne, offline-manifest og service worker.

## Resterende frigivelseschecks uden for dette miljø

- **Android SDK/Gradle-build:** Kør `build-apk.ps1` på Windows eller den manuelle GitHub Actions-workflow. APK er ikke kompileret eller installeret her.
- **Fysisk QA:** Afprøv mindst én mindre og én større Android-telefon i stående og liggende retning, både med og uden netværk. Kontroller touchmål, horisontal panorering, tekst, fokus, skærmskalering, ydelse og baggrund/genåbning.
- **Signeret udgivelse:** Beslut endeligt app-id, signing-keystore, Play Console-krav og release-AAB-signering før distribution.
- **Pædagogisk kvalitet:** Uafhængigt review af de tre Academy-moduler og rigtige playtests er ikke gennemført.
- **Webhosting:** Et offentligt domæne, driftsopsætning og eventuelt senere konto-/synkroniserings-API er ikke etableret.

**Klassifikation:** V1.0 kildekode-/featurekandidat, ikke dokumenteret produktionsklar Android-release.

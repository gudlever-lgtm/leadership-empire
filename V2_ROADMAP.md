# Leadership Empire — V2.0 roadmap

## V1 baseline (accepted 2026-11-14)

- Layout and premium logo are accepted as V1; avoid a broad visual redesign.
- The logo appears on the web startup/loading overlay and in the game header.
- Android packaging includes the app launcher icon; a physical-device visual check is still required.
- 27 automated checks pass, including 21 distinct 100-day careers with save/restart validation.
- These are deterministic simulation checks, not proof of real-world management validity or device usability.

## V2 product goal

Make leadership decisions matter **over time**, not just change a score immediately. Preserve offline play, Android compatibility, accessible touch controls and existing saves.

## Implemented V2 milestone: unforeseen incidents

- New career setup includes organizational level (team/department/executive), leadership experience, risk appetite, incident frequency (4–10) and accountability (off/gentle/normal/strict).
- Crisis engine schedules organization-wide, cross-departmental and departmental incidents across the first 100 days.
- Choices have explicit trade-offs; decisions outside a team leader's authority create additional exposure.
- Reckless repeated decisions may end the career with the deliberately irreverent **“DU ER F*CKING FYRET!”** result and a stated reason. Firing can be disabled at career creation.
- Old V1 saves migrate without backfilling crises from days that have already passed.
- Remaining: richer multi-stage consequences, more incident-specific choices, and physical-device QA.

## Implemented V2 milestone: floating guide and management consultants

- A persistent floating lightbulb opens a dismissible game guide and management consultant panel on every page.
- JE provides top-management, strategy, governance, executive-risk and budget advice.
- JM provides advice about the team's workload, people, trust, wellbeing and operational execution.
- Hire JE for 12 or JM for 7 **in-game budget points**; no real-money payments or advertising.
- Hired consultants automatically offer contextual advice every seven game days. On-demand advice is free once per consultant per game day and costs one budget point for additional same-day requests.
- Hires, advice history and daily request usage are persisted with the career and included in save exports.
- Future option: a separate budget-management advisor or tool that models scenarios rather than simply printing a generic financial recommendation.

## Implemented V2 milestone: Performance Center and consultant personalities

- Dedicated Performance Center accessible from the bottom navigation; unread evaluations are indicated there.
- Written appraisals on days 15, 30, 45, 60, 75, 90 and 100, with interim/termination appraisals for early dismissal.
- Each appraisal includes distinct assessments from the immediate superior and employees, plus JE and/or JM when hired.
- Evaluations use deterministic game metrics and include targeted recommendations, a score, a change against the previous report and saved snapshots.
- Reports are saved with the career and included in export/import; existing V1/V2 saves without reports migrate safely.
- JE now speaks in a concise, challenging strategic/executive voice. JM speaks in a practical, candid and people-centered voice. Their advice remains context-specific.
- No external AI calls, real-money transactions, or claims of validated psychometric accuracy.
- Future: follow-up commitments in Performance Center and multi-stage appraisals that react to completion of earlier recommendations.

## Implemented V2 milestone: Leadership Learning

- Ten optional Academy modules with scenario choices, explanations and a written reflection (the original three include direct research references; the seven new exercises are game-authored).
- Contextual, dismissible learning moments after leadership choices and crises, each with a concise principle and reflection question.
- Ten simulated leadership-competence practice indicators; decisions, reflections and first-time module completions contribute bounded progress points. **These are not certified skills or an assessment of real management ability.**
- A personal development plan in Performance Center: after a review, select 1–3 measurable goals. They are assessed as achieved or not achieved at the next scheduled review.
- Learning state is saved offline, included in career export/import, and migrated when older career saves are loaded.
- 42 automated tests pass, including learning workflows and 21 deterministic 100-day regression careers. Android web assets bundle successfully; device UI testing remains pending.
- Future: targeted advisor coaching attached to individual development goals, stronger pedagogical source references for the seven newer modules, and long-term consequence feedback.

## Implemented V2 milestone: delayed consequences and recovery

- Three multi-day case threads follow the player's first conflict, workload and change-management dilemmas.
- Each thread creates a four-day employee feedback checkpoint and an eleven-day resolution; the initial choice and any follow-up influence the outcome.
- Three voluntary responses at the checkpoint: follow up through dialogue, involve extra help at a cost of three in-game budget points, or wait.
- Follow-up messages and measurable changes to trust, wellbeing or delivery are preserved in the career save, decisions view and insights view.
- Subsequent Performance Center reviews mention recent cases and whether the player acted on employee feedback.
- Old saves initialize with an empty consequences timeline, avoiding retroactive penalties.
- 46 automated tests now pass; 21 full careers finish with all three threads closed, and Android web asset preparation succeeds.
- Future: additional department-specific threads, longer interdepartmental dependencies, and more nuanced feedback based on team members rather than fixed scenario scripts.

### P0: safety and compatibility

1. Manual Android smoke test (fresh install and update): splash, full-screen layout, logo, navigation, touch and return from background.
2. Save-schema migration tests before introducing new employee fields or long-term consequences; never silently reset a career.
3. Repeat 100-day regression across all departments and organizations after each simulation-engine change.

### P1: employee behavior and consequences

1. Model visible employee needs (workload, autonomy, recognition, psychological safety) as **game mechanics** with bounded and documented effects.
2. Create incident/event threads with a beginning, follow-up and resolution spanning 5–20 days.
3. Have the game explain why morale, collaboration and delivery changed, including trade-offs and delayed outcomes.
4. Guard against unavoidable failure spirals: provide recovery options with resource costs and clear feedback.

### P2: management dashboard

1. Show 7/30-day trends for delivery, trust, wellbeing and budget, not just current values.
2. Surface leading indicators: workload by person, overdue tasks and team relationship risks.
3. End-of-career report compares starting conditions, decisions, trends and outcomes; label values as a simulation.

### P3: content and polish

1. Department-specific story arcs in all seven careers and meaningful replays.
2. A concise first-time tutorial, adjustable pacing, reduced-motion support and sound that can be muted.
3. UI V2 should refine information density and phone ergonomics without replacing the accepted V1 brand.

## V2 definition of done

- All department/organization combinations finish 100 days without deadlocks or invalid state.
- Save migration restores an old V1 career and retains its decisions and data.
- At least three distinct multi-day case chains have testable, observable downstream effects.
- Dashboard trends reconcile with the underlying simulation and end-of-career report.
- Android installation/update and gameplay smoke tests are verified on a physical phone.

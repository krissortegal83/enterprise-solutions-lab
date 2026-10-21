# Architecture decision record — Customer Success Intelligence Center

## Scope and intent

The exercise demonstrates **customer-success decision quality**, not software complexity. Reviewers should be able to find a risky customer, understand why their health score is weak, identify the appropriate customer-success motion, simulate an intervention, and produce an executive-level takeaway in one continuous workflow.

## Component boundaries

```text
index.html + assets/styles.css
    | app shell / responsive visual system / accessibility semantics
    v
src/app.js
    | navigation / keyboard and click events / local storage / report export
    | calls only pure model functions for all domain calculations
    v
src/model.js <---- src/data.js
    | weighted health, prioritization, renewal exposure,
    | playbook selection, simulated activity events, report serialization
    v
Browser localStorage (synthetic data only)
```

No backend service, account authentication, tracking pixel, internet API, build pipeline, database, vendor credential or framework runtime is necessary.

## Domain model

Account:

| Field | Meaning | Measurement assumption |
|---|---|---|
| `arr` | Annual contract value | Fictional USD annual value, not recognized revenue |
| `renewal` | Next subscription renewal date | Fixed initial offsets from initial browser session day |
| `adoption` | Adoption signal | Synthetic percentage, 0–100 |
| `value` | Business outcome realization | Synthetic normalized proxy, 0–100 |
| `sponsor` | Executive relationship readiness | Synthetic normalized proxy, 0–100 |
| `p1` | Unresolved priority support cases | Integer >=0, fictional |
| `lastTouch` | Last stakeholder interaction | Date, UTC day arithmetic |
| `activities` | User-triggered demonstration events | Local-only append-only event objects |
| `notes` | User-entered scenario notes | Browser local only, escaped before rendering |

**Health equation**

```text
engagement = clamp(100 - max(0, days_since_touch - 7) × 2.5)
support_health = clamp(100 - unresolved_P1 × 24)
renewal_readiness = clamp(sponsor_score - (renewal<=90d ? 8 : 0)
                                              - (renewal<=45d ? 10 : 0))
health = round(0.35×adoption + 0.20×engagement + 0.20×value
                            + 0.10×support_health + 0.15×renewal_readiness)
```

`clamp` bounds each signal to the inclusive interval `[0,100]`. Segments are healthy >=74, watch 58–73, critical <58. Near-term renewal <=45 days with adoption <50 is critical regardless of score. Renewal proximity is not treated as evidence of churn by itself.

**Synthetic renewal scenarios:** For contracts due within 90 days, a simple bounded heuristic maps health to an illustrative per-account renewal weight, and the sum of `(ACV × renewal_weight)` yields a scenario-weighted ACV. This value does not claim statistical validity, predictive power, net retention, or revenue accounting accuracy.

## Interaction contracts

`recordActivity(account, type, date)` returns a new account object; the source account is not mutated. Actions:

- `touch`: last engagement becomes today; stakeholder alignment increases by four points.
- `enablement`: adoption increases by eight points, outcome score by three.
- `qbr`: value score increases by eight and sponsor score by eight; touch becomes today.
- `escalation`: open priority cases decrease by one, never below zero.

All effects are artificial and intentionally explicit. Completing a simulated QBR does not prove real value delivery.

## Security, privacy, limitations

- Do not enter confidential notes: browser localStorage is not a secure store. The text field explicitly signals that notes are local-only.
- `safe()` escapes all account strings and notes before interpolating into the HTML templates. User text is length-limited to 2,000 characters in the UI.
- There is no multi-user model or authorization system, and no backend. This demo must not be advertised as ready for production or used to manage actual customer data.
- Browser storage can be blocked, cleared, or corrupted. Loading falls back to a fresh 35-account baseline.
- Current snapshot is evaluated relative to the viewer's local calendar day; a previously saved baseline will naturally age as time passes until reset.
- Language selection produces editable templates but does not send an email or sync a calendar event.
- A production implementation would require consent and retention policies, role-based access, audit trails in durable storage, encrypted secret handling, tenant isolation, tested connectors, lineage, monitoring and formal model validation.

## Accessibility and responsiveness

The application uses semantic tables, functional navigation buttons, form labels, keyboard-operable rows, focus-visible states and a reduced-motion media query. Major screen sizes support a compact mobile header, responsive metrics and a full-width account drawer. A production build would need a formal screen-reader and WCAG audit.

## Tests and quality gates

Execute `npm run verify` on each change. Scenarios cover input dataset integrity, UTC calendar math, risk thresholds, account-level action impact, bounded financial aggregates, bilingual communications and 35-row exports. Quality gates are zero syntax failures and zero failed tests.

## Recommended demonstration script (3 minutes)

1. Open Overview and explain the difference between *ACV exposed* and *forecast churn*.
2. Choose a critical renewal from the Action Queue; inspect why it was flagged and the suggested recovery motion.
3. Simulate stakeholder engagement and enablement; observe the recalculated account health while explicitly distinguishing assumed effect from actual commercial outcome.
4. Generate a Spanish or English outreach invitation; show how the same motion can scale across geographies.
5. Open Executive Brief, point to the qualitative leadership decisions and export the Markdown report.

This demonstrates a customer-facing operator's mindset: measurable outcomes, early warning signs, documented next actions, appropriate escalation and clear executive communication.

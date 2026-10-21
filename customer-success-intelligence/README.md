# Customer Success Intelligence Center

**Executive-ready, interactive customer-success portfolio simulation**  
Independent case study by Christian Ortega · October 2026

A lightweight, dependency-free portfolio workspace illustrating how a B2B SaaS customer success manager prioritizes accounts, interprets customer health, takes action on adoption gaps and communicates renewals and outcomes to business leadership.

> **Demonstration, not a commercial deployment.** All 35 companies, account values, engagement dates and health metrics are fictional and generated for this case study. The project is not affiliated with Sitetracker, Salesforce or any other vendor. It does not connect to customer systems or send messages.

## What reviewers can actually do

- Explore 35 fictional enterprise accounts across utilities, telecom, renewable energy, construction and field services in Mexico, Canada and the United States.
- Search, filter and rank customer accounts by health, renewal proximity, industry and annual contract value.
- Open any account to inspect a transparent weighted customer-health score with its underlying drivers.
- Record realistic simulated actions: stakeholder engagement, enablement, quarterly business reviews and priority-case resolution. Observe recalculated portfolio priorities.
- Review four actionable customer success playbooks: recovery and retention, renewal assurance, adoption acceleration and value expansion.
- Generate bilingual business-review outreach in English or Spanish.
- Export the entire fictional account portfolio to CSV and a leadership-ready snapshot to Markdown.
- Keep browser-local demonstration notes and activities, or reset to a deterministic baseline.

## Start locally

No package install, API tokens, external fonts or runtime services needed. Serve the folder over HTTP because ES modules do not reliably load from `file://` URLs.

```bash
cd customer-success-intelligence
python -m http.server 8080
# Browse http://localhost:8080
```

Or open the deployed project's GitHub Pages URL when enabled.

## Design notes

**Architecture:** static document (`index.html`) → presentation and interaction (`src/app.js`, `assets/styles.css`) → domain rules (`src/model.js`) → seed data (`src/data.js`). Pure business rules are independently testable. The UI uses accessible HTML and native browser features, and avoids frameworks and third-party scripts.

**Scoring:** configurable-looking but deliberately fixed reference weights: product adoption (35%), engagement recency (20%), business outcome proxy (20%), unresolved P1 support cases (10%) and executive sponsor / renewal readiness (15%). Scores are bucketed as at risk (<58), watch (58–73), healthy (74+). An additional override marks accounts with renewal within 45 days and adoption below 50 as at risk. These are **illustrative heuristics**, not proven retention correlations.

**Revenue modeling:** ACV is fictional, stated in USD. "Risk exposure" is the sum of annual contract value in non-healthy tiers, not a churn or loss prediction. The exported 90-day renewal-weighting model is a scenario exercise, not machine learning or a trained forecast.

**State:** all actions and free-text notes use browser `localStorage`, never a backend. The app cannot exchange data with any CRM, and is intentionally a single-user demo rather than a multi-tenant platform.

**Safety:** no credentials, API keys, real customer data, vendor logos or copies of proprietary enterprise interfaces. Entries containing fictional data are not evidence of real business outcomes.

For decision logic, calculations, data lineage and limitations see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Validation

```bash
npm run verify
```

This runs JavaScript syntax checks and Node's native test suite, covering record uniqueness, day arithmetic, health thresholds and overrides, financial rollups, activity effects, playbook assignment, bilingual drafts and export correctness.

## License

MIT. Source is provided as a professional skills demonstration and not as a representation of software deployed for former employers or clients.

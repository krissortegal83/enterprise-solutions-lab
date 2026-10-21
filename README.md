# Technical Delivery Lab

**Interactive technical program management portfolio** — three practical, browser-based demonstrations of customer success, enterprise integration and cross-functional software delivery.

> **Live website (requires GitHub Pages activation):** https://krissortegal83.github.io/technical-program-management-portfolio/

## Explore the demos

| Demo | What you can do | Open source |
| --- | --- | --- |
| **Customer Success Intelligence Center** | Explore 35 fictional enterprise accounts, prioritize retention risk, run adoption playbooks, generate bilingual outreach and export an executive review | [Interactive demo](customer-success-intelligence/index.html) · [Architecture and scoring](customer-success-intelligence/docs/ARCHITECTURE.md) |\n| **CRM Integration Console** | Process contact events, replay batches, test idempotency and stale updates, flag conflicts, export audit JSON | [Interactive source](crm-integration-demo/index.html) · [Python implementation](crm-integration-demo/crm_sync.py) |
| **Technical Program Command Center** | Explore an AI-feature delivery roadmap, resolve blockers, simulate delays, adjust risk levels, export executive status Markdown | [Interactive source](tpm-program-dashboard/index.html) · [Python implementation](tpm-program-dashboard/program_dashboard.py) |

The interactive site uses static HTML/CSS and native JavaScript modules. The customer success case study is a standalone simulation using transparent, weighted account-health rules. It runs entirely in the visitor's browser: **no API credentials, backend server, login, paid dependency or real business data**.

### Quality checks

[![Portfolio quality checks](https://github.com/krissortegal83/technical-program-management-portfolio/actions/workflows/python-tests.yml/badge.svg)](https://github.com/krissortegal83/technical-program-management-portfolio/actions/workflows/python-tests.yml)

- Python unit tests for both technical delivery reference programs.\n- Nine native JavaScript tests for customer-success data integrity, risk, reporting and engagement scenarios (`cd customer-success-intelligence && npm run verify`).
- Node.js tests for integration and program-health decision logic.
- GitHub Actions for syntax validation and continuous integration.

```bash
python crm-integration-demo/crm_sync.py
python tpm-program-dashboard/program_dashboard.py
python -m unittest discover -s tests -v
node --test tests/demo-engines.test.mjs
```

### GitHub Pages: one-time setup

A repository admin needs to select **Settings → Pages → Build and deployment → Source: GitHub Actions** once. The [Pages publishing workflow](.github/workflows/deploy-pages.yml) then deploys the static site automatically after pushes to `main`. Until that setting is enabled, the source files remain public but the `github.io` URL may return a 404.

### Design rationale

- **CRM reliability:** unique identity, timestamp normalization, no duplicate writes after replay, auditable decisions and conflict escalation.
- **Program delivery:** transparent task ownership, validated dependency graphs, visible risk thresholds, milestones and action-driven status reports.
- **Engineering communication:** a technical program manager can use both demos to discuss delivery expectations, integration contracts and escalation decisions.

**Important limitations:** these projects are *recent portfolio demonstrations*, not production deployments or claims of prior professional software development. All contacts, teams, businesses and milestones are **fictional**. Real production systems would require security review, robust permissions, observability, persistence, reliable event identifiers and further testing. AI-assisted code development was used in creating these exercises.

## Privacy & license

No private KMOV files, real customer records, secrets or credentials are included. MIT licensed.

Created October 2026 · Christian Ortega.

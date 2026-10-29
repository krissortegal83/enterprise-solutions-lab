# Implementation Readiness Lab

Make a go-live recommendation from user acceptance, data reconciliation, rollback, training and stakeholder communication evidence.

**Español:** Preparación de implementación: evidencia de pruebas, migración, reversión, capacitación y decisión de puesta en marcha.

[Live demonstration](https://krissortegal83.github.io/technical-program-management-portfolio/implementation-readiness/) · [Portfolio home](../README.md)

## Business case

A project can report high completion while still carrying a critical launch blocker. Readiness must follow evidence and ownership.

## Design decision

Use hard gates for critical controls, distinguish advisory actions, and reopen the recommendation whenever evidence changes.

## Guided demonstration

1. Observe the initial NO GO decision and identify the accountable owners.
2. Confirm the four critical controls: the recommendation becomes CONDITIONAL GO.
3. Confirm communications to obtain GO. Reopen rollback: the result returns to NO GO.

## Acceptance criteria

- Any incomplete critical control forces NO GO.
- Advisory work produces CONDITIONAL GO only after critical controls clear.
- Reopening a critical control immediately blocks release.

## Implementation

`index.html` → shared `assets/lab-ui.mjs` → pure functions in `assets/business-rules.mjs` → in-memory state and downloadable JSON/Markdown. Business rules are tested with Node’s built-in test runner. No installation, vendor account, backend or paid service is required for the deployed demo.

## Scope and production gap

Illustrative governance checklist and deterministic recommendation. No certification, formal sign-off or authorization to operate a real system.

A production pilot requires authenticated users, appropriate permissions, durable storage, integration contract testing, monitoring, data governance, operational ownership and acceptance. Metrics are scenario outputs, not historical client results.

## Validation

Run `npm test` from the repository root. Run `python -m http.server 8000`, then open this folder in the browser to test the scenario and exports. See [quality evidence](../docs/QUALITY.md).

## Authorship and provenance

Independent project created for Christian Ortega Lugo’s portfolio using AI-assisted implementation. Fictional organizations and records only. It is not an employer deliverable, endorsement, vendor certification or claim of deployed client outcomes. The professional owner should review and be prepared to explain the design and limitations.

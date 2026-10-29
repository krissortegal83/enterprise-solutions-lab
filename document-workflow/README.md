# Document Review Lab

Extract labeled invoice text, surface missing fields and arithmetic errors, and require a named human review before approval.

**Español:** Digitalización documental: extracción de texto estructurado, validación y aprobación humana con registro de decisiones.

[Live demonstration](https://krissortegal83.github.io/technical-program-management-portfolio/document-workflow/) · [Portfolio home](../README.md)

## Business case

Document automation must distinguish extraction from approval. Missing information or inconsistent totals must enter an exception workflow.

## Design decision

Parse explicit labels, validate required data and purchase-order reference, check arithmetic and require a named reviewer.

## Guided demonstration

1. Load the inconsistent invoice and extract it. Approval is blocked.
2. Correct Total to 125000 and extract again. Review the resulting fields.
3. Confirm human review, enter a demo reviewer and approve. Export the decision trail.

## Acceptance criteria

- Incorrect totals, duplicate labels and missing fields are surfaced.
- A document with exceptions cannot be approved.
- Approval requires a named reviewer and explicit confirmation.

## Implementation

`index.html` → shared `assets/lab-ui.mjs` → pure functions in `assets/business-rules.mjs` → in-memory state and downloadable JSON/Markdown. Business rules are tested with Node’s built-in test runner. No installation, vendor account, backend or paid service is required for the deployed demo.

## Scope and production gap

Pasted synthetic text only. Deterministic parser, no OCR, document upload, AI API, payment authorization, persistent repository or production document management.

A production pilot requires authenticated users, appropriate permissions, durable storage, integration contract testing, monitoring, data governance, operational ownership and acceptance. Metrics are scenario outputs, not historical client results.

## Validation

Run `npm test` from the repository root. Run `python -m http.server 8000`, then open this folder in the browser to test the scenario and exports. See [quality evidence](../docs/QUALITY.md).

## Authorship and provenance

Independent project created for Christian Ortega Lugo’s portfolio using AI-assisted implementation. Fictional organizations and records only. It is not an employer deliverable, endorsement, vendor certification or claim of deployed client outcomes. The professional owner should review and be prepared to explain the design and limitations.

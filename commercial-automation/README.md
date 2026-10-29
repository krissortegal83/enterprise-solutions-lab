# Commercial Workflow Lab

Turn a synthetic inquiry into a qualified opportunity, an accepted scope and a specialist handover with an explicit stage contract.

**Español:** Automatización comercial: captura, calificación, propuesta y entrega a especialistas con trazabilidad.

[Live demonstration](https://krissortegal83.github.io/technical-program-management-portfolio/commercial-automation/) · [Portfolio home](../README.md)

## Business case

Leads lose momentum when intake, qualification and delivery handover are disconnected. A pipeline stage needs supporting evidence.

## Design decision

Deduplicate by normalized email, route by required service and require discovery, scope and acceptance before advancing.

## Guided demonstration

1. Capture the sample lead twice; the pipeline should contain one opportunity.
2. Try advancing before confirming discovery. Then confirm discovery and advance.
3. Confirm scope, advance to proposal, record acceptance and complete the handover.

## Acceptance criteria

- Duplicate email does not inflate the pipeline.
- Evidence gates block unsupported stage changes.
- The final handover preserves the service specialty and decision trail.

## Implementation

`index.html` → shared `assets/lab-ui.mjs` → pure functions in `assets/business-rules.mjs` → in-memory state and downloadable JSON/Markdown. Business rules are tested with Node’s built-in test runner. No installation, vendor account, backend or paid service is required for the deployed demo.

## Scope and production gap

Local browser state and simulated specialty routing. No live CRM connection, email delivery, real partner referral, revenue prediction or signed contract.

A production pilot requires authenticated users, appropriate permissions, durable storage, integration contract testing, monitoring, data governance, operational ownership and acceptance. Metrics are scenario outputs, not historical client results.

## Validation

Run `npm test` from the repository root. Run `python -m http.server 8000`, then open this folder in the browser to test the scenario and exports. See [quality evidence](../docs/QUALITY.md).

## Authorship and provenance

Independent project created for Christian Ortega Lugo’s portfolio using AI-assisted implementation. Fictional organizations and records only. It is not an employer deliverable, endorsement, vendor certification or claim of deployed client outcomes. The professional owner should review and be prepared to explain the design and limitations.

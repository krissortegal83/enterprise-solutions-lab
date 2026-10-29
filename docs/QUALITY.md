# Quality evidence and review boundaries

## Automated checks

Run `npm run verify` for JavaScript syntax, HTML local references and deterministic scenario tests, including the original CRM, program and customer-success tests. Run `python -m unittest discover -s tests -v` for the original Python reference engines.

The release pipeline must pass these checks before publishing the Pages artifact. The newest successful GitHub Actions run is the current source of verification status.

## New scenario acceptance

| Case | Required acceptance evidence |
|---|---|
| Healthcare | Validate supported fixture, reject malformed fields, deduplicate, recover offline queue, block patient mismatch |
| ERP | Unique partial receipts, over-receipt rejection, quantity and price holds, successful three-way match |
| Commercial | Unique lead, specialty routing, discovery/scope/acceptance gates, complete handover |
| Documents | Missing and duplicate fields, invalid totals, unknown PO, named human review, approval invalidation on re-extraction |
| Implementation | Critical gate → NO GO, advisory pending → CONDITIONAL GO, all clear → GO, reopened blocker → NO GO |

## Browser acceptance

For each new case: open the live page, run the documented happy path and at least one blocked path, export JSON and Markdown, reset the scenario and inspect the browser console. Inspect the home page at desktop and narrow viewport widths. Existing demos must still load and their controls must work. Use synthetic data only.

Automated rule tests do not constitute a security audit, accessibility certification, healthcare standards conformance assessment or production acceptance. Manual observations and remaining limitations are recorded in the release notes.

## Data and trust boundaries

- No external dependencies or API keys are needed to visit the new labs.
- New scenario state is in browser memory. Reloading resets it; exports are local downloads.
- Existing customer-success state is in browser localStorage; it is not secure multi-user storage.
- User-entered text is escaped before HTML rendering. Document text has a size limit; identifiers have a constrained grammar.
- Exports may contain whatever the visitor typed. Do not enter confidential material.
- No authentication, authorization, persistent audit service, vendor connector or clinical workflow is implemented.

## Professional claims

These independent demonstrations show a documented approach and functional rules within a limited scope. They do not establish production experience with the source code, historical client outcomes, market demand, investment traction or third-party endorsements. Employer names belong to professional background only.

# Healthcare Integration Lab

Trace a synthetic radiology order from intake to imaging metadata association. Detect invalid identifiers, replay safely and recover an unavailable interface.

**Español:** Interoperabilidad hospitalaria: valida órdenes ficticias, recupera mensajes y verifica la asociación de paciente y estudio.

[Live demonstration](https://krissortegal83.github.io/technical-program-management-portfolio/healthcare-integration-lab/) · [Portfolio home](../README.md)

## Business case

Hospital workflows depend on consistent identifiers and reliable interfaces. A duplicate order or mismatched patient must surface as an exception, not disappear silently.

## Design decision

Validate the supported message subset, preserve a deterministic decision trail, queue offline deliveries and block patient mismatches.

## Guided demonstration

1. Process the sample order, then replay it: only one accepted record remains.
2. Load a new order, take the interface offline and process it. Restore the interface and retry the queue.
3. Associate DEMO-001 with ORD-1001. Try another patient ID and observe the block.

## Acceptance criteria

- A repeated message does not create another order.
- An identical message ID with different content is flagged.
- Offline deliveries are recoverable; patient mismatches never associate.

## Implementation

`index.html` → shared `assets/lab-ui.mjs` → pure functions in `assets/business-rules.mjs` → in-memory state and downloadable JSON/Markdown. Business rules are tested with Node’s built-in test runner. No installation, vendor account, backend or paid service is required for the deployed demo.

## Scope and production gap

Educational HL7 v2.5 ORM^O01 subset and DICOM-inspired JSON metadata matching. No MLLP listener, DICOM server, binary image parsing, full standards validation or clinical use.

A production pilot requires authenticated users, appropriate permissions, durable storage, integration contract testing, monitoring, data governance, operational ownership and acceptance. Metrics are scenario outputs, not historical client results.

## Validation

Run `npm test` from the repository root. Run `python -m http.server 8000`, then open this folder in the browser to test the scenario and exports. See [quality evidence](../docs/QUALITY.md).

## Authorship and provenance

Independent project created for Christian Ortega Lugo’s portfolio using AI-assisted implementation. Fictional organizations and records only. It is not an employer deliverable, endorsement, vendor certification or claim of deployed client outcomes. The professional owner should review and be prepared to explain the design and limitations.

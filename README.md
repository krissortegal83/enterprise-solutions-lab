# Enterprise Delivery Lab — Christian Ortega Lugo

**Healthcare IT · ERP · CRM automation · implementation · customer adoption**

[Open the interactive portfolio](https://krissortegal83.github.io/technical-program-management-portfolio/) · [LinkedIn](https://www.linkedin.com/in/christian-ortega-lugo-7523a518b/) · [Quality and scope](docs/QUALITY.md)

## Español

Portafolio de consultoría de negocio y tecnología: seis casos interactivos para explorar interoperabilidad hospitalaria, compras e inventarios, automatización comercial, preparación de implementaciones, adopción de clientes y revisión documental. Datos ficticios, sin cuentas ni servicios de pago para visitar las demos.

## Explore the work

| Case | Business question | Demo / implementation |
|---|---|---|
| **Hospital interoperability** | Validate a radiology order, recover offline deliveries and block patient mismatches. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/healthcare-integration-lab/) · [Case study](healthcare-integration-lab/README.md) |
| **Procure-to-pay controls** | Receive partial deliveries, inspect stock and hold an invoice when the evidence does not match. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/erp-procure-to-pay/) · [Case study](erp-procure-to-pay/README.md) |
| **Commercial workflow** | Qualify a lead, agree scope and prepare an accepted handover to the right specialist. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/commercial-automation/) · [Case study](commercial-automation/README.md) |
| **Evidence before go-live** | Review UAT, data reconciliation, rollback and user readiness before recommending release. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/implementation-readiness/) · [Case study](implementation-readiness/README.md) |
| **Adoption & account health** | Explore 35 fictional accounts, explain risk signals and prepare customer and leadership reviews. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/customer-success-intelligence/) · [Case study](customer-success-intelligence/README.md) |
| **Human-reviewed automation** | Extract invoice text, correct exceptions and require explicit human review before approval. | [Live demo](https://krissortegal83.github.io/technical-program-management-portfolio/document-workflow/) · [Case study](document-workflow/README.md) |

Additional exercises: [CRM reliability](crm-integration-demo/) and [program dependencies](tpm-program-dashboard/).

## Professional context

Mechatronics Engineer and MBA from Tecnológico de Monterrey. Background in healthcare implementations and support at AGFA HealthCare, professional services at Epicor, Dynamics 365 project coordination, and earlier industrial engineering. Commercial collaborations include Browith, Consultoría Montag and Sperto Digital. [Full experience and exact role scope on LinkedIn](https://www.linkedin.com/in/christian-ortega-lugo-7523a518b/).

These new exercises demonstrate an approach to discovery, integration, operational controls and delivery. They are not employer source code or historical client deliverables. Technology names describe professional context or a documented demonstration subset; they do not imply endorsements or live vendor integrations.

## Run locally

Requires Python 3 for the static server, Node.js 22+ for JavaScript tests, and Python 3.11+ for reference tests. No npm installation required.

```bash
python -m http.server 8000
# Open http://localhost:8000/
```

```bash
npm run verify
python -m unittest discover -s tests -v
```

The new labs share pure rule functions in `assets/business-rules.mjs` and an accessible UI in `assets/lab-ui.mjs`. Business scenarios cover duplicates, conflicts, over-receipts, invoice holds, gated handovers, document exceptions and release blockers. Existing engines and their tests remain in place.

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`, after the quality job succeeds. Repository Settings → Pages must use **GitHub Actions** as source. The workflow publishes only an explicit allowlist of demo files and documentation. See workflow run status before assuming the public site is current.

## What the demonstrations do and do not do

- New labs perform actual deterministic browser-side validation and state transitions. JSON audits and Markdown briefs are downloadable.
- Healthcare supports a limited HL7 v2.5 message fixture and metadata association, not a full HL7/DICOM implementation.
- ERP uses one synthetic purchase order, exact unit-price matching, whole units and MXN without tax. It does not post accounting or payments.
- Commercial routing is illustrative and sends nothing externally.
- Document extraction parses labeled text. It is not OCR or AI inference.
- Customer success scores and intervention effects are explicitly assumed, not calibrated churn forecasts or verified revenue outcomes.
- New labs reset on reload. Customer success uses browser localStorage. No confidential data should be entered.

## Collaboration and commercial inquiries

For employment, consulting, freelance projects or specialist partnerships, [contact me on LinkedIn](https://www.linkedin.com/in/christian-ortega-lugo-7523a518b/) with the process, current systems, desired result, scope and timeline. Real integrations, production security, hosting, ownership and support are scoped separately. These demos alone do not demonstrate investment traction or market validation.

## Authorship, privacy and license

Independent portfolio work created in October 2026 using AI-assisted engineering. All organizations, contacts and scenario results in the demonstrations are fictional. No private source code, patient records, customer data or credentials are included. The professional owner should review and be able to explain each case. MIT licensed.

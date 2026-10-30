# Business & Technology Projects

I'm **Christian Ortega Lugo**. This catalog brings together practical examples of connecting systems, improving workflows and preparing reliable handovers.

**[Visit my site and try the projects](https://krissortegal83.github.io/)** · [GitHub profile](https://github.com/krissortegal83) · [Contact me on LinkedIn](https://www.linkedin.com/in/christian-ortega-lugo-7523a518b/)

## Find a project

| Project | What it helps with | Try it | Explore the code |
|---|---|---|---|
| **Healthcare Integration** | Connect radiology orders and studies without mismatching patients. | [Open demo](https://krissortegal83.github.io/healthcare-integration-lab/) | [View project](https://github.com/krissortegal83/healthcare-integration-lab) |
| **Purchasing & Inventory** | Check that ordered, received and invoiced quantities agree. | [Open demo](https://krissortegal83.github.io/erp-process-lab/) | [View project](https://github.com/krissortegal83/erp-process-lab) |
| **Sales & Client Follow-up** | Keep opportunities moving from the first conversation to a clear handover. | [Open demo](https://krissortegal83.github.io/crm-workflow-automation/) | [View project](https://github.com/krissortegal83/crm-workflow-automation) |
| **Implementation Readiness** | Know what still needs attention before a system goes live. | [Open demo](https://krissortegal83.github.io/enterprise-solutions-lab/implementation-readiness/) | [View project](https://github.com/krissortegal83/enterprise-solutions-lab/tree/main/implementation-readiness) |
| **Customer Adoption & Success** | Identify customers who need support and choose a useful next step. | [Open demo](https://krissortegal83.github.io/enterprise-solutions-lab/customer-success-intelligence/) | [View project](https://github.com/krissortegal83/enterprise-solutions-lab/tree/main/customer-success-intelligence) |
| **Document Review** | Find missing information and errors before approving a document. | [Open demo](https://krissortegal83.github.io/enterprise-solutions-lab/document-workflow/) | [View project](https://github.com/krissortegal83/enterprise-solutions-lab/tree/main/document-workflow) |

## How the repositories fit together

Healthcare integration, purchasing and inventory, and sales follow-up have their own repositories and live demos. This catalog preserves the original shared history and includes implementation readiness, customer success and document review.

Additional exercises: [CRM synchronization](https://krissortegal83.github.io/enterprise-solutions-lab/crm-integration-demo/) and [program dependencies](https://krissortegal83.github.io/enterprise-solutions-lab/tpm-program-dashboard/).

## My approach

Understand the operation, make the rules clear, test failure cases and prepare a useful handover. My professional background spans healthcare IT, enterprise implementations, customer-facing delivery and collaboration with specialist partners.

## Run and check the catalog

```bash
python -m http.server 8000
# Open http://localhost:8000
node scripts/check-site.mjs
node --test tests/*.test.mjs customer-success-intelligence/tests/*.test.mjs
python -m unittest discover -s tests -v
```

Use Node.js 22+ and Python 3.11+. The catalog demos need no npm packages or paid APIs. [Quality checks and scope](docs/QUALITY.md).

## Scope and provenance

These are independent, AI-assisted demonstrations with fictional data. They are not former-employer deliverables or claims of client outcomes. Live vendor connections, production permissions, persistent storage and formal acceptance must be scoped separately. Each case documents its limits. MIT licensed.

## En español

Soy Christian. Este catálogo reúne ejemplos de integración hospitalaria, compras, seguimiento comercial, implementación y automatización. Puedes probar las demos sin registro. El inglés es el idioma principal para facilitar su revisión internacional; los proyectos incluyen resúmenes en español. [Platiquemos](https://www.linkedin.com/in/christian-ortega-lugo-7523a518b/).

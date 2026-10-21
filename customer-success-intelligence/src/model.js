/** Pure, deterministic business rules. Inputs are fictional; values are illustrative. */
const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const round = n => Math.round(n);
export const US = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const num = new Intl.NumberFormat('en-US');
export const asMoney = value => US.format(value);
export const asCompact = value => value >= 1_000_000 ? `$${(value/1_000_000).toFixed(2)}M` : `$${Math.round(value/1000)}k`;

export function daysUntil(dateIso, todayIso) {
  const target = Date.parse(`${dateIso}T12:00:00Z`);
  const today = Date.parse(`${todayIso}T12:00:00Z`);
  if (!Number.isFinite(target) || !Number.isFinite(today)) throw new Error('Invalid calendar date');
  return Math.round((target - today) / 86400000);
}

export function accountHealth(a, today) {
  const days = daysUntil(a.renewal, today);
  const silence = Math.max(0, -daysUntil(a.lastTouch, today));
  const engagement = clamp(100 - Math.max(0, silence - 7) * 2.5);
  const support = clamp(100 - a.p1 * 24);
  const readiness = clamp(a.sponsor - (days <= 90 ? 8 : 0) - (days <= 45 ? 10 : 0));
  const score = round(a.adoption * 0.35 + engagement * 0.2 + a.value * 0.2 + support * 0.1 + readiness * 0.15);
  const tier = score < 58 || (days <= 45 && a.adoption < 50) ? 'critical' : score < 74 ? 'watch' : 'healthy';
  const renewalProbability = clamp((score - 30) / 75, 0.15, 0.98);
  const signals = [];
  if (a.adoption < 65) signals.push('Low platform adoption');
  if (silence > 21) signals.push(`${silence} days without engagement`);
  if (a.value < 60) signals.push('Value realization below target');
  if (a.p1 >= 2) signals.push(`${a.p1} open priority support cases`);
  if (days <= 90) signals.push(`Renewal in ${days} days`);
  if (a.sponsor < 55) signals.push('Executive alignment needs attention');
  if (!signals.length) signals.push('Consistent adoption and stakeholder engagement');
  return { score, tier, days, silence, engagement:round(engagement), support:round(support), readiness:round(readiness), renewalProbability, signals };
}

export function enriched(accounts, today) {
  return accounts.map(a => ({ ...a, health: accountHealth(a, today) }));
}

export function portfolioSummary(accounts, today) {
  const rows = enriched(accounts, today);
  const totalArr = rows.reduce((sum,a) => sum + a.arr, 0);
  const atRiskArr = rows.filter(a => a.health.tier !== 'healthy').reduce((s,a)=>s+a.arr,0);
  const renewal90 = rows.filter(a => a.health.days >= 0 && a.health.days <= 90);
  const due90Arr = renewal90.reduce((s,a)=>s+a.arr,0);
  const expectedRenewals = renewal90.reduce((s,a)=>s+a.arr*a.health.renewalProbability,0);
  const avgHealth = rows.length ? round(rows.reduce((s,a)=>s+a.health.score,0)/rows.length) : 0;
  const avgAdoption = rows.length ? round(rows.reduce((s,a)=>s+a.adoption,0)/rows.length) : 0;
  const counts = { healthy:0, watch:0, critical:0 };
  rows.forEach(a => counts[a.health.tier]++);
  return { rows, count:rows.length, totalArr, atRiskArr, renewal90: renewal90.length, due90Arr, expectedRenewals, avgHealth, avgAdoption, counts };
}

export function prioritizedAccounts(accounts, today) {
  return enriched(accounts, today).sort((a,b) => {
    const t = { critical:0, watch:1, healthy:2 };
    return t[a.health.tier]-t[b.health.tier] || a.health.days-b.health.days || b.arr-a.arr;
  });
}

export function playbookFor(a, today) {
  const h = accountHealth(a, today);
  if (h.tier === 'critical') return { title:'Recovery & retention', type:'recovery', next:'Executive alignment + 30-day adoption recovery', owner:'CSM + Account Executive', priority:'Immediate' };
  if (h.days <= 90) return { title:'Renewal assurance', type:'renewal', next:'Confirm outcomes and renewal decision process', owner:'CSM + Sales', priority:'This week' };
  if (a.adoption < 75) return { title:'Adoption acceleration', type:'adoption', next:'Role-based enablement and usage milestone', owner:'CSM + Enablement', priority:'This month' };
  return { title:'Value expansion', type:'expansion', next:'Quarterly business review and opportunity discovery', owner:'CSM + Sponsor', priority:'Planned' };
}

export function recordActivity(a, kind, today) {
  const edits = {
    touch: { lastTouch:today, sponsor:clamp(a.sponsor + 4) },
    enablement: { adoption:clamp(a.adoption + 8), value:clamp(a.value + 3) },
    qbr: { lastTouch:today, value:clamp(a.value + 8), sponsor:clamp(a.sponsor + 8) },
    escalation: { p1: Math.max(0, a.p1 - 1), lastTouch:today },
  };
  if (!Object.hasOwn(edits, kind)) throw new Error('Unsupported activity');
  return {
    ...a, ...edits[kind],
    activities:[{ type:kind, date:today, id:`EV-${(a.activities?.length ?? 0)+1}` }, ...(a.activities || [])]
  };
}

export function outreachDraft(a, today, lang = a.language) {
  const h = accountHealth(a, today);
  if (lang === 'es') {
    return {
      subject:`Revisión de resultados y próximos pasos | ${a.name}`,
      body:`Hola,\n\nQuisiera coordinar una revisión ejecutiva de los resultados obtenidos con la plataforma y las prioridades de ${a.name} para el próximo trimestre.\n\nMe gustaría que revisáramos la adopción por equipo, los indicadores de valor para el negocio y un plan de acciones concretas. ${h.days <= 90 ? 'También podemos revisar con anticipación los próximos hitos de renovación.' : 'La sesión nos ayudará a priorizar los siguientes avances.'}\n\n¿Tendrías disponibilidad para una reunión de 30 minutos la próxima semana?\n\nSaludos,\nCustomer Success Team`
    };
  }
  return {
    subject:`Business outcomes and next steps | ${a.name}`,
    body:`Hello,\n\nI'd like to schedule a short business review to align on the outcomes your team is seeing with the platform and ${a.name}'s priorities for the next quarter.\n\nWe can review adoption by role, measurable business value, and a focused action plan. ${h.days <= 90 ? 'With your upcoming renewal, we can also align early on the decision milestones.' : 'The goal is to prioritize the most valuable next steps.'}\n\nWould you be available for a 30-minute conversation next week?\n\nBest regards,\nCustomer Success Team`
  };
}

export function executiveMarkdown(accounts, today) {
  const p = portfolioSummary(accounts, today);
  const focus = prioritizedAccounts(accounts, today).filter(a=>a.health.tier!=='healthy').slice(0,7);
  return [
    `# Customer Success | Executive Portfolio Review`,
    `**Snapshot:** ${today}  `,
    `**Data classification:** Synthetic demonstration; no actual customer information`,
    '',
    '## Portfolio summary',
    `- Accounts: **${p.count}**`,
    `- Illustrative annual contract value: **${asMoney(p.totalArr)}**`,
    `- Average customer health: **${p.avgHealth}/100**`,
    `- Average adoption: **${p.avgAdoption}%**`,
    `- Healthy / watch / critical: **${p.counts.healthy} / ${p.counts.watch} / ${p.counts.critical}**`,
    `- ACV in watch or critical tiers: **${asMoney(p.atRiskArr)}** (exposure proxy, not churn forecast)`,
    `- Renewals in next 90 days: **${p.renewal90}** accounts / **${asMoney(p.due90Arr)}** ACV`,
    `- Scenario-weighted renewal value for those 90-day contracts: **${asMoney(p.expectedRenewals)}** (illustrative only)`,
    '', '## Priority accounts',
    '| Account | Health | Renewal | Annual value | Next playbook |',
    '|---|---:|---:|---:|---|',
    ...focus.map(a=>`| ${a.name} | ${a.health.score}/100 (${a.health.tier}) | ${a.health.days} days | ${asMoney(a.arr)} | ${playbookFor(a,today).title} |`),
    '', '## Recommended leadership decisions',
    '1. Approve cross-functional retention plans for critical accounts approaching renewal.',
    '2. Set a two-week cadence for accounts with weak adoption or executive engagement.',
    '3. Review expansion readiness only after customers can substantiate delivered value.',
    '', '## Methodology & limitations',
    'Health score = adoption 35% + engagement 20% + outcome progress 20% + support 10% + sponsor/renewal readiness 15%. Thresholds: critical <58 (or near-term low-adoption override), watch <74, otherwise healthy. Scenario renewal weights are illustrative heuristics, not a trained model. ACV values and companies are fictional. Actions modify browser-local demonstration data only.'
  ].join('\n');
}

export function toCsv(accounts, today) {
  const columns = ['id','name','segment','region','arr','renewal','health_score','tier','adoption_pct','value_pct','executive_sponsor_pct','priority_tickets','last_touch','language'];
  const data = enriched(accounts,today).map(a=>[a.id,a.name,a.segment,a.region,a.arr,a.renewal,a.health.score,a.health.tier,a.adoption,a.value,a.sponsor,a.p1,a.lastTouch,a.language]);
  return [columns, ...data].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
}

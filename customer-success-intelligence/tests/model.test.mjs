import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSeedAccounts } from '../src/data.js';
import { accountHealth, daysUntil, executiveMarkdown, enriched, outreachDraft, playbookFor, portfolioSummary, prioritizedAccounts, recordActivity, toCsv } from '../src/model.js';
const TODAY='2026-10-21';
const accounts=makeSeedAccounts(TODAY);

test('scenario loads exactly 35 unique fictional accounts',()=>{
 assert.equal(accounts.length,35);
 assert.equal(new Set(accounts.map(a=>a.id)).size,35);
 assert.ok(accounts.every(a=>a.arr>0 && a.adoption>=0 && a.adoption<=100));
});
test('date arithmetic handles month and year boundaries in UTC',()=>{
 assert.equal(daysUntil('2027-01-01','2026-12-31'),1);
 assert.equal(daysUntil('2026-10-20',TODAY),-1);
 assert.equal(daysUntil('2026-10-21',TODAY),0);
});
test('the health score and risk tiers are bounded and explainable',()=>{
 const h=enriched(accounts,TODAY);
 assert.ok(h.every(a=>a.health.score>=0 && a.health.score<=100));
 assert.ok(h.every(a=>['healthy','watch','critical'].includes(a.health.tier)));
 assert.ok(h.some(a=>a.health.tier==='critical'));
 assert.ok(h.some(a=>a.health.tier==='healthy'));
 assert.ok(h.every(a=>a.health.renewalProbability>=.15 && a.health.renewalProbability<=.98));
});
test('totals reconcile across health tiers and contract values',()=>{
 const p=portfolioSummary(accounts,TODAY);
 assert.equal(p.counts.healthy+p.counts.watch+p.counts.critical,35);
 assert.equal(p.totalArr,accounts.reduce((s,a)=>s+a.arr,0));
 assert.ok(p.due90Arr<=p.totalArr && p.atRiskArr<=p.totalArr);
 assert.ok(p.expectedRenewals<=p.due90Arr && p.expectedRenewals>=0);
});
test('activities produce auditable, bounded changes to simulated account metrics',()=>{
 const a=accounts[0], before=accountHealth(a,TODAY);
 const updated=recordActivity(a,'qbr',TODAY);
 assert.ok(updated.value>a.value && updated.sponsor>a.sponsor);
 assert.ok(accountHealth(updated,TODAY).score>=before.score);
 assert.equal(updated.activities.length,1);
 assert.equal(a.activities.length,0);
 assert.equal(recordActivity({...a,p1:0},'escalation',TODAY).p1,0);
 assert.throws(()=>recordActivity(a,'fabricate',TODAY),/Unsupported/);
});
test('renewal risk override applies near a renewal with very low adoption',()=>{
 const synthetic={...accounts[0],renewal:'2026-11-03',adoption:31,sponsor:100,value:100,lastTouch:TODAY,p1:0};
 assert.equal(accountHealth(synthetic,TODAY).tier,'critical');
});
test('priorities and playbooks return a valid next action',()=>{
 const sorted=prioritizedAccounts(accounts,TODAY);
 assert.equal(sorted.length,35);
 assert.ok(['recovery','renewal','adoption','expansion'].includes(playbookFor(sorted[0],TODAY).type));
});
test('bilingual outreach remains explicit and fictional',()=>{
 const es=outreachDraft(accounts[1],TODAY,'es');
 const en=outreachDraft(accounts[1],TODAY,'en');
 assert.match(es.body,/revisión ejecutiva/);
 assert.match(en.body,/business review/);
});
test('exports include metadata and every record without customer secrets',()=>{
 const md=executiveMarkdown(accounts,TODAY);
 const csv=toCsv(accounts,TODAY);
 assert.match(md,/Synthetic demonstration/);
 assert.match(md,/35/);
 assert.equal(csv.split('\r\n').length,36);
 assert.match(csv,/ACC-035/);
});

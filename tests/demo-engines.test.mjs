import test from "node:test";
import assert from "node:assert/strict";
import {seedContacts,seedEvents,syncContacts,normalizeContact,seedProgram,AS_OF,analyzeProgram,programMarkdown} from "../assets/engines.mjs";
const copy=records=>structuredClone(records);
test("CRM: normalizes email and canonicalizes timezone",()=>{
 const x=normalizeContact({email:"  ALICE@example.org ",name:" Alice ",updated_at:"2026-10-20T09:00:00-06:00"});
 assert.equal(x.email,"alice@example.org");
 assert.equal(x.updated_at,"2026-10-20T15:00:00Z");
});
test("CRM: baseline creates, updates, ignores stale and replayed events",()=>{
 const result=syncContacts(seedContacts,seedEvents);
 assert.equal(result.contacts.length,4);
 assert.equal(result.totals.created,1);
 assert.equal(result.totals.updated,1);
 assert.equal(result.totals.unchanged,1);
 assert.equal(result.totals.stale_ignored,1);
});
test("CRM: repeated batch is idempotent and never duplicates",()=>{
 const first=syncContacts(seedContacts,seedEvents);
 const again=syncContacts(first.contacts,seedEvents);
 assert.equal(again.contacts.length,4);
 assert.equal(again.totals.created+again.totals.updated,0);
 assert.equal(again.totals.unchanged,3);
});
test("CRM: equal timestamp conflicting field requires review",()=>{
 const first=syncContacts(seedContacts,seedEvents);
 const current=first.contacts.find(x=>x.email==="bea.gomez@example.org");
 const attempt=syncContacts(first.contacts,[{...current,name:"Different name"}]);
 assert.equal(attempt.totals.timestamp_conflict,1);
 assert.equal(attempt.contacts.find(x=>x.email===current.email).name,current.name);
});
test("CRM: invalid address, missing timezone and missing name rejected",()=>{
 const a=syncContacts(seedContacts,[
  {email:"invalid",name:"X",updated_at:"2026-10-20T12:00:00Z"},
  {email:"x@example.org",name:"X",updated_at:"2026-10-20T12:00:00"},
  {email:"y@example.org",name:" ",updated_at:"2026-10-20T12:00:00Z"}
 ]);
 assert.equal(a.totals.rejected,3);
 assert.equal(a.contacts.length,seedContacts.length);
});
test("TPM: baseline identifies blocked, overdue and high risk",()=>{
 const state=analyzeProgram(seedProgram);
 assert.equal(state.completed,2);
 assert.equal(state.total,5);
 assert.equal(state.progress,40);
 assert.equal(state.blocked,2);
 assert.equal(state.overdue,1);
 assert.equal(state.highRisk,1);
 assert.equal(state.health,"At risk");
});
test("TPM: clearing AI evaluation unblocks frontend",()=>{
 const rows=copy(seedProgram);
 rows.find(t=>t.id==="ML-103").status="completed";
 const state=analyzeProgram(rows);
 assert.equal(state.blocked,1);
 assert.equal(state.overdue,0);
 assert.equal(state.completed,3);
});
test("TPM: completed program is launch ready",()=>{
 const state=analyzeProgram(seedProgram.map(t=>({...t,status:"completed"})));
 assert.equal(state.progress,100);
 assert.equal(state.ready,true);
 assert.equal(state.health,"On track");
});
test("TPM: missing and cyclic dependencies are rejected",()=>{
 assert.throws(()=>analyzeProgram([{id:"a",status:"planned",due:AS_OF,depends:["missing"]}]),/Unknown dependency/);
 assert.throws(()=>analyzeProgram([{id:"a",status:"planned",due:AS_OF,depends:["b"]},{id:"b",status:"planned",due:AS_OF,depends:["a"]}]),/Circular dependency/);
});
test("TPM: generated report includes owners and risks",()=>{
 const report=programMarkdown(analyzeProgram(seedProgram));
 assert.match(report,/Morgan Blake/);
 assert.match(report,/ML-103/);
 assert.match(report,/Recommended next actions/);
 assert.match(report,/Synthetic demonstration/);
});

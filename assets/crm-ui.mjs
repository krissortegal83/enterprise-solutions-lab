import {seedContacts,seedEvents,syncContacts} from "./engines.mjs";
const el=id=>document.getElementById(id);
const clone=records=>records.map(record=>({...record}));
let contacts=clone(seedContacts),history=[],lastBatch=clone(seedEvents),batchNumber=0;
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const actionLabel={created:"Created",updated:"Updated",unchanged:"Idempotent",stale_ignored:"Stale ignored",timestamp_conflict:"Needs review",rejected:"Validation error"};
function render(){
 const query=el("search").value.trim().toLowerCase();
 const filtered=contacts.filter(c=>(c.email+" "+c.name+" "+c.company).toLowerCase().includes(query));
 el("contact-rows").innerHTML=filtered.length?filtered.map(c=>"<tr><td><strong>"+escapeHtml(c.name)+"</strong><br><span class='subtext mono'>"+escapeHtml(c.email)+"</span></td><td>"+escapeHtml(c.company)+"</td><td class='mono'>"+escapeHtml(c.updated_at.slice(0,10))+"</td></tr>").join(""):"<tr><td colspan='3' class='empty'>No contacts match this search.</td></tr>";
 el("contacts-count").textContent=String(contacts.length);
 el("events-count").textContent=String(history.length);
 el("writes-count").textContent=String(history.filter(x=>["created","updated"].includes(x.action)).length);
 el("risk-count").textContent=String(history.filter(x=>["timestamp_conflict","rejected"].includes(x.action)).length);
 const show=history.slice(-9).reverse();
 el("audit-stream").innerHTML=show.length?show.map(e=>{
  const variant=["timestamp_conflict","rejected"].includes(e.action)?"danger":["stale_ignored"].includes(e.action)?"warning":"";
  return "<div class='activityrow'><div><strong>"+escapeHtml(e.email)+"</strong><br><small>"+escapeHtml(e.reason||e.batch)+"</small></div><span class='badgecode "+variant+"'>"+escapeHtml(actionLabel[e.action]||e.action)+"</span></div>";
 }).join(""):"<div class='empty'>No events yet. Run a scenario to inspect the audit trail.</div>";
}
function run(events,description){
 const result=syncContacts(contacts,events);
 contacts=result.contacts;
 batchNumber+=1;
 const batchTag="Batch "+batchNumber;
 history.push(...result.audit.map(entry=>({...entry,batch:batchTag})));
 lastBatch=clone(events);
 const accepted=result.totals.created+result.totals.updated;
 el("batch-status").textContent=batchTag+" · "+events.length+" events";
 el("scenario-description").textContent=description+" Result: "+accepted+" accepted change(s), "+result.totals.unchanged+" idempotent replay(s), "+result.totals.stale_ignored+" stale update(s), "+(result.totals.timestamp_conflict+result.totals.rejected)+" issue(s) flagged.";
 render();
}
el("run-default").addEventListener("click",()=>run(clone(seedEvents),"Baseline batch processed."));
el("replay").addEventListener("click",()=>run(clone(lastBatch),"Same event batch replayed. Observe idempotency and timestamp checks."));
el("conflict").addEventListener("click",()=>{
 const target=contacts.find(contact=>contact.email==="bea.gomez@example.org")??contacts[0];
 run([{...target,name:target.name+" (alternate)"}],"Equal timestamp with different content; queued for review.");
});
el("invalid").addEventListener("click",()=>run([{email:"broken-address",name:"Invalid Contact",updated_at:"2026-10-20T12:00:00Z"}],"Malformed email rejected by input validation."));
el("reset").addEventListener("click",()=>{
 contacts=clone(seedContacts);history=[];batchNumber=0;lastBatch=clone(seedEvents);
 el("batch-status").textContent="Waiting for first batch";
 el("scenario-description").textContent="Start with four simulated CRM events: one repeat, one update, one new contact and one stale record.";
 el("search").value="";render();
});
el("search").addEventListener("input",render);
el("export").addEventListener("click",()=>{
 const payload={demo:"CRM Integration Console",generated_at:"2026-10-20",synthetic:true,batches:batchNumber,contacts,events:history};
 const file=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const anchor=document.createElement("a");const url=URL.createObjectURL(file);
 anchor.href=url;anchor.download="crm-demo-audit.json";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();

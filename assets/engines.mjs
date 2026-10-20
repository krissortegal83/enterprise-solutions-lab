/** Browser and Node compatible business logic. All fixtures are fictional. */
export const seedContacts = [
 {email:"alex.rivera@example.org",name:"Alex Rivera",company:"Northstar Health",updated_at:"2026-10-01T10:00:00Z"},
 {email:"bea.gomez@example.org",name:"Bea Gomez",company:"Atlas Systems",updated_at:"2026-10-15T09:00:00Z"},
 {email:"sam.chen@example.org",name:"Sam Chen",company:"Harbor Digital",updated_at:"2026-10-10T08:00:00Z"}
];
export const seedEvents = [
 {email:" ALEX.RIVERA@example.org ",name:"Alex Rivera",company:"Northstar Health",updated_at:"2026-10-01T10:00:00Z"},
 {email:"bea.gomez@example.org",name:"Beatriz Gomez",company:"Atlas Systems",updated_at:"2026-10-18T13:00:00Z"},
 {email:"nia.patel@example.org",name:"Nia Patel",company:"Bluepeak Labs",updated_at:"2026-10-19T08:00:00Z"},
 {email:"sam.chen@example.org",name:"Samuel Chen",company:"Harbor Digital",updated_at:"2026-09-30T08:00:00Z"}
];
export function normalizeContact(raw) {
 if (!raw || typeof raw !== "object") throw new Error("Contact must be an object.");
 const email=String(raw.email??"").trim().toLowerCase();
 const name=String(raw.name??"").trim(), company=String(raw.company??"").trim();
 const stamp=String(raw.updated_at??"");
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))throw new Error("Invalid email.");
 if(!name)throw new Error("Contact name is required.");
 if(!/([zZ]|[+-]\d{2}:\d{2})$/.test(stamp))throw new Error("Timezone required.");
 const milliseconds=Date.parse(stamp);
 if(!Number.isFinite(milliseconds))throw new Error("Invalid timestamp.");
 return {email,name,company,updated_at:new Date(milliseconds).toISOString().replace(".000Z","Z")};
}
export function syncContacts(existing,incoming){
 const map=new Map(),audit=[];
 for(const raw of existing){
  const c=normalizeContact(raw),old=map.get(c.email);
  if(!old||Date.parse(c.updated_at)>Date.parse(old.updated_at))map.set(c.email,c);
 }
 for(const raw of incoming){
  try{
   const c=normalizeContact(raw),old=map.get(c.email);
   let action;
   if(!old){map.set(c.email,c);action="created";}
   else{
    const a=Date.parse(c.updated_at),b=Date.parse(old.updated_at);
    if(a>b){map.set(c.email,c);action="updated";}
    else if(a<b)action="stale_ignored";
    else if(JSON.stringify(c)===JSON.stringify(old))action="unchanged";
    else action="timestamp_conflict";
   }
   audit.push({email:c.email,action,source:"Synthetic CRM event",at:c.updated_at});
  }catch(error){audit.push({email:String(raw?.email??"unknown"),action:"rejected",reason:error.message,source:"Synthetic CRM event"});}
 }
 const actions=["created","updated","unchanged","stale_ignored","timestamp_conflict","rejected"];
 const totals=Object.fromEntries(actions.map(action=>[action,audit.filter(entry=>entry.action===action).length]));
 return {contacts:[...map.values()].sort((a,b)=>a.email.localeCompare(b.email)),audit,totals};
}
export const seedProgram=[
 {id:"API-101",title:"API contract approved",team:"Backend",owner:"Jordan Lee",status:"completed",due:"2026-10-05",risk:1,depends:[]},
 {id:"DATA-102",title:"Synthetic dataset validated",team:"Data",owner:"Taylor Kim",status:"completed",due:"2026-10-09",risk:1,depends:[]},
 {id:"ML-103",title:"Model evaluation baseline",team:"AI / ML",owner:"Morgan Blake",status:"in_progress",due:"2026-10-17",risk:4,depends:["DATA-102"]},
 {id:"FE-104",title:"Frontend feature integration",team:"Frontend",owner:"Avery Quinn",status:"planned",due:"2026-10-23",risk:3,depends:["API-101","ML-103"]},
 {id:"QA-105",title:"Launch readiness review",team:"QA / Product",owner:"Casey Reed",status:"planned",due:"2026-10-28",risk:2,depends:["FE-104"]}
];
export const AS_OF="2026-10-20";
export function analyzeProgram(tasks,asOf=AS_OF){
 const ids=new Map();
 for(const t of tasks){
  if(!t.id||ids.has(t.id))throw new Error("Task IDs must be unique and nonempty.");
  if(!["planned","in_progress","completed"].includes(t.status))throw new Error("Invalid status: "+t.id);
  if(!/^\d{4}-\d\d-\d\d$/.test(t.due)||Number.isNaN(Date.parse(t.due+"T00:00:00Z")))throw new Error("Invalid deadline: "+t.id);
  ids.set(t.id,t);
 }
 const seen=new Set(),active=new Set();
 function visit(id){
  if(active.has(id))throw new Error("Circular dependency: "+id);
  if(seen.has(id))return;
  active.add(id);
  for(const dep of ids.get(id).depends??[]){if(!ids.has(dep))throw new Error("Unknown dependency: "+dep);visit(dep);}
  active.delete(id);seen.add(id);
 }
 for(const id of ids.keys())visit(id);
 const findings=tasks.map(t=>{
  const flags=[];
  if(t.status!=="completed"){
   if(t.due<asOf)flags.push("overdue");
   if((t.depends??[]).some(dep=>ids.get(dep).status!=="completed"))flags.push("blocked");
   if(Number(t.risk)>=4)flags.push("high_risk");
  }
  return {...t,flags,attention:flags.length>0};
 });
 const completed=findings.filter(t=>t.status==="completed").length;
 const blocked=findings.filter(t=>t.flags.includes("blocked")).length;
 const overdue=findings.filter(t=>t.flags.includes("overdue")).length;
 const highRisk=findings.filter(t=>t.flags.includes("high_risk")).length;
 const atRisk=findings.filter(t=>t.attention).length;
 return {findings,completed,blocked,overdue,highRisk,atRisk,total:findings.length,
  progress:findings.length?Math.round(100*completed/findings.length):100,
  health:atRisk?"At risk":"On track",ready:findings.length>0&&completed===findings.length};
}
export function programMarkdown(analysis,asOf=AS_OF){
 const lines=[
  "# Delivery Readiness — Executive Update","",
  "**Snapshot:** "+asOf,"**Overall status:** "+analysis.health,
  "**Milestones completed:** "+analysis.completed+"/"+analysis.total,
  "**Launch ready:** "+(analysis.ready?"Yes":"No"),"",
  "| ID | Workstream | Owner | Milestone | Status | Due | Risks |",
  "|---|---|---|---|---|---|---|"
 ];
 for(const t of analysis.findings)lines.push("| "+[t.id,t.team,t.owner,t.title,t.status,t.due,t.flags.join(", ")||"None"].join(" | ")+" |");
 lines.push("","## Recommended next actions","");
 const actions=analysis.findings.filter(t=>t.attention).map(t=>"- **"+t.id+" ("+t.owner+"):** Confirm mitigation and timing for "+t.flags.join(", ")+".");
 lines.push(...(actions.length?actions:["- Continue milestone monitoring and stakeholder updates."]));
 lines.push("","_Synthetic demonstration only. No live project data._");
 return lines.join("\n")+"\n";
}

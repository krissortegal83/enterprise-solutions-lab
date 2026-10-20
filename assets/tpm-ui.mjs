import {seedProgram,AS_OF,analyzeProgram,programMarkdown} from "./engines.mjs";
const el=id=>document.getElementById(id);
const clone=records=>records.map(t=>({...t,depends:[...t.depends]}));
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
let tasks=clone(seedProgram);
function render(){
 const a=analyzeProgram(tasks);
 el("progress-count").textContent=a.progress+"%";
 el("progress-bar").style.width=a.progress+"%";
 el("blocked-count").textContent=a.blocked;
 el("overdue-count").textContent=a.overdue;
 el("risk-count").textContent=a.highRisk;
 el("health-value").textContent=a.health.toUpperCase();
 el("health-panel").className="health "+(a.atRisk?"warning":"");
 el("health-description").textContent=a.atRisk?a.atRisk+" milestone(s) need mitigation, including "+a.blocked+" dependency blocker(s).":"All recorded delivery controls are clear for the current scenario.";
 el("readiness").className="pill "+(a.ready?"":"warning");
 el("readiness").textContent=a.ready?"LAUNCH READY":"NOT LAUNCH READY";
 const filter=el("filter").value;
 const visible=a.findings.filter(t=>filter==="all"||(filter==="attention"&&t.attention)||(filter==="open"&&t.status!=="completed")||(filter==="completed"&&t.status==="completed"));
 el("tasks").innerHTML=visible.length?visible.map(t=>{
  const attention=t.flags.length?"<span class='badgecode warning'>"+esc(t.flags.join(" · "))+"</span>":"<span class='badgecode'>clear</span>";
  const stat=["planned","in_progress","completed"].map(s=>"<option value='"+s+"'"+(s===t.status?" selected":"")+">"+s.replace("_"," ")+"</option>").join("");
  const levels=[1,2,3,4,5].map(n=>"<option value='"+n+"'"+(n===Number(t.risk)?" selected":"")+">"+n+"/5</option>").join("");
  return "<tr><td><strong class='mono'>"+esc(t.id)+"</strong><br>"+esc(t.title)+"</td><td>"+esc(t.team)+"<br><span class='subtext'>"+esc(t.owner)+"</span></td><td class='mono'>"+esc(t.due.slice(5))+"</td><td><select class='input' style='min-width:120px;padding:7px 9px' aria-label='Status for "+esc(t.id)+"' data-kind='status' data-id='"+esc(t.id)+"'>"+stat+"</select></td><td><select class='input' style='min-width:85px;padding:7px 9px' aria-label='Risk for "+esc(t.id)+"' data-kind='risk' data-id='"+esc(t.id)+"'>"+levels+"</select></td><td>"+attention+"<br><span class='subtext mono'>"+esc((t.depends||[]).join(", ")||"No upstream dependencies")+"</span></td></tr>";
 }).join(""):"<tr><td colspan='6' class='empty'>No milestones match the current filter.</td></tr>";
 el("workstreams").innerHTML=a.findings.map(t=>{
  const done=t.status==="completed",status=done?"Complete":t.attention?"Needs attention":"On track";
  const level=done?100:t.status==="in_progress"?55:15;
  const css=done?"":t.attention?"warning":"blue";
  return "<div class='workstream'><h3>"+esc(t.team)+" <span class='pill "+css+"'>"+status+"</span></h3><div class='metricline'><span class='subtext'>"+esc(t.id)+" · "+esc(t.owner)+"</span><strong>"+level+"%</strong></div><div class='bar'><i style='width:"+level+"%'></i></div></div>";
 }).join("");
 const risky=a.findings.filter(t=>t.attention);
 el("actions").innerHTML=risky.length?risky.map(t=>{
  const msg=t.flags.map(flag=>flag==="blocked"?"unblock upstream handoff":flag==="overdue"?"reconfirm milestone ETA":"agree on risk mitigation").join(" / ");
  return "<div class='activityrow'><div><strong>"+esc(t.id)+" · "+esc(t.owner)+"</strong><br><small>"+esc(msg)+"</small></div><span class='badgecode warning'>ACTION</span></div>";
 }).join(""):"<div class='activityrow'><div><strong>Stakeholder update ready</strong><br><small>No open blockers; confirm sign-off and communicate next steps.</small></div><span class='badgecode'>CLEAR</span></div>";
}
function modify(id,changes){tasks=tasks.map(t=>t.id===id?{...t,...changes}:t);render();}
el("tasks").addEventListener("change",event=>{
 const target=event.target;
 if(!(target instanceof HTMLSelectElement))return;
 const id=target.dataset.id;
 if(!id)return;
 if(target.dataset.kind==="status")modify(id,{status:target.value});
 if(target.dataset.kind==="risk")modify(id,{risk:Number(target.value)});
 el("scenario-summary").textContent="Manual change saved to local simulation. Review the updated blockers and executive signal.";
});
el("filter").addEventListener("change",render);
el("resolve").addEventListener("click",()=>{
 modify("ML-103",{status:"completed",risk:1});
 el("scenario-summary").textContent="AI/ML evaluation complete. Frontend integration is now unblocked; QA remains dependent on frontend completion.";
});
el("delay").addEventListener("click",()=>{
 modify("API-101",{status:"in_progress",due:"2026-10-12",risk:5});
 el("scenario-summary").textContent="API contract reopened and marked overdue. Delivery health now reflects the additional upstream blocker.";
});
el("complete").addEventListener("click",()=>{
 tasks=tasks.map(t=>({...t,status:"completed",risk:1}));render();
 el("scenario-summary").textContent="All five milestones marked complete in the scenario. This models an idealized launch-ready state.";
});
el("reset").addEventListener("click",()=>{
 tasks=clone(seedProgram);el("filter").value="all";render();
 el("scenario-summary").textContent="Baseline restored: model evaluation overdue; frontend depends on unfinished ML work.";
});
el("download").addEventListener("click",()=>{
 const file=new Blob([programMarkdown(analyzeProgram(tasks),AS_OF)],{type:"text/markdown;charset=utf-8"});
 const anchor=document.createElement("a"),url=URL.createObjectURL(file);
 anchor.href=url;anchor.download="executive-program-status.md";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();

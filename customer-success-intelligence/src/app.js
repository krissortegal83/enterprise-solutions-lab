import { makeSeedAccounts, todayLocal } from './data.js';
import { accountHealth, asCompact, asMoney, daysUntil, enriched, executiveMarkdown, outreachDraft, playbookFor, portfolioSummary, prioritizedAccounts, recordActivity, toCsv } from './model.js';

const $ = selector => document.querySelector(selector);
const TODAY = todayLocal();
const KEY = 'fieldwork-cs-portfolio-v1';
const ICONS = {
  layout:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  document:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6m-6 4h6"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  search:'<circle cx="10.5" cy="10.5" r="6"/><path d="m15.5 15.5 5 5"/>',
  trend:'<path d="m3 17 7-7 4 4 7-8m-6 0h6v6"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  dollar:'<path d="M12 2v20m5-16H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  close:'<path d="M5 5 19 19M19 5 5 19"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  command:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8m-4-4v8"/>',
  alert:'<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3h.01"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.1"/>',
};
const svg = name => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.info}</svg>`;
const safe = str => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusName = tier => ({healthy:'Healthy',watch:'Watch',critical:'At risk'}[tier]);
const status = tier => `<span class="status ${tier}">${statusName(tier)}</span>`;
const prettyDate = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
const classScore = tier => `<span class="score-tick ${tier}"><i></i></span>`;
const activityNames = {touch:'Stakeholder check-in',enablement:'Enablement milestone',qbr:'Business review',escalation:'Priority issue follow-up'};
const playbooks = [
  {key:'recovery',number:'01',title:'Recovery & retention',blurb:'Stabilize high-risk customers through executive alignment, targeted enablement and explicit commitments.',icon:'shield',steps:['Confirm the decision maker and business impact','Agree a 30-day adoption recovery milestone','Document owners, blockers and a weekly review cadence']},
  {key:'renewal',number:'02',title:'Renewal assurance',blurb:'Move renewal discussions earlier by connecting realized value to the next business decision.',icon:'calendar',steps:['Document delivered outcomes with evidence','Map the economic buyer and procurement milestones','Identify blockers 90 days before renewal']},
  {key:'adoption',number:'03',title:'Adoption acceleration',blurb:'Close gaps in product engagement with persona-based training and measurable success criteria.',icon:'trend',steps:['Segment low-usage personas and workflows','Run practical enablement with a named champion','Review active usage against the 30-day target']},
  {key:'expansion',number:'04',title:'Value expansion',blurb:'Build on healthy relationships with executive business reviews and credible growth opportunities.',icon:'target',steps:['Validate realized operational outcomes','Identify adjacent teams and workflows','Connect opportunities to a business case, not vanity metrics']}
];

function loadAccounts(){
  try{
    const value=JSON.parse(localStorage.getItem(KEY));
    if(value?.version===1 && Array.isArray(value.accounts) && value.accounts.length===35 && value.accounts.every(a=>a.id && a.name && a.renewal)) return value.accounts;
  }catch{}
  return makeSeedAccounts(TODAY);
}
let accounts=loadAccounts();
let state={ view:'overview', search:'', tier:'all', segment:'all', sort:'risk', active:null, language:null, mobile:false, resetConfirm:false };
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:1,accounts}));}catch{toast('Storage not available. This session will remain usable.')}}
function getAccount(id){return accounts.find(a=>a.id===id)}
function rowActions(a){return playbookFor(a,TODAY)}
function navigate(view){state.view=view;state.search='';state.tier='all';state.segment='all';state.sort='risk';state.mobile=false;render();window.scrollTo({top:0,behavior:'auto'})}
function changeAccount(a){accounts=accounts.map(x=>x.id===a.id?a:x);persist();render()}
let toastTimer;
function toast(message){const root=$('#toast-root');root.innerHTML=`<div class="toast">${safe(message)}</div>`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>root.innerHTML='',3300)}
function download(filename,text,mime='text/plain;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([text],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
  toast(`${filename} exported`);
}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard')}catch{toast('Clipboard unavailable; use export instead')}}
function toolbar(title){return `<div class="page-head"><div><div class="eyebrow">CUSTOMER EXPERIENCE / PORTFOLIO OPERATIONS</div><h1>${title}</h1><p>Decision-ready customer intelligence across a fictional North American B2B portfolio.</p></div><div class="head-actions"><button class="button" data-action="export-csv">${svg('download')} Export data</button><button class="button primary" data-action="export-brief">${svg('document')} Executive brief</button></div></div>`}
function metric(label,value,note,icon,noteDanger=false){return `<div class="metric-card"><div class="metric-top"><span class="metric-label">${label}</span><div class="metric-icon">${svg(icon)}</div></div><div class="metric-value">${value}</div><div class="metric-note ${noteDanger?'danger':''}">${note}</div></div>`}
function healthPanel(p){
  const total=p.count||1;
  const segments=[...new Set(accounts.map(a=>a.segment))].sort().map(segment=>{
    const group=p.rows.filter(a=>a.segment===segment);const avg= Math.round(group.reduce((s,a)=>s+a.health.score,0)/group.length);
    return `<div class="segment-row"><label>${safe(segment)}</label><div class="bar"><span style="width:${avg}%"></span></div><strong>${avg}/100</strong></div>`;
  }).join('');
  return `<section class="panel"><div class="panel-head"><div><h2>Portfolio health</h2><p class="panel-sub">Composite signals across the full account base</p></div><span class="pill">${p.avgHealth}/100 average</span></div><div class="panel-body"><div class="health-track" role="img" aria-label="${p.counts.healthy} healthy, ${p.counts.watch} watch, ${p.counts.critical} at risk"><span class="healthy" style="width:${100*p.counts.healthy/total}%"></span><span class="watch" style="width:${100*p.counts.watch/total}%"></span><span class="critical" style="width:${100*p.counts.critical/total}%"></span></div><div class="legend"><span class="legend-item"><i class="swatch"></i><b>${p.counts.healthy}</b> Healthy</span><span class="legend-item"><i class="swatch watch"></i><b>${p.counts.watch}</b> Watch</span><span class="legend-item"><i class="swatch critical"></i><b>${p.counts.critical}</b> At risk</span></div><div class="rule"></div><div class="section-minor">AVERAGE HEALTH BY INDUSTRY</div>${segments}</div></section>`;
}
function queuePanel(){
  const items=prioritizedAccounts(accounts,TODAY).slice(0,5).map((a,i)=>{
    const signal=a.health.signals.find(s=>s!=='Consistent adoption and stakeholder engagement')||'Scheduled value review';
    return `<div class="queue-item"><span class="queue-rank">${String(i+1).padStart(2,'0')}</span><div class="queue-main"><strong>${safe(a.name)}</strong><small><span>${safe(signal)}</span> · ${a.health.days}d to renewal</small></div><button class="queue-arrow" aria-label="Open ${safe(a.name)}" data-action="open" data-id="${a.id}">${svg('arrow')}</button></div>`;
  }).join('');
  return `<section class="panel"><div class="panel-head"><div><h2>Priority action queue</h2><p class="panel-sub">Sorted by risk, renewal proximity and contract value</p></div><button class="text-link" data-action="view-accounts">View all ${svg('arrow')}</button></div><div class="queue-list">${items}</div></section>`;
}
function tableRows(rows){
 return rows.map(a=>`<tr data-action="open" data-id="${a.id}" aria-label="Open ${safe(a.name)} account" tabindex="0"><td class="name-cell"><strong>${safe(a.name)}</strong><small>${safe(a.id)} · ${safe(a.region)}</small></td><td>${safe(a.segment)}</td><td><span class="score">${a.health.score} <span class="score-tick ${a.health.tier}"><i style="width:${a.health.score}%"></i></span></span></td><td>${status(a.health.tier)}</td><td>${a.adoption}%</td><td class="nowrap">${a.health.days} days</td><td class="nowrap">${asMoney(a.arr)}</td><td class="align-right">${svg('arrow')}</td></tr>`).join('');
}
function table(cols){return `<div class="table-wrap"><table class="accounts-table"><thead><tr><th>Customer account</th><th>Industry</th><th>Health</th><th>Status</th><th>Adoption</th><th>Renewal</th><th>Annual value</th><th></th></tr></thead><tbody id="account-table-body">${tableRows(cols)}</tbody></table></div>`}
function overview(){
  const p=portfolioSummary(accounts,TODAY);
  return `${toolbar('The full picture. Clear next steps.')}<div class="metric-grid">${metric('Annual contract value',asCompact(p.totalArr),'<b>35 illustrative contracts</b> · USD','dollar')}${metric('Average customer health',`${p.avgHealth}<span style="font-size:17px;color:#98a8ad">/100</span>`,`<b>${p.counts.healthy} healthy</b> accounts`,`activity`)}${metric('Risk exposure',asCompact(p.atRiskArr),'<b>Watch + at-risk ACV</b> · not a churn forecast','shield',true)}${metric('Renewals within 90 days',String(p.renewal90),`<b>${asCompact(p.due90Arr)}</b> annual value`,`calendar`)}</div><div class="grid-2">${healthPanel(p)}${queuePanel()}</div><section class="panel"><div class="panel-head"><div><h2>Customer portfolio</h2><p class="panel-sub">A prioritized view of the accounts that need attention</p></div><button class="text-link" data-action="view-accounts">Explore portfolio ${svg('arrow')}</button></div>${table(prioritizedAccounts(accounts,TODAY).slice(0,7))}<div class="panel-foot"><span>Showing 7 of ${p.count} synthetic accounts</span><span>Health updates after recorded activities</span></div></section>`;
}
function listAccounts(){
 const all=filterAccounts();
 const choices=[...new Set(accounts.map(a=>a.segment))].sort();
 return `${toolbar('Customer portfolio')}<section class="panel"><div class="filters"><label class="searchbox">${svg('search')}<input id="account-search" type="search" value="${safe(state.search)}" placeholder="Search accounts, region or ID" aria-label="Search customer accounts"></label><select id="tier-filter" class="select" aria-label="Filter by status"><option value="all" ${state.tier==='all'?'selected':''}>All health tiers</option><option value="healthy" ${state.tier==='healthy'?'selected':''}>Healthy</option><option value="watch" ${state.tier==='watch'?'selected':''}>Watch</option><option value="critical" ${state.tier==='critical'?'selected':''}>At risk</option></select><select id="segment-filter" class="select" aria-label="Filter by industry"><option value="all">All industries</option>${choices.map(s=>`<option value="${safe(s)}" ${state.segment===s?'selected':''}>${safe(s)}</option>`).join('')}</select><select id="sort-select" class="select" aria-label="Sort accounts"><option value="risk" ${state.sort==='risk'?'selected':''}>Risk priority</option><option value="renewal" ${state.sort==='renewal'?'selected':''}>Renewal: soonest</option><option value="health" ${state.sort==='health'?'selected':''}>Health: lowest</option><option value="arr" ${state.sort==='arr'?'selected':''}>Annual value: highest</option></select></div><div id="table-region">${table(all)}</div><div class="panel-foot"><span id="result-count">${all.length} of ${accounts.length} accounts</span><span>Click an account to review health and run a playbook</span></div></section>`;
}
function filterAccounts(){
 let rows=enriched(accounts,TODAY).filter(a=>(state.tier==='all'||a.health.tier===state.tier)&&(state.segment==='all'||a.segment===state.segment));
 const q=state.search.trim().toLowerCase();if(q)rows=rows.filter(a=>`${a.name} ${a.region} ${a.id} ${a.segment}`.toLowerCase().includes(q));
 if(state.sort==='risk')return rows.sort((a,b)=>({critical:0,watch:1,healthy:2}[a.health.tier]-{critical:0,watch:1,healthy:2}[b.health.tier]) || a.health.days-b.health.days || b.arr-a.arr);
 if(state.sort==='renewal')return rows.sort((a,b)=>a.health.days-b.health.days);
 if(state.sort==='health')return rows.sort((a,b)=>a.health.score-b.health.score);
 return rows.sort((a,b)=>b.arr-a.arr);
}
function refreshTable(){
 const region=$('#table-region');if(!region)return;const rows=filterAccounts();
 region.innerHTML=rows.length?table(rows):'<div class="empty-state"><strong>No matching accounts</strong><p>Try a different industry, health tier, or account name.</p><button class="button small" data-action="clear-filters">Clear filters</button></div>';
 $('#result-count').textContent=`${rows.length} of ${accounts.length} accounts`;
}
function playbooksView(){
 const counts=Object.fromEntries(playbooks.map(p=>[p.key,0]));
 enriched(accounts,TODAY).forEach(a=>counts[playbookFor(a,TODAY).type]++);
 return `${toolbar('Success playbooks')}<div class="playbook-grid">${playbooks.map(p=>`<article class="panel playbook-card"><div class="between"><span class="playbook-num">PLAYBOOK ${p.number}</span><div class="playbook-glyph">${svg(p.icon)}</div></div><h2>${p.title}</h2><p>${p.blurb}</p><div class="section-minor">STANDARD MOTION</div><div class="method-text" style="border-top:0;padding:8px 0 0">${p.steps.map((s,i)=>`<div style="padding:5px 0"><b style="color:#679588;margin-right:7px">0${i+1}</b>${s}</div>`).join('')}</div><div class="playbook-bottom"><div><strong>${counts[p.key]}</strong><small>accounts in this motion</small></div><button class="button small" data-action="playbook-accounts" data-playbook="${p.key}">Review accounts ${svg('arrow')}</button></div></article>`).join('')}</div><div class="panel principle"><div><strong style="font-size:13px">Operating principle: prove value before pursuing expansion.</strong><p>Playbooks are determined by transparent account signals, not a black-box prediction. Each action is logged locally and recalculates the account score.</p></div><button class="button" data-nav="brief">See score methodology ${svg('arrow')}</button></div>`;
}
function briefView(){
 const p=portfolioSummary(accounts,TODAY);
 const top=prioritizedAccounts(accounts,TODAY).filter(a=>a.health.tier!=='healthy').slice(0,7);
 return `${toolbar('Executive portfolio brief')}<div class="brief-grid"><article class="panel report"><div class="eyebrow">CUSTOMER EXPERIENCE / BOARD-READY VIEW</div><h2>Retention and adoption outlook</h2><p class="report-lede">North American B2B portfolio · As of ${prettyDate(TODAY)} · All figures are simulated</p><div class="report-kpis"><div class="report-kpi"><strong>${asCompact(p.totalArr)}</strong><span>Illustrative contract value</span></div><div class="report-kpi"><strong>${p.avgAdoption}%</strong><span>Average product adoption</span></div><div class="report-kpi"><strong>${p.renewal90}</strong><span>Renewals due within 90 days</span></div></div><h3>Management summary</h3><p style="font-size:12px;color:#60737c">${p.counts.critical} customers require targeted recovery; ${p.counts.watch} merit proactive monitoring. ${asCompact(p.atRiskArr)} of portfolio ACV is assigned to these two health segments as an exposure proxy, not predicted lost revenue. Near-term renewals total ${asCompact(p.due90Arr)} in annual contract value.</p><h3>Highest-priority accounts</h3><div class="table-wrap"><table><thead><tr><th>Account</th><th>Health</th><th>Days left</th><th>Motion</th></tr></thead><tbody>${top.map(a=>`<tr><td>${safe(a.name)}</td><td>${a.health.score} · ${statusName(a.health.tier)}</td><td>${a.health.days}</td><td>${rowActions(a).title}</td></tr>`).join('')}</tbody></table></div><h3>Recommended decisions</h3><ol class="report-actions"><li>Sponsor immediate executive-level plans for critical accounts approaching renewal.</li><li>Use role-specific enablement and a two-week engagement cadence to address usage gaps.</li><li>Validate customer outcomes before introducing cross-sell or expansion conversations.</li></ol><div class="report-note">This report is an illustrative portfolio exercise. Renewal probabilities, annual contract values and health thresholds are not derived from actual customer systems or trained models.</div></article><aside class="panel report-side"><div class="eyebrow">ACTIONABLE OUTPUT</div><h3>Take this to your review</h3><p>Export a formatted Markdown summary for a leadership meeting or a CSV snapshot for further analysis.</p><button class="button primary block" data-action="export-brief">${svg('download')} Download executive report</button><button class="button block" data-action="copy-brief">${svg('copy')} Copy report as Markdown</button><button class="button block" data-action="export-csv">${svg('download')} Download account data</button><div class="methods-title">COMPOSITE HEALTH MODEL</div>${[{label:'Product adoption',pct:35},{label:'Customer engagement',pct:20},{label:'Value realization',pct:20},{label:'Support health',pct:10},{label:'Sponsor / renewal readiness',pct:15}].map(x=>`<div class="progress-row"><div class="between"><span>${x.label}</span><strong>${x.pct}%</strong></div><div class="bar"><span style="width:${x.pct*2.85}%"></span></div></div>`).join('')}<div class="method-text"><strong>Thresholds:</strong> At risk below 58, watch from 58 to 73, healthy 74+. Near-term renewals with very low adoption are escalated regardless of composite score.<br><br><strong>Important:</strong> Scores guide prioritization; they cannot substitute for stakeholder conversations or contractual evidence.</div></aside></div>`;
}
function drawerAccount(){
 const a=getAccount(state.active);if(!a){$('#drawer-root').innerHTML='';return}
 const h=accountHealth(a,TODAY), p=playbookFor(a,TODAY), lang=state.language || a.language, draft=outreachDraft(a,TODAY,lang);
 const breakdown=[['Adoption',a.adoption,35],['Engagement',h.engagement,20],['Business outcomes',a.value,20],['Support',h.support,10],['Sponsor readiness',h.readiness,15]];
 $('#drawer-root').innerHTML=`<div class="drawer-scrim"><aside class="drawer" role="dialog" aria-modal="true" aria-label="Customer detail: ${safe(a.name)}" tabindex="-1"><div class="drawer-header"><span>ACCOUNT INTELLIGENCE / ${a.id}</span><button class="icon-button" data-action="close" aria-label="Close customer detail">${svg('close')}</button></div><div class="drawer-content"><div class="between" style="align-items:flex-start"><div><h2>${safe(a.name)}</h2><div class="drawer-sub">${safe(a.segment)} · ${safe(a.region)} · ${safe(a.sponsorTitle)}</div></div>${status(h.tier)}</div><div class="drawer-summary"><div><span>Health score</span><strong>${h.score}<small style="font-size:12px;color:#94a2a5">/100</small></strong></div><div><span>Annual value</span><strong>${asCompact(a.arr)}</strong></div><div><span>Renewal in</span><strong>${h.days}d</strong></div></div><div class="drawer-section"><div class="between"><h3>Health drivers</h3><span class="label-muted">Transparent weighting</span></div>${breakdown.map(([label,n,weight])=>`<div class="progress-row"><div class="between"><span>${label} · ${weight}% weight</span><strong>${n}/100</strong></div><div class="bar"><span style="width:${n}%"></span></div></div>`).join('')}<div class="signals">${h.signals.map(s=>`<span class="signal ${h.tier==='critical'?'alert':''}">${safe(s)}</span>`).join('')}</div></div><div class="drawer-section"><h3>Success objective</h3><p>${safe(a.objectives)}</p><div class="between"><span class="label-muted">Recommended motion</span><strong style="color:var(--teal);font-size:12px">${p.title}</strong></div><p style="margin:9px 0 0">${p.next}</p></div><div class="drawer-section"><h3>Record an engagement</h3><p>Use these scenario actions to see how the customer score and portfolio priorities respond.</p><div class="drawer-buttons"><button class="button small" data-action="activity" data-kind="touch">${svg('mail')} Stakeholder touch</button><button class="button small" data-action="activity" data-kind="enablement">${svg('trend')} Complete enablement</button><button class="button small" data-action="activity" data-kind="qbr">${svg('document')} Deliver QBR</button><button class="button small" data-action="activity" data-kind="escalation" ${a.p1===0?'disabled':''}>${svg('check')} Resolve priority case</button></div><p class="muted">Scenario actions adjust simulated metrics; they do not communicate with real customer systems.</p></div><div class="drawer-section"><div class="between"><h3>Customer communication</h3><select id="language-select" class="language-select" aria-label="Outreach language"><option value="en" ${lang==='en'?'selected':''}>English</option><option value="es" ${lang==='es'?'selected':''}>Español</option></select></div><p>Personalized business-review invitation · editable starting point</p><div class="composer"><div class="subject">${safe(draft.subject)}</div><pre>${safe(draft.body)}</pre></div><button class="button small" style="margin-top:10px" data-action="copy-email">${svg('copy')} Copy draft</button></div><div class="drawer-section"><h3>Account notes</h3><label class="form-label" for="account-notes">Private browser-local notes (demo only)</label><textarea id="account-notes" class="field" rows="3" placeholder="Capture an observed risk, decision or next step...">${safe(a.notes)}</textarea><button class="button small" style="margin-top:9px" data-action="save-notes">${svg('check')} Save notes</button></div><div class="drawer-section"><h3>Engagement history</h3>${a.activities.length?a.activities.slice(0,6).map(e=>`<div class="activity-row"><strong>${activityNames[e.type]||safe(e.type)}</strong><span>${prettyDate(e.date)}</span></div>`).join(''):'<p class="muted">No scenario activities recorded yet.</p>'}</div></div></aside></div>`;
}
function resetModal(){
 $('#drawer-root').innerHTML=`<div class="modal-scrim"><div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">Reset demonstration?</h2><p>This will restore all 35 fictional accounts to the baseline and erase browser-local notes and activity history. It will not change any external system.</p><div class="actions"><button class="button" data-action="cancel-reset">Cancel</button><button class="button danger" data-action="confirm-reset">Reset scenario</button></div></div></div>`;
}
function render(){
 const titles={overview:'Overview',accounts:'Customer accounts',playbooks:'Success playbooks',brief:'Executive brief'};
 $('#breadcrumb-current').textContent=titles[state.view];$('#snapshot-date').textContent=prettyDate(TODAY);
 $('#primary-nav').querySelectorAll('[data-nav]').forEach(el=>{el.classList.toggle('is-active',el.dataset.nav===state.view);if(el.dataset.nav===state.view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});
 $('.sidebar').classList.toggle('is-open',state.mobile);$('#mobile-menu').setAttribute('aria-expanded',String(state.mobile));
 $('#main-content').innerHTML=({overview,accounts:listAccounts,playbooks:playbooksView,brief:briefView}[state.view])();
 if(state.resetConfirm)resetModal();else if(state.active)drawerAccount();else $('#drawer-root').innerHTML='';
}
function handleClick(event){
 if(event.target.classList.contains('drawer-scrim')||event.target.classList.contains('modal-scrim')){state.active=null;state.resetConfirm=false;render();return}
 const target=event.target.closest('[data-nav],[data-action]');if(!target)return;
 if(target.dataset.nav){navigate(target.dataset.nav);return}
 const action=target.dataset.action,id=target.dataset.id;
 if(action==='open'){state.active=id;state.language=null;render();$('.drawer')?.focus();return}
 if(action==='close'||action==='dismiss'){state.active=null;render();return}
 if(action==='view-accounts'){navigate('accounts');return}
 if(action==='export-csv'){download(`customer-portfolio-${TODAY}.csv`,toCsv(accounts,TODAY),'text/csv;charset=utf-8');return}
 if(action==='export-brief'){download(`executive-review-${TODAY}.md`,executiveMarkdown(accounts,TODAY),'text/markdown;charset=utf-8');return}
 if(action==='copy-brief'){copy(executiveMarkdown(accounts,TODAY));return}
 if(action==='reset'){state.resetConfirm=true;render();return}
 if(action==='cancel-reset'){state.resetConfirm=false;render();return}
 if(action==='confirm-reset'){accounts=makeSeedAccounts(TODAY);persist();state.resetConfirm=false;state.active=null;render();toast('Baseline restored: 35 fictional accounts');return}
 if(action==='activity'){
   const a=getAccount(state.active);if(!a)return;
   changeAccount(recordActivity(a,target.dataset.kind,TODAY));
   toast(`${activityNames[target.dataset.kind]} recorded. Health recalculated.`);return;
 }
 if(action==='save-notes'){
   const a=getAccount(state.active);if(!a)return;
   changeAccount({...a,notes:$('#account-notes').value.slice(0,2000)});toast('Notes saved locally');return;
 }
 if(action==='copy-email'){
   const a=getAccount(state.active);if(!a)return;const m=outreachDraft(a,TODAY,state.language||a.language);copy(`Subject: ${m.subject}\n\n${m.body}`);return;
 }
 if(action==='clear-filters'){state.search='';state.tier='all';state.segment='all';state.sort='risk';render();return}
 if(action==='playbook-accounts'){
   const type=target.dataset.playbook;
   const a=prioritizedAccounts(accounts,TODAY).find(x=>playbookFor(x,TODAY).type===type);
   if(a){state.active=a.id;state.language=null;render();$('.drawer')?.focus()} else toast('No accounts match this playbook');return;
 }
}
function handleChanges(event){
 if(event.target.id==='tier-filter'){state.tier=event.target.value;refreshTable()}
 else if(event.target.id==='segment-filter'){state.segment=event.target.value;refreshTable()}
 else if(event.target.id==='sort-select'){state.sort=event.target.value;refreshTable()}
 else if(event.target.id==='language-select'){state.language=event.target.value;drawerAccount()}
}
document.addEventListener('click',handleClick);
document.addEventListener('change',handleChanges);
document.addEventListener('input',e=>{if(e.target.id==='account-search'){state.search=e.target.value;refreshTable()}});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&(state.active||state.resetConfirm)){state.active=null;state.resetConfirm=false;render()}
 if((event.key==='Enter'||event.key===' ')&&event.target.matches('tr[data-action="open"]')){event.preventDefault();state.active=event.target.dataset.id;state.language=null;render();$('.drawer')?.focus()}
});
document.querySelectorAll('[data-icon]').forEach(node => { node.innerHTML = svg(node.dataset.icon); });
$('#mobile-menu').addEventListener('click',()=>{state.mobile=!state.mobile;$('.sidebar').classList.toggle('is-open',state.mobile);$('#mobile-menu').setAttribute('aria-expanded',String(state.mobile))});
render();

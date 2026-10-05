/** SHALVADZE owner reminder. Reads the existing live Control Center queue.
 * No Gmail access, buyer sending, Marketing Calendar, extra trigger or alternate queue.
 */
const CONFIG = {
  SPREADSHEET_ID: '120g7CHP5lPDUx0QwQOZXd572y0sM8rP52-qWxTsv6og',
  REMINDER_EMAIL: 'taha@shalvadze.com',
  TIMEZONE: 'Asia/Hong_Kong',
  CRM_URL: 'https://docs.google.com/spreadsheets/d/120g7CHP5lPDUx0QwQOZXd572y0sM8rP52-qWxTsv6og/edit',
  COVERAGE: 'TOMORROW_ONLY', // Preserve existing delivery coverage until founder chooses DAILY_DIGEST.
  MAX_ROWS_PER_SECTION: 40
};

/** Existing trigger target. Recipient is fixed to the founder, never a buyer. */
function sendCRMReminder() {
  const d=buildReminderData_();
  const sections=reminderSections_(d);
  if (!sections.some(s=>s.items.length)) {console.log('No actions within approved reminder coverage. No email sent.');return;}
  const subject=CONFIG.COVERAGE==='DAILY_DIGEST' ? 'SHALVADZE Sales — '+d.buyerOverdue.length+' overdue follow-ups; '+d.internalDue.length+' internal actions due' : 'SHALVADZE Outreach — '+d.buyerTomorrow.length+' follow-up review(s) tomorrow';
  MailApp.sendEmail(CONFIG.REMINDER_EMAIL,subject,renderText_(d,sections),{htmlBody:renderEmail_(d,sections),name:'SHALVADZE CRM Reminders'});
  console.log('Founder-only reminder sent; coverage='+CONFIG.COVERAGE+'. No buyer recipient or Gmail action is supported.');
}

/** Manual read-only preview. Does not send or mutate anything. */
function previewCRMReminder() {
  const d=buildReminderData_();
  const summary={asOf:d.today,coverage:CONFIG.COVERAGE,overdueFollowups:d.buyerOverdue.length,followupsToday:d.buyerToday.length,followupsTomorrow:d.buyerTomorrow.length,upcomingFollowups:d.buyerUpcoming.length,internalOverdue:d.internalOverdue.length,internalToday:d.internalToday.length,initialOutreach:d.initial.length,protectedOpportunities:d.protected.length,dataErrors:d.errors.length,waitingOnBuyer:d.waiting.length,currentActions:d.all.length,items:d.all.map(x=>({company:x.company,category:x.category,due:x.due,action:x.nextAction}))};
  console.log(JSON.stringify(summary));
  return summary;
}

function buildReminderData_() {
  const ss=SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sh=ss.getSheetByName('CONTROL CENTER');
  if(!sh)throw new Error('Missing CONTROL CENTER. No reminder sent.');
  // Full bounded current queue, including its header; no capped row250 calendar scan.
  const matrix=sh.getRange('D4:K1000').getValues();
  const expected=['Current Action Category','Company','Next Action','Due / Review Date','Lead ID','Workflow Owner','Current Stage','Protection'];
  if(expected.some((h,i)=>matrix[0][i]!==h))throw new Error('Current queue header mismatch. No reminder sent.');
  const companySheet=ss.getSheetByName('COMPANY INTELLIGENCE');
  const companyRows=companySheet.getRange('A5:AI1000').getValues();
  const companies={};companyRows.forEach(r=>{if(r[0])companies[String(r[0])]=r;});
  const today=Utilities.formatDate(new Date(),CONFIG.TIMEZONE,'yyyy-MM-dd');
  return buildQueueData_(matrix.slice(1),companies,today);
}

function buildQueueData_(rows,companies,today) {
  const all=[],seen={};
  rows.forEach(r=>{
    if(r.every(v=>v===''||v===null))return;
    const category=str_(r[0]);
    if(/^#/.test(category))throw new Error('Current queue formula error. No reminder sent.');
    const leadId=str_(r[4]);
    if(!leadId||!companies[leadId])throw new Error('Queue references unknown Lead ID. No reminder sent.');
    if(seen[leadId])throw new Error('Duplicate current operational action for '+leadId+'. No reminder sent.');
    seen[leadId]=true;
    const due=dateKey_(r[3]);
    const allowed=['OVERDUE FOLLOW-UP EMAILS','FOLLOW-UPS DUE TODAY','UPCOMING FOLLOW-UPS','INITIAL OUTREACH / DRAFT REQUIRED','INTERNAL QUALIFICATION / RESEARCH','BUYER DEVELOPMENT','DATA ERROR / REQUIRES RESOLUTION','PROTECTED ACTIVE OPPORTUNITY','PROTECTED SUPPLIER/RFQ','WAITING ON BUYER'];
    if(allowed.indexOf(category)<0)throw new Error('Unrecognized operational category '+category+'. No reminder sent.');
    if(!due && category!=='DATA ERROR / REQUIRES RESOLUTION' && category!=='WAITING ON BUYER' && !/^PROTECTED /.test(category))throw new Error('Undated current action without an explicit waiting/error state. No reminder sent.');
    all.push({leadId,company:str_(r[1]),nextAction:str_(r[2]),action:str_(r[2]),due,owner:str_(r[5]),stage:str_(r[6]),protection:str_(r[7]),category,lastOutreach:dateKey_(companies[leadId][26])});
  });
  all.sort((a,b)=>a.due.localeCompare(b.due)||a.company.localeCompare(b.company));
  const buyer=all.filter(x=>['OVERDUE FOLLOW-UP EMAILS','FOLLOW-UPS DUE TODAY','UPCOMING FOLLOW-UPS'].indexOf(x.category)>=0);
  const internal=all.filter(x=>x.category==='INTERNAL QUALIFICATION / RESEARCH'||x.category==='BUYER DEVELOPMENT');
  const next=new Date(Date.parse(today+'T00:00:00Z')+86400000).toISOString().slice(0,10);
  return {today,all,buyerOverdue:buyer.filter(x=>x.due<today),buyerToday:buyer.filter(x=>x.due===today),buyerTomorrow:buyer.filter(x=>x.due===next),buyerUpcoming:buyer.filter(x=>x.due>today),internalOverdue:internal.filter(x=>x.due<today),internalToday:internal.filter(x=>x.due===today),internalDue:internal.filter(x=>x.due<=today),internalUpcoming:internal.filter(x=>x.due>today),initial:all.filter(x=>x.category==='INITIAL OUTREACH / DRAFT REQUIRED'),protected:all.filter(x=>x.category==='PROTECTED ACTIVE OPPORTUNITY'||x.category==='PROTECTED SUPPLIER/RFQ'),errors:all.filter(x=>x.category==='DATA ERROR / REQUIRES RESOLUTION'),waiting:all.filter(x=>x.category==='WAITING ON BUYER')};
}

function reminderSections_(d) {
  if(CONFIG.COVERAGE!=='DAILY_DIGEST')return [{title:'FOLLOW-UP REVIEWS — TOMORROW',items:d.buyerTomorrow}];
  return [
    {title:'OVERDUE FOLLOW-UP EMAILS',items:d.buyerOverdue},
    {title:'FOLLOW-UPS DUE TODAY',items:d.buyerToday},
    {title:'FOLLOW-UP REVIEWS — TOMORROW',items:d.buyerTomorrow},
    {title:'INITIAL OUTREACH — DUE FOR REVIEW',items:d.initial.filter(x=>x.due<=d.today)},
    {title:'INTERNAL ACTIONS DUE',items:d.internalDue},
    {title:'PROTECTED COMMERCIAL REVIEWS DUE',items:d.protected.filter(x=>x.due&&x.due<=d.today)},
    {title:'DATA ERRORS REQUIRING RESOLUTION',items:d.errors}
  ];
}
function renderText_(d,sections) {
  const lines=['SHALVADZE sales actions — '+d.today+' (Hong Kong)','Founder review only. Check Gmail/CRM before communication. Protected workflows remain protected.'];
  sections.forEach(s=>{lines.push('',s.title+' ('+s.items.length+')');s.items.forEach(x=>lines.push([x.company,x.stage,x.due,x.nextAction,x.owner].join(' | ')));});
  return lines.join('\n')+'\n\nCRM: '+CONFIG.CRM_URL;
}
function renderEmail_(d,sections) {
  let html='<div style="font:14px Arial,sans-serif;color:#202124"><h1 style="font-size:20px">SHALVADZE sales actions</h1><p>'+esc_(d.today)+' (Hong Kong). Check Gmail and CRM before communication. This notification never emails buyers.</p>';
  sections.forEach(s=>{
    html+='<h2 style="font-size:16px">'+esc_(s.title)+' ('+s.items.length+')</h2>';
    if(!s.items.length){html+='<p>None</p>';return;}
    html+='<table style="border-collapse:collapse;width:100%"><tr>'+['Company','Stage','Due / Review','Next Action','Owner'].map(x=>'<th style="text-align:left;border:1px solid #ddd;padding:7px">'+esc_(x)+'</th>').join('')+'</tr>';
    s.items.slice(0,CONFIG.MAX_ROWS_PER_SECTION).forEach(x=>{html+='<tr>'+[x.company,x.stage,x.due,x.nextAction,x.owner].map(v=>'<td style="vertical-align:top;border:1px solid #ddd;padding:7px">'+esc_(v)+'</td>').join('')+'</tr>';});
    html+='</table>';
  });
  return html+'<p><a href="'+CONFIG.CRM_URL+'">Open SHALVADZE CRM</a></p></div>';
}
function dateKey_(v) {
  if(v===''||v===null||v===undefined)return '';
  if(Object.prototype.toString.call(v)==='[object Date]'&&!isNaN(v.getTime()))return Utilities.formatDate(v,CONFIG.TIMEZONE,'yyyy-MM-dd');
  if(typeof v==='number')return new Date(Date.UTC(1899,11,30)+Math.floor(v)*86400000).toISOString().slice(0,10);
  const match=str_(v).match(/^(20\d{2}-\d{2}-\d{2})/);return match?match[1]:'';
}
function str_(v){return v===null||v===undefined?'':String(v).trim();}
function esc_(v){return str_(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

'use strict';
process.env.TZ='Asia/Hong_Kong';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {backend,frontend,emptySource}=require('./action-harness.cjs');
const service=backend();
function company(id,status,action,due){return {'Lead ID':id,Company:id,'Outreach Status':status,'Next Action':action,'Next Action Date':due};}
function snap(companies,extra={}){return service.buildSnapshot({...emptySource(),companies,...extra});}
test('drafts cannot be parsed as sent; internal follow-up review is not a send',()=>{
 assert.equal(service.normalizeActivityType('Initial Outreach Draft Prepared',{Channel:'Gmail',Direction:'Draft'}),'DRAFT_PREPARED');
 assert.equal(service.normalizeActivityType('D10 Follow-up Draft Prepared',{Channel:'Gmail',Direction:'Outbound Draft'}),'DRAFT_PREPARED');
 assert.notEqual(service.normalizeActivityType('D20 Follow-up Review',{Channel:'CRM',Direction:'Internal'}),'FOLLOWUP_SENT');
});
test('Kaleidoscope administrative reply retains cold sequence, not buyer conversation',()=>{
 const x=snap([company('K','D4 Follow-up Sent — Auto-Reply Received; D10 Review Scheduled','Check Gmail on D10','2026-10-10')]);
 assert.notEqual(x.companies[0].status,'Buyer Conversation');assert.equal(x.actions[0].category,'FOLLOW_UP');
 assert.equal(service.normalizeActivityType('Automatic Reply Received — Temporary Closure',{Direction:'Inbound',Channel:'Gmail'}),'AUTO_REPLY');
});
test('OOO-aware Brown review and founder nurture recommendations are internal, dates preserved',()=>{
 const x=snap([company('Brown','Initial Sent — OOO / Internal Return-Status Review','Day 4 review — check John’s return','2026-10-04'),company('E','REVIEW — NURTURE RECOMMENDED','Taha decision; do not repeat D20','2026-09-20')]);
 assert.ok(x.actions.every(a=>a.category==='INTERNAL'));const ui=frontend(false,'2026-10-06T02:00:00+08:00');ui.CRM._setSnapshot(x,false);assert.equal(ui.CRM.getStats().overdue,0);assert.equal(ui.CRM.getStats().internalOverdue,2);
});
test('HOLD allows one explicit internal contact review; cold stage and DNC cannot surface',()=>{
 const x=snap([company('A','HOLD — Founder Contact Research','Founder contact research review','2026-10-28'),company('B','HOLD — Approved','Day 4 review','2026-10-07'),{...company('C','NURTURE / DO NOT CONTACT — TAHA APPROVED','Internal review','2026-10-07'),'Do Not Contact':'Yes'}]);
 assert.equal(x.actions.length,1);assert.equal(x.actions[0].companyId,'A');assert.equal(x.actions[0].category,'INTERNAL');const ui=frontend();ui.CRM._setSnapshot(x,false);assert.equal(ui.CRM.getActiveActions().length,1);
});
test('protected undated opportunity never becomes cold; waiting is visible without invented date',()=>{
 const x=snap([company('M','Protected Active Buyer Opportunity','D4 review','2026-10-07')],{opportunities:[{'Lead ID':'M','Opportunity ID':'O',Stage:'Samples Dispatched','Next Action':'Await samples feedback'}]});
 assert.equal(x.actions.length,0);assert.equal(x.unscheduledActions.length,1);assert.equal(x.unscheduledActions[0].category,'PROTECTED_ACTIVE_OPPORTUNITY');assert.equal(x.unscheduledActions[0].due,'');
});
test('draft sentAt uses matching Gmail message, not later company research',()=>{
 const x=snap([company('A','Sent','D10 review','2026-10-08')],{activities:[{'Lead ID':'A','Activity ID':'1','Activity Type':'D4 Follow-up Sent',Direction:'Outbound',Channel:'Gmail','Activity Date':'2026-10-05','Evidence / Source':'message_id=1a10a88f6a6319e1; sent2026-10-05T13:28:30+08:00'},{'Lead ID':'A','Activity ID':'2','Activity Type':'CRM Research',Direction:'Internal',Channel:'CRM','Activity Date':'2026-10-06'}],drafts:[{'Lead ID':'A',Touch:'D4','Message Status':'SENT — IMMUTABLE','Intelligence / Control Note':'message_id=1a10a88f6a6319e1'}]});
 assert.equal(x.drafts[0].sentAt,'2026-10-05');assert.equal(x.activities[0].at,Date.parse('2026-10-05T13:28:30+08:00'));assert.equal(x.activities[1].timePrecision,'DATE_ONLY');
});
test('marketing payload is optional; current app remains valid without it',()=>{
 const source={...emptySource(),companies:[company('A','Sent','D4','2026-10-09')]};delete source.marketingCalendar;const x=service.buildSnapshot(source);delete x.marketingCalendar;const ui=frontend();assert.equal(ui.isValidSnapshot(x),true);
});
test('reminder reads the same live Control queue and fails closed on duplicates/formula errors',()=>{
 const context=vm.createContext({console,Date,Utilities:{formatDate:d=>d.toISOString().slice(0,10)}});vm.runInContext(fs.readFileSync(__dirname+'/../scripts/crm-reminder/Code.gs','utf8'),context);
 const rows=[['INTERNAL QUALIFICATION / RESEARCH','Brown','OOO review',46300,'B','Founder','D4',''],['UPCOMING FOLLOW-UPS','Axis','D20 review',46302,'A','Founder','D20',''],['PROTECTED ACTIVE OPPORTUNITY','Maxim','Await sample feedback','','M','Factory Agent','ACTION','PROTECTED']];
 const companies={A:[],B:[],M:[]};const d=context.buildQueueData_(rows,companies,'2026-10-06');assert.equal(d.buyerOverdue.length,0);assert.equal(d.internalOverdue.length,1);assert.equal(d.buyerTomorrow.length,1);assert.equal(d.protected.length,1);assert.throws(()=>context.buildQueueData_([rows[0],rows[0]],companies,'2026-10-06'),/Duplicate/);assert.throws(()=>context.buildQueueData_([['#ERROR!']],companies,'2026-10-06'),/formula error/);
});

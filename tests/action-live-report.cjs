'use strict';
// Read-only local comparison. The input is a private, freshly retrieved raw
// source object; keep it outside the repository. No network or deployment.
process.env.TZ = 'Asia/Hong_Kong';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { backend, frontend } = require('./action-harness.cjs');
const [file, day] = process.argv.slice(2);
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(day || '')) throw new Error('Usage: node tests/action-live-report.cjs /private/path/source.json YYYY-MM-DD');
const source = JSON.parse(fs.readFileSync(file, 'utf8'));
const oldSnapshot = backend(true).buildSnapshot(source);
const snapshot = backend().buildSnapshot(source);
const oldUI = frontend(true, day + 'T12:00:00+08:00');
const ui = frontend(false, day + 'T12:00:00+08:00');
oldUI.CRM._setSnapshot(oldSnapshot, false);
ui.CRM._setSnapshot(snapshot, false);
const actions = ui.CRM.getActiveActions();
assert.equal(new Set(actions.map(a => a.companyId)).size, actions.length);
actions.forEach(action => {
  const rows = action.source.tab === 'OPPORTUNITIES' ? source.opportunities : source.companies;
  const row = rows.find(r => r['Lead ID'] === action.companyId && (!action.opportunityId || r['Opportunity ID'] === action.opportunityId));
  assert.equal(action.title, row['Next Action'].trim());
  assert.equal(action.due, backend().dateOnly(row['Next Action Date']));
  assert.equal(ui.Rules.isSuppressed(ui.CRM.getCompanyById(action.companyId)), false);
});
assert.equal(snapshot.outreachCalendar.length, source.actions.length);
source.actions.forEach(row => {
  const company = ui.CRM.getCompanyById(row['Lead ID']);
  if (!company) return;
  assert.ok(company.outreach.steps.some(step => step.label === row['Action Type']));
});
for (const company of snapshot.companies) assert.ok(ui.Pages.company(company.id));
for (const opportunity of snapshot.opportunities) assert.ok(ui.Pages.opportunity(opportunity.id));
for (const page of ['dashboard', 'actions', 'companies', 'drafts', 'opportunities', 'settings']) assert.ok(ui.Pages[page]());
for (const filter of ['all', 'today', 'overdue', 'INITIAL', 'D4', 'D10', 'D20', 'MONTHLY', 'opportunities', 'founder']) {
  ui.UIState.filters.action = filter;
  assert.ok(ui.Pages.actionsBody());
}
const summarize = a => ({ company: ui.CRM.getCompanyById(a.companyId).name, action: a.title, source: a.source.tab + ' → Next Action / Next Action Date', due: a.due });
console.log(JSON.stringify({
  asOf: day + ' Asia/Hong_Kong',
  old: oldUI.CRM.getStats(), current: ui.CRM.getStats(),
  remainingOverdue: actions.filter(a => ui.DateUtil.dayDiff(a.due) < 0).map(a => ({ ...summarize(a), reason: 'Authoritative populated next action, explicit date before ' + day + ', account not suppressed.' })),
  scheduledActions: actions.map(summarize),
  preservedCalendarRows: snapshot.outreachCalendar.length,
  completedCalendarRows: snapshot.outreachCalendar.filter(a => a.status === 'COMPLETED').length,
  suppressedCompanies: snapshot.companies.filter(c => ui.Rules.isSuppressed(c)).map(c => c.name),
  protectedOpportunity: snapshot.companies.filter(c => /Maxim Office Group/.test(c.name)).map(c => ({ name: c.name, opportunityId: c.opportunityId, nextAction: c.nextAction, scheduledActions: actions.filter(a => a.companyId === c.id).length })),
  renderChecks: 'PASS — all company and opportunity details, dashboard, Actions and all filters, companies, drafts, opportunities, settings'
}, null, 2));

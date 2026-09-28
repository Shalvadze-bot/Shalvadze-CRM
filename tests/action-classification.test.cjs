'use strict';
process.env.TZ = 'Asia/Hong_Kong';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { backend, frontend, emptySource, root } = require('./action-harness.cjs');
const normalize = backend().buildSnapshot;
const company = (id, extra = {}) => ({ 'Lead ID': id, Company: id, 'Outreach Status': 'Outreach In Progress', ...extra });
const next = (date = '2026-09-28') => ({ 'Next Action': 'Day 4 review', 'Next Action Date': date });
const fixture = (companies, opportunities = [], actions = []) => ({ ...emptySource(), companies, opportunities, actions });

test('blank execution and calendar dates never generate operational actions; history survives', () => {
  const rows = ['', 'Completed — Sent (Gmail Verified)', 'SUPERSEDED — HOLD', 'CANCELLED', 'ON HOLD', 'Planned — Current Action'].map((status, i) => ({
    'Lead ID': 'A', 'Calendar ID': 'CAL-' + i, 'Execution Status': status, 'Scheduled Date': '2026-09-01', 'Action Type': 'Day 4'
  }));
  const result = normalize(fixture([company('A')], [], rows));
  assert.equal(result.actions.length, 0);
  assert.equal(result.outreachCalendar.length, rows.length);
  assert.deepEqual(Array.from(result.companies[0].outreach.steps, row => row.state), ['', 'COMPLETED', 'SUPERSEDED', 'CANCELLED', 'PAUSED', 'PLANNED']);
});

test('only explicit source action and date create scheduled work', () => {
  const result = normalize(fixture([company('A', next()), company('B', next('')), company('C', { 'Next Action Date': '2026-09-01' })]));
  assert.equal(result.actions.length, 1);
  assert.equal(result.actions[0].source.tab, 'COMPANY INTELLIGENCE');
  assert.equal(result.actions[0].due, '2026-09-28');
  assert.equal(result.companies[1].nextAction.label, 'Day 4 review');
});

test('all suppression states win over company and opportunity tasks; conditional nurture is not a state', () => {
  for (const state of ['NURTURE / DO NOT CONTACT — TAHA APPROVED', 'Do Not Contact — approved', 'STRATEGIC HOLD — TAHA APPROVED', 'Stop — approved', 'Closed — approved', 'Nurture']) {
    const result = normalize(fixture([company('A', { ...next(), 'Outreach Status': state })], [
      { 'Lead ID': 'A', 'Opportunity ID': 'O', Stage: 'Buyer Review Pending', ...next() }
    ]));
    assert.equal(result.actions.length, 0, state);
    assert.ok(['Nurture', 'Do Not Contact', 'Strategic Hold', 'Stop', 'Closed'].includes(result.companies[0].status));
  }
  assert.equal(normalize(fixture([company('A', { ...next(), 'Do Not Contact': 'Yes' })])).actions.length, 0);
  for (const status of ['Nurture Review Scheduled', 'Final Follow-up Sent — Awaiting Reply; Nurture Review Scheduled', 'Buyer conversation; review nurture timing next month']) {
    const result = normalize(fixture([company('A', { ...next(), 'Outreach Status': status })]));
    assert.equal(result.actions.length, 1, status);
    assert.notEqual(result.companies[0].status, 'Nurture');
  }
});

test('requested Nurture review and explicit suppression regression cases', () => {
  for (const status of ['Nurture Review Scheduled', 'Final Follow-up Sent — Awaiting Reply; Nurture Review Scheduled']) {
    const result = normalize(fixture([company('A', { ...next(), 'Outreach Status': status })]));
    assert.equal(result.actions.length, 1, status);
    assert.notEqual(result.companies[0].status, 'Nurture');
  }
  for (const status of ['NURTURE / DO NOT CONTACT — TAHA APPROVED', 'STRATEGIC HOLD — TAHA APPROVED']) {
    assert.equal(normalize(fixture([company('A', { ...next(), 'Outreach Status': status })])).actions.length, 0);
  }
});

test('active opportunity supersedes company dates; undated opportunity cannot fall back to cold', () => {
  for (const date of ['', '2026-10-02']) {
    const result = normalize(fixture([company('MAXIM', next())], [
      { 'Lead ID': 'MAXIM', 'Opportunity ID': 'O', Stage: 'Samples Dispatched — Buyer Review Pending', 'Next Action': 'Await sample feedback', 'Next Action Date': date }
    ]));
    assert.equal(result.actions.length, date ? 1 : 0);
    assert.equal(result.companies[0].opportunityId, 'O');
    assert.equal(result.companies[0].nextAction.label, 'Await sample feedback');
    assert.equal(result.companies[0].outreach.superseded, true);
    if (date) {
      assert.equal(result.actions[0].source.tab, 'OPPORTUNITIES');
      assert.equal(result.actions[0].context, 'OPPORTUNITY');
      assert.equal(result.actions[0].due, date);
    }
  }
});

test('multiple opportunities produce at most one earliest explicit action; closed opportunity stays in details', () => {
  const result = normalize(fixture([company('A', next())], [
    { 'Lead ID': 'A', 'Opportunity ID': 'closed', Stage: 'Closed Lost', ...next('2026-01-01') },
    { 'Lead ID': 'A', 'Opportunity ID': 'later', Stage: 'Quotation', ...next('2026-10-05') },
    { 'Lead ID': 'A', 'Opportunity ID': 'first', Stage: 'Buyer Review', ...next('2026-10-02') }
  ]));
  assert.equal(result.actions.length, 1);
  assert.equal(result.actions[0].opportunityId, 'first');
  assert.equal(result.companies[0].opportunityId, 'first');
  assert.equal(result.opportunities.length, 3);
  assert.equal(result.opportunities[0].active, false);
});

test('buyer conversation is not cold cadence; awaiting a reply does not invent a buyer conversation', () => {
  const result = normalize(fixture([
    company('A', { ...next(), 'Outreach Status': 'Buyer Conversation' }),
    company('B', { ...next(), 'Outreach Status': 'Initial Outreach Sent — Awaiting Reply; D4 Review Scheduled' })
  ]));
  const ui = frontend();
  ui.CRM._setSnapshot(result, false);
  assert.equal(ui.Rules.cadenceActive(result.companies[0]), false);
  assert.equal(result.actions[0].context, 'BUYER');
  assert.notEqual(result.companies[1].status, 'Buyer Conversation');
});

test('overdue, today, tomorrow and future groupings use only explicit authoritative dates', () => {
  const result = normalize(fixture(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-02', '2026-10-15', ''].map((date, i) => company(String(i), next(date)))));
  const ui = frontend();
  ui.CRM._setSnapshot(result, false);
  const stats = ui.CRM.getStats();
  assert.equal(stats.openActions, 5);
  assert.equal(stats.overdue, 1);
  assert.equal(stats.actionsToday, 1);
  assert.equal(stats.tomorrow, 1);
  const groups = ui.Rules.groupActions(ui.CRM.getActiveActions());
  assert.deepEqual(['overdue', 'today', 'tomorrow', 'week', 'later'].map(key => groups[key].length), [1, 1, 1, 1, 1]);
  assert.equal(ui.Rules.activeActions([{ status: 'OPEN', companyId: '0', due: '2026-01-01' }], result.companies).length, 0);
});

test('future calendar count excludes completed, undated and already represented stages; never counts drafts twice', () => {
  const ui = frontend();
  const rows = [
    { companyId: 'A', type: 'D4', status: 'PLANNED', due: '2026-10-02' },
    { companyId: 'A', type: 'D10', status: 'PLANNED', due: '2026-10-08' },
    { status: 'COMPLETED', due: '2026-10-08' }, { status: 'PLANNED', due: '' },
    { status: 'PLANNED', due: '2026-09-01' }
  ];
  assert.equal(ui.Rules.hiddenFutureCount(rows, [rows[0]]), 1);
});

test('future, suppressed and opportunity cold drafts cannot count as ready', () => {
  const source = fixture([company('A', next()), company('B', { ...next(), 'Outreach Status': 'Stop' })]);
  source.drafts = ['A', 'B'].map(id => ({ 'Lead ID': id, Touch: 'Day 4', 'Message Status': 'CURRENT READY', 'Operational Next Date': '2026-09-28' }));
  source.drafts.push({ 'Lead ID': 'A', Touch: 'Day 10', 'Message Status': 'CURRENT READY', 'Operational Next Date': '2026-10-04' });
  const result = normalize(source);
  const ui = frontend();
  ui.CRM._setSnapshot(result, false);
  assert.equal(ui.CRM.getStats().draftsReady, 1);
});

test('old live caches fail closed; new live cache survives API failure and missing cache remains unavailable', async () => {
  const ui = frontend();
  const old = { ...emptySource(), meta: { sourceType: 'AUTHENTICATED_LIVE_SOURCES', schemaVersion: '2.0.0' } };
  assert.equal(ui.isValidSnapshot(old), false);
  ui.Cache.write(ui.CRM_CONFIG.cacheKey, old);
  ui.RemoteApiSource.load = () => Promise.reject(new Error('offline'));
  assert.equal((await ui.CRM.init()).ready, false);
  ui.Cache.write(ui.CRM_CONFIG.cacheKey, normalize(fixture([company('A', next())])));
  const cached = await ui.CRM.init();
  assert.equal(cached.ready, true);
  assert.equal(cached.fromCache, true);
  assert.equal(ui.CRM.getStats().overdue, 1);
});

test('both frontend assets are byte-identical', () => {
  assert.equal(fs.readFileSync(root + '/js/app.js', 'utf8'), fs.readFileSync(root + '/www/js/app.js', 'utf8'));
});

test('invalid dates cannot roll forward into invented deadlines; duplicate lead IDs produce one action', () => {
  const result = normalize(fixture([company('A', next('2026-02-30')), company('B', next('TBD')), company('C', next()), company('C', next())]));
  assert.equal(result.actions.length, 1);
  assert.equal(result.actions[0].companyId, 'C');
});

test('D4 instruction referencing its initial send stays D4; due-date transitions remain truthful', () => {
  const source = fixture([company('ABACUS', { 'Next Action': 'Day 4 review based on actual 2026-09-28 initial Gmail send', 'Next Action Date': '2026-10-02' })]);
  const snapshot = normalize(source);
  assert.equal(snapshot.actions[0].type, 'D4');
  for (const [day, today, overdue] of [['2026-09-29', 0, 0], ['2026-10-02', 1, 0], ['2026-10-03', 0, 1]]) {
    const ui = frontend(false, day + 'T12:00:00+08:00');
    ui.CRM._setSnapshot(snapshot, false);
    assert.equal(ui.CRM.getStats().actionsToday, today);
    assert.equal(ui.CRM.getStats().overdue, overdue);
  }
});

test('source joins and company/opportunity page renderers retain history', () => {
  const source = fixture([company('A', next())], [{ 'Lead ID': 'A', 'Opportunity ID': 'O', 'Contact ID': 'C', Stage: 'Buyer Review', ...next() }], [
    { 'Lead ID': 'A', 'Calendar ID': 'H', 'Action Type': 'Initial Outreach', 'Execution Status': 'Completed', 'Scheduled Date': '2026-09-01' }
  ]);
  source.contacts = [{ 'Lead ID': 'A', 'Contact ID': 'C', Person: 'Buyer' }];
  source.activities = [{ 'Lead ID': 'A', 'Activity ID': 'H', 'Activity Type': 'Initial outreach', 'Activity Date': '2026-09-01', 'Subject / Description': 'Verified historical message' }];
  source.drafts = [{ 'Lead ID': 'A', Touch: 'Initial Outreach', 'Message Status': 'SENT — VERIFIED IN GMAIL', Body: 'Historical copy' }];
  const ui = frontend();
  ui.CRM._setSnapshot(normalize(source), false);
  assert.equal(ui.CRM.getContactsByCompany('A').length, 1);
  assert.equal(ui.CRM.getActivitiesByCompany('A').length, 1);
  assert.equal(ui.CRM.getDraftsByCompany('A').length, 1);
  assert.match(ui.Pages.company('A'), /Initial Outreach/);
  assert.match(ui.Pages.opportunity('O'), /Verified historical message/);
  for (const page of ['dashboard', 'actions', 'companies', 'drafts', 'opportunities', 'settings']) assert.ok(ui.Pages[page]().length);
});

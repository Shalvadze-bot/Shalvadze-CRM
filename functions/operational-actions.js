'use strict';

const text = value => value == null ? '' : String(value).trim();

// Match the account's control state, not a future/conditional decision in prose.
function suppression(row) {
  if (/^yes$/i.test(text(row['Do Not Contact']))) return 'Do Not Contact';
  const controls = [row['Outreach Status'], row['Strategic Track']].map(text);
  for (const value of controls) {
    if (/^strategic\s+hold(?:\s*[—–-].*)?$/i.test(value)) return 'Strategic Hold';
    if (/^(?:do\s*not\s*contact|dnc)(?:\s*[—–-].*)?$/i.test(value)) return 'Do Not Contact';
    if (/^nurture\s*\/\s*do\s*not\s*contact\b/i.test(value)) return 'Nurture';
    if (/^nurture$/i.test(value)) return 'Nurture';
    if (/^stop(?:\s*[—–-].*)?$/i.test(value)) return 'Stop';
    if (/^closed(?:\s*[—–-].*)?$/i.test(value)) return 'Closed';
  }
  return '';
}

function activeOpportunity(row) {
  const stage = text(row.Stage);
  return !!stage && !/^(closed|lost|won|cancelled|canceled|stop|stopped|nurture|strategic\s+hold|do\s*not\s*contact|deferred)\b/i.test(stage);
}

function calendarState(value) {
  const status = text(value);
  if (/^completed\b/i.test(status)) return 'COMPLETED';
  if (/^superseded\b/i.test(status)) return 'SUPERSEDED';
  if (/^cancelled\b|^canceled\b/i.test(status)) return 'CANCELLED';
  if (/^(on hold|strategic|stopped|closed)\b/i.test(status)) return 'PAUSED';
  // Even an explicitly planned row is not an authoritative operational task.
  if (/^planned\b/i.test(status)) return 'PLANNED';
  return status;
}

function currentActions(companies, opportunities, helpers) {
  const { dateOnly, normalizeActionType, normalizePriority } = helpers;
  const result = [];
  const seen = new Set();
  function scheduledDate(row) {
    const date = dateOnly(row['Next Action Date']);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    const parsed = new Date(date + 'T00:00:00Z');
    return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
  }
  companies.forEach(company => {
    const leadId = text(company['Lead ID']);
    if (!leadId || seen.has(leadId) || suppression(company)) return;
    const active = opportunities.filter(row => text(row['Lead ID']) === leadId && activeOpportunity(row));
    // A protected opportunity without a scheduled next action must not fall back
    // to a company cold-sequence instruction or a historical calendar row.
    const candidates = (active.length ? active : [company]).filter(row =>
      text(row['Next Action']) && scheduledDate(row)
    ).sort((a, b) => scheduledDate(a).localeCompare(scheduledDate(b)) ||
      text(a['Opportunity ID']).localeCompare(text(b['Opportunity ID'])));
    const row = candidates[0];
    if (!row) return;
    seen.add(leadId);
    const opportunity = active.length > 0;
    const status = text(company['Outreach Status']);
    const context = opportunity || /active\s+(buyer\s+)?opportunity/i.test(status) ? 'OPPORTUNITY' :
      /buyer\s+(conversation|replied)|reply\s+received/i.test(status) ? 'BUYER' : 'COMPANY';
    const category = normalizeActionType(row['Next Action']);
    result.push({
      id: 'next-' + leadId,
      companyId: leadId,
      opportunityId: opportunity ? text(row['Opportunity ID']) : '',
      authoritative: true,
      title: text(row['Next Action']),
      due: scheduledDate(row),
      // This is display categorization of the authoritative instruction only;
      // it never selects a task, fills a date, or advances a cadence stage.
      type: context === 'COMPANY' && ['INITIAL', 'D4', 'D10', 'D20', 'MONTHLY', 'RESEARCH'].includes(category) ? category : 'ACTION',
      context,
      priority: normalizePriority(company['Current Priority']),
      source: { tab: opportunity ? 'OPPORTUNITIES' : 'COMPANY INTELLIGENCE',
        recordId: opportunity ? text(row['Opportunity ID']) : leadId,
        actionField: 'Next Action', dateField: 'Next Action Date' }
    });
  });
  return result;
}

module.exports = { suppression, activeOpportunity, calendarState, currentActions };

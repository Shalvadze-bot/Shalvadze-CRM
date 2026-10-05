'use strict';

const text = value => value == null ? '' : String(value).trim();
const FOLLOWUP = 'FOLLOW_UP';

// Controls are anchored: a conditional "Park if no response" is not PARK.
function suppression(row) {
  if (/^yes$/i.test(text(row['Do Not Contact']))) return 'Do Not Contact';
  for (const value of [row['Outreach Status'], row['Strategic Track']].map(text)) {
    if (/^strategic\s+hold(?:\s*[—–-].*)?$/i.test(value)) return 'Strategic Hold';
    if (/^(?:do\s*not\s*contact|dnc)(?:\s*[—–-].*)?$/i.test(value)) return 'Do Not Contact';
    if (/^nurture\s*\/\s*(?:do\s*not\s*contact|dnc)\b/i.test(value)) return 'Nurture';
    if (/^nurture(?:\s*[—–-].*)?$/i.test(value)) return 'Nurture';
    if (/^hold(?:\s*[—–-].*)?$/i.test(value)) return 'Hold';
    if (/^(?:park|parked)(?:\s*[—–-].*)?$/i.test(value)) return 'Park';
    if (/^(?:drop|dropped)(?:\s*[—–-].*)?$/i.test(value)) return 'Drop';
    if (/^(?:stop|stopped)(?:\s*[—–-].*)?$/i.test(value)) return 'Stop';
    if (/^closed(?:\s*[—–-].*)?$/i.test(value)) return 'Closed';
  }
  return '';
}
function activeOpportunity(row) {
  const stage = text(row.Stage);
  return !!stage && !/^(closed|lost|won|cancelled|canceled|stop|stopped|nurture|strategic\s+hold|do\s*not\s*contact|deferred)\b/i.test(stage);
}
function buyerConversation(row) {
  const status = text(row['Outreach Status']);
  return !/auto[ -]?reply|automatic|out.of.office/i.test(status) && /buyer\s+(conversation|replied)|reply\s+received/i.test(status);
}
function calendarState(value) {
  const status = text(value);
  if (/^completed\b/i.test(status)) return 'COMPLETED';
  if (/^superseded\b/i.test(status)) return 'SUPERSEDED';
  if (/^cancelled\b|^canceled\b/i.test(status)) return 'CANCELLED';
  if (/^(on hold|strategic|stopped|closed)\b/i.test(status)) return 'PAUSED';
  if (/^planned\b/i.test(status)) return 'PLANNED';
  return status;
}
function classification(company, opportunity, stage) {
  const title = text((opportunity || company)['Next Action']);
  const status = text(company['Outreach Status']);
  const protection = text(opportunity && opportunity['Communication Protection']);
  if (/protected.*supplier|supplier.*rfq/i.test(protection)) return 'PROTECTED_SUPPLIER_RFQ';
  if (opportunity || /active\s+(buyer\s+)?opportunity/i.test(status)) return 'PROTECTED_ACTIVE_OPPORTUNITY';
  if (buyerConversation(company)) return 'BUYER_DEVELOPMENT';
  // Explicit decisions/administrative replies take precedence over stage words.
  if (/^review\s*[—–-]\s*(?:nurture|hold)\s+recommended/i.test(status) ||
      /final\s+(?:attempt|follow-up)\s+sent.*(?:park|drop|nurture)/i.test(status) ||
      /founder-directed\s+final\s+attempt\s+sent/i.test(status) ||
      /john.?s\s+return|out.of.office|ooo/i.test(title) ||
      /research|qualification|qualify|buyer.route|contact.research|commercial.trigger|internal|founder.*decision|re.?activation/i.test(title)) return 'INTERNAL';
  const control = suppression(company);
  if (control) return /^(?:Hold|Strategic Hold|Nurture)$/.test(control) ? 'INTERNAL' : 'STOP';
  if (stage === 'INITIAL') return 'INITIAL';
  if (['D4', 'D10', 'D20', 'MONTHLY'].includes(stage)) return FOLLOWUP;
  return 'INTERNAL';
}
function currentActions(companies, opportunities, helpers) {
  const { dateOnly, normalizeActionType, normalizePriority } = helpers;
  const result = [], seen = new Set();
  function scheduledDate(row) {
    const date = dateOnly(row['Next Action Date']);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    const parsed = new Date(date + 'T00:00:00Z');
    return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
  }
  companies.forEach(company => {
    const leadId = text(company['Lead ID']);
    if (!leadId || seen.has(leadId)) return;
    const active = opportunities.filter(row => text(row['Lead ID']) === leadId && activeOpportunity(row));
    const candidates = (active.length ? active : [company]).filter(row => text(row['Next Action']) && scheduledDate(row))
      .sort((a,b) => scheduledDate(a).localeCompare(scheduledDate(b)) || text(a['Opportunity ID']).localeCompare(text(b['Opportunity ID'])));
    const row = candidates[0];
    if (!row) return; // No historical calendar fallback and no invented date.
    const control = suppression(company), opportunity = active.length ? row : null;
    const stage = normalizeActionType(row['Next Action']);
    const category = classification(company, opportunity, stage);
    // A dated, explicit internal review survives HOLD; no cold copy survives it.
    if (control && (['INITIAL','D4','D10','D20','MONTHLY'].includes(stage) || category !== 'INTERNAL' || !/research|review|re.?activation/i.test(text(row['Next Action'])) || !/^(Hold|Strategic Hold|Nurture)$/.test(control))) return;
    const context = opportunity || category === 'PROTECTED_ACTIVE_OPPORTUNITY' ? 'OPPORTUNITY' : buyerConversation(company) ? 'BUYER' : 'COMPANY';
    seen.add(leadId);
    result.push({ id:'next-'+leadId, companyId:leadId, opportunityId:opportunity ? text(row['Opportunity ID']) : '',
      authoritative:true, title:text(row['Next Action']), due:scheduledDate(row),
      type:context==='COMPANY' && ['INITIAL','D4','D10','D20','MONTHLY','RESEARCH'].includes(stage) ? stage : 'ACTION',
      context, category, founderReview:category==='INTERNAL', owner:opportunity ? text(row['Workflow Owner']) : 'Taha / Outreach Agent',
      protection:opportunity ? text(row['Communication Protection']) : '', priority:normalizePriority(company['Current Priority']),
      source:{tab:opportunity ? 'OPPORTUNITIES' : 'COMPANY INTELLIGENCE', recordId:opportunity ? text(row['Opportunity ID']) : leadId, actionField:'Next Action',dateField:'Next Action Date'} });
  });
  return result;
}
function unscheduledActions(companies, opportunities) {
  const out=[];
  for(const company of companies) {
    if(suppression(company))continue;
    const active=opportunities.filter(row=>text(row['Lead ID'])===text(company['Lead ID'])&&activeOpportunity(row));
    const row=active[0]||company;
    if(text(row['Next Action Date'])||!text(row['Next Action']))continue;
    if(!active.length&&!/final.*sent.*(park|drop)|founder-directed.*final.*sent/i.test(text(company['Outreach Status'])))continue;
    out.push({companyId:text(company['Lead ID']),company:text(company.Company),title:text(row['Next Action']),category:active.length?'PROTECTED_ACTIVE_OPPORTUNITY':'WAITING_ON_BUYER',due:'',requiresScheduling:true});
  }
  return out;
}
module.exports = {suppression, activeOpportunity, buyerConversation, calendarState, classification, currentActions, unscheduledActions};

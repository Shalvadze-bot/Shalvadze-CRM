'use strict';

const { google } = require('googleapis');
const XLSX = require('xlsx');
const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

admin.initializeApp();

const CRM_SPREADSHEET_ID = process.env.SHALVADZE_CRM_SPREADSHEET_ID || '120g7CHP5lPDUx0QwQOZXd572y0sM8rP52-qWxTsv6og';
const CALENDAR_FILE_ID = process.env.SHALVADZE_MARKETING_CALENDAR_FILE_ID || '12QkVZL7LKFUhf_z4NBd3W2hlyL2-tqAA';
const AUTHORIZED_EMAIL = String(process.env.SHALVADZE_AUTHORIZED_EMAIL || 'taha@shalvadze.com').trim().toLowerCase();
const DEFAULT_ORIGINS = [
  'https://shalvadze-bot.github.io',
  'http://localhost',
  'http://localhost:3000',
  'http://localhost:8765',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8765',
  'capacitor://localhost',
  'ionic://localhost'
];

function allowedOrigins() {
  const configured = (process.env.CRM_ALLOWED_ORIGINS || '').split(',').map(function (v) {
    return v.trim();
  }).filter(Boolean);
  return configured.length ? configured : DEFAULT_ORIGINS;
}

function applyCors(req, res) {
  const origin = req.get('origin');
  if (origin && allowedOrigins().indexOf(origin) > -1) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Cache-Control', 'no-store');
  return req.method === 'OPTIONS';
}

function text(value) {
  return value == null ? '' : String(value).trim();
}

function splitList(value) {
  return text(value).split(/[;|]/).map(function (v) { return v.trim(); }).filter(Boolean);
}

function dateOnly(value) {
  if (value == null || value === '') return '';
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return [parsed.y, String(parsed.m).padStart(2, '0'), String(parsed.d).padStart(2, '0')].join('-');
  }
  const raw = text(value);
  let match = raw.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (match) return [match[1], match[2].padStart(2, '0'), match[3].padStart(2, '0')].join('-');
  match = raw.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (match) return [match[3], match[1].padStart(2, '0'), match[2].padStart(2, '0')].join('-');
  return '';
}

function rowsToObjects(values) {
  if (!Array.isArray(values) || !values.length) return [];
  const headers = values[0].map(function (v) { return text(v); });
  return values.slice(1).map(function (row) {
    const out = {};
    headers.forEach(function (header, index) {
      if (header) out[header] = row[index] == null ? '' : row[index];
    });
    return out;
  }).filter(function (row) {
    return Object.keys(row).some(function (key) { return text(row[key]) !== ''; });
  });
}

function findHeaderRows(rows, requiredHeader) {
  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].some(function (v) { return text(v) === requiredHeader; })) return rows.slice(i);
  }
  return [];
}

function readCalendarRows(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, raw: true });
  const sheet = workbook.Sheets['MASTER COMMERCIAL CALENDAR'];
  if (!sheet) throw new Error('MASTER COMMERCIAL CALENDAR sheet is missing.');
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: true });
  return rowsToObjects(findHeaderRows(matrix, 'Record ID'));
}

function normalizePriority(value) {
  const raw = text(value);
  if (/^P1\b/i.test(raw)) return 'High';
  if (/^P2\b/i.test(raw)) return 'Medium';
  if (/^P3\b/i.test(raw)) return 'Low';
  return raw || '—';
}

function normalizeCompanyStatus(row, hasOpportunity) {
  const raw = text(row['Outreach Status']) + ' ' + text(row['Strategic Track']);
  if (/strategic\s+hold/i.test(raw)) return 'Strategic Hold';
  if (/do\s*not\s*contact|\bdnc\b/i.test(raw) || /^yes$/i.test(text(row['Do Not Contact']))) return 'Do Not Contact';
  if (/nurture/i.test(raw)) return 'Nurture';
  if (hasOpportunity || /active\s+opportunity/i.test(raw)) return 'Active Opportunity';
  if (/buyer\s+(conversation|replied)|reply/i.test(raw)) return 'Buyer Conversation';
  if (/not\s+contacted|research|check\s+live\s+crm/i.test(raw)) return 'Research';
  if (/outreach|follow|monthly|sent|draft|ready|current/i.test(raw)) return 'Outreach In Progress';
  return text(row['Outreach Status']) || 'Research';
}

function normalizePipelineStage(row, hasOpportunity) {
  const raw = text(row['Outreach Status']) + ' ' + text(row['Strategic Track']);
  if (/strategic\s+hold/i.test(raw)) return 'Strategic Hold';
  if (/do\s*not\s*contact|\bdnc\b/i.test(raw) || /^yes$/i.test(text(row['Do Not Contact']))) return 'Do Not Contact';
  if (/nurture/i.test(raw)) return 'Nurture';
  if (hasOpportunity || /active\s+opportunity/i.test(raw)) return 'Active Opportunity';
  if (/buyer\s+(conversation|replied)|reply/i.test(raw)) return 'Buyer Conversation';
  if (/day\s*20|\bD20\b/i.test(raw)) return 'D20';
  if (/day\s*10|\bD10\b/i.test(raw)) return 'D10';
  if (/day\s*4|follow-up\s*1|\bD4\b/i.test(raw)) return 'D4';
  if (/initial.*(sent|complete)|sent/i.test(raw)) return 'Initial Sent';
  if (/draft/i.test(raw)) return 'Draft Ready';
  return /not\s+contacted|research|check\s+live\s+crm/i.test(raw) ? 'Research' : 'Approved for Outreach';
}

function normalizeActionType(value) {
  const raw = text(value);
  if (/initial/i.test(raw)) return 'INITIAL';
  if (/day\s*4|follow-up\s*1|\bD4\b/i.test(raw)) return 'D4';
  if (/day\s*10|follow-up\s*2|\bD10\b/i.test(raw)) return 'D10';
  if (/day\s*20|final|\bD20\b/i.test(raw)) return 'D20';
  if (/monthly|re-engagement/i.test(raw)) return 'MONTHLY';
  if (/research|qualification/i.test(raw)) return 'RESEARCH';
  return raw || 'ACTION';
}

function normalizeActivityType(value) {
  const raw = text(value).toLowerCase();
  if (raw.indexOf('initial') > -1 && raw.indexOf('outreach') > -1) return 'OUTREACH_SENT';
  if (raw.indexOf('follow') > -1 || raw.indexOf('day 4') > -1 || raw.indexOf('day 10') > -1 || raw.indexOf('day 20') > -1) return 'FOLLOWUP_SENT';
  if (raw.indexOf('reply') > -1) return 'BUYER_REPLY';
  if (raw.indexOf('draft') > -1) return 'DRAFT_PREPARED';
  if (raw.indexOf('opportunity') > -1) return 'OPPORTUNITY_CREATED';
  if (raw.indexOf('contact') > -1) return 'CONTACT_UPDATED';
  if (raw.indexOf('research') > -1) return 'RESEARCH_UPDATED';
  if (raw.indexOf('strategic') > -1 || raw.indexOf('hold') > -1) return 'STRATEGIC_HOLD';
  if (raw.indexOf('nurture') > -1) return 'NURTURE';
  if (raw.indexOf('status') > -1) return 'STATUS_CHANGE';
  return text(value) || 'STATUS_CHANGE';
}

function isOpenExecution(value) {
  const raw = text(value);
  return !/completed|superseded|cancelled|closed|stopped/i.test(raw);
}

function intelligenceItems(row) {
  const fields = [
    ['Products Purchased', 'Products purchased'],
    ['Product Interest', 'Product interest'],
    ['International Sourcing', 'International sourcing'],
    ['Current Supplier Situation', 'Current supplier situation'],
    ['Buying Cycle', 'Buying cycle'],
    ['Quotation Period', 'Quotation period'],
    ['Seasonal Purchasing Window', 'Seasonal purchasing window'],
    ['Expected Order Date', 'Expected order date'],
    ['Production Deadline', 'Production deadline'],
    ['Shipping Window', 'Shipping window'],
    ['Delivery Window', 'Delivery window'],
    ['Typical Order Size', 'Typical order size'],
    ['MOQ Expectations', 'MOQ expectations'],
    ['Payment Terms', 'Payment terms'],
    ['Private-Label Requirements', 'Private-label requirements'],
    ['Certification / Compliance', 'Certification / compliance'],
    ['Supplier Requirements', 'Supplier requirements'],
    ['Pain Points', 'Pain points'],
    ['Objections', 'Objections'],
    ['Reason Not Interested', 'Reason not interested'],
    ['Recontact Timing', 'Recontact timing']
  ];
  return fields.map(function (field) {
    const value = text(row[field[0]]);
    if (!value) return null;
    const type = /^verified\b/i.test(value) ? 'VERIFIED_FACT' : (/^unverified\b/i.test(value) ? 'OBSERVATION' : 'UNKNOWN');
    return { type: type, title: field[1], detail: value, source: text(row['Intelligence Source']), date: dateOnly(row['Date Learned']) };
  }).filter(Boolean);
}

function buildSnapshot(source) {
  const companiesRows = source.companies;
  const contactsRows = source.contacts;
  const actionsRows = source.actions;
  const activitiesRows = source.activities;
  const buyerRows = source.buyerIntelligence;
  const opportunityRows = source.opportunities;
  const draftRows = source.drafts;
  const opportunityByLead = {};
  opportunityRows.forEach(function (row) {
    const leadId = text(row['Lead ID']);
    if (leadId) (opportunityByLead[leadId] = opportunityByLead[leadId] || []).push(row);
  });
  const contactsByLead = {};
  contactsRows.forEach(function (row) {
    const leadId = text(row['Lead ID']);
    if (leadId) (contactsByLead[leadId] = contactsByLead[leadId] || []).push(row);
  });
  const activitiesByLead = {};
  activitiesRows.forEach(function (row) {
    const leadId = text(row['Lead ID']);
    if (leadId) (activitiesByLead[leadId] = activitiesByLead[leadId] || []).push(row);
  });
  const draftsByLead = {};
  draftRows.forEach(function (row) {
    const leadId = text(row['Lead ID']);
    if (leadId) (draftsByLead[leadId] = draftsByLead[leadId] || []).push(row);
  });

  const buyerIntelligence = buyerRows.map(function (row) {
    return { companyId: text(row['Lead ID']), company: text(row.Company), items: intelligenceItems(row) };
  });
  const buyerByLead = {};
  buyerIntelligence.forEach(function (item) { buyerByLead[item.companyId] = item.items; });

  const contacts = contactsRows.map(function (row) {
    const verification = text(row['Verification Status']);
    const quality = text(row['Contact Quality']);
    return {
      id: text(row['Contact ID']),
      companyId: text(row['Lead ID']),
      name: text(row.Person),
      title: text(row['Job Title']) || text(row.Department),
      email: text(row.Email),
      phone: text(row.Phone),
      country: '',
      confidence: /^verified\b/i.test(verification) ? 'VERIFIED' : (/\blikely\b|possible/i.test(verification + ' ' + quality) ? 'LIKELY' : 'UNCONFIRMED'),
      source: text(row['Source URL']) || text(row['Source Type']),
      status: text(row['Active Status']) || text(row['Outreach / Contact Basis']),
      notes: text(row.Notes)
    };
  });

  const actions = actionsRows.map(function (row) {
    const leadId = text(row['Lead ID']);
    const companyOpp = opportunityByLead[leadId] || [];
    const companyPriority = companiesRows.find(function (company) { return text(company['Lead ID']) === leadId; });
    const approval = text(row['Approval Status']);
    return {
      id: text(row['Calendar ID']),
      companyId: leadId,
      type: normalizeActionType(row['Action Type']),
      context: companyOpp.length || /protected/i.test(text(row['Opportunity Protection'])) ? 'OPPORTUNITY' : 'COLD',
      title: text(row['Action Type']),
      due: dateOnly(row['Scheduled Date']),
      priority: normalizePriority(companyPriority && companyPriority['Current Priority']),
      founderReview: /founder|human approval|review required/i.test(approval),
      draftStatus: '',
      status: isOpenExecution(row['Execution Status']) ? 'OPEN' : 'CLOSED',
      note: text(row.Notes) || text(row['Reason / Learning Gate']),
      approvalStatus: approval,
      executionStatus: text(row['Execution Status'])
    };
  });

  const activities = activitiesRows.map(function (row) {
    const activityDate = dateOnly(row['Activity Date']);
    return {
      id: text(row['Activity ID']),
      companyId: text(row['Lead ID']),
      type: normalizeActivityType(row['Activity Type']),
      title: text(row['Activity Type']),
      at: activityDate ? Date.parse(activityDate + 'T12:00:00Z') : 0,
      description: text(row['Subject / Description']) || text(row.Outcome),
      agent: text(row['Recorded By']) || 'CRM',
      channel: text(row.Channel),
      evidence: text(row['Evidence / Source']),
      outcome: text(row.Outcome),
      previousStatus: text(row['Previous Status']),
      newStatus: text(row['New Status'])
    };
  });

  const latestActivity = {};
  activities.forEach(function (item) {
    if (!latestActivity[item.companyId] || item.at > latestActivity[item.companyId].at) latestActivity[item.companyId] = item;
  });

  const opportunities = opportunityRows.map(function (row) {
    const leadId = text(row['Lead ID']);
    const contact = contacts.find(function (item) { return item.id === text(row['Contact ID']); }) || {};
    const latest = latestActivity[leadId];
    const notes = [text(row['Commercial Risk']), text(row['Lost / Deferred Reason']), text(row['Working-Capital Requirement'])].filter(Boolean);
    return {
      id: text(row['Opportunity ID']),
      companyId: leadId,
      company: text(row.Company),
      country: '',
      stage: text(row.Stage),
      status: text(row.Stage) || 'Active',
      buyerName: contact.name || 'Not recorded',
      buyerTitle: contact.title || 'Not recorded',
      products: splitList(row['Product / Category']),
      requirement: text(row.Requirement),
      timing: dateOnly(row['Next Action Date']) || dateOnly(row['Target Order Date']) || dateOnly(row['Target Quotation Date']) || 'Not recorded',
      nextAction: { label: text(row['Next Action']) || 'Not recorded', date: dateOnly(row['Next Action Date']) },
      supplierWork: { status: text(row['Workflow Owner']) || 'Not recorded', detail: text(row['Communication Protection']) },
      latestCommunication: latest ? { at: latest.at, channel: latest.channel, summary: latest.description } : {},
      notes: notes
    };
  });
  const oppByLead = {};
  opportunities.forEach(function (opportunity) { oppByLead[opportunity.companyId] = opportunity; });

  const drafts = draftRows.map(function (row) {
    const leadId = text(row['Lead ID']);
    const messageStatus = text(row['Message Status']);
    const status = /sent/i.test(messageStatus) ? 'SENT_VERIFIED' : (/superseded|cancelled|on hold/i.test(messageStatus) ? 'SUPERSEDED' : (/current|ready/i.test(messageStatus) ? 'CURRENT_READY' : 'PREPARED_FUTURE'));
    return {
      id: leadId + '-' + text(row.Touch).replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
      companyId: leadId,
      stage: text(row.Touch),
      status: status,
      subject: text(row.Subject),
      greeting: text(row['Greeting Basis']),
      body: text(row.Body),
      recipient: text(row.To),
      recipientNote: text(row['Intelligence / Control Note']),
      preparedAt: dateOnly(row['Recommended Date']),
      preparedBy: '',
      threadRef: '',
      sentAt: status === 'SENT_VERIFIED' && latestActivity[leadId] ? dateOnly(new Date(latestActivity[leadId].at)) : '',
      classification: text(row['Message Classification']),
      messageStatus: messageStatus,
      currentActiveStage: text(row['Current Active Stage']),
      operationalNextDate: dateOnly(row['Operational Next Date'])
    };
  });

  const companies = companiesRows.map(function (row) {
    const leadId = text(row['Lead ID']);
    const hasOpportunity = !!oppByLead[leadId];
    const status = normalizeCompanyStatus(row, hasOpportunity);
    const companyContacts = contactsByLead[leadId] || [];
    const actionsForCompany = actions.filter(function (action) { return action.companyId === leadId; });
    const nextActionLabel = text(row['Next Action']);
    return {
      id: leadId,
      crmId: leadId,
      name: text(row.Company),
      country: text(row.Country),
      countryCode: text(row.Country).toLowerCase().indexOf('new zealand') > -1 ? 'NZ' : (text(row.Country).toLowerCase().indexOf('australia') > -1 ? 'AU' : ''),
      buyerType: text(row['Business Type']),
      priority: normalizePriority(row['Current Priority']),
      priorityLabel: text(row['Current Priority']),
      status: status,
      pipelineStage: normalizePipelineStage(row, hasOpportunity),
      stage: actionsForCompany[0] ? actionsForCompany[0].type : normalizePipelineStage(row, hasOpportunity),
      commercialFit: text(row['Commercial Feasibility']) || '—',
      opportunityId: hasOpportunity ? oppByLead[leadId].id : '',
      about: [text(row['Business Type']), text(row.Category), text(row['Relevant Products'])].filter(Boolean).join(' · '),
      categories: splitList(row.Category),
      tags: [text(row['Strategic Track']), text(row['Qualification Segment'])].filter(Boolean),
      nextAction: { label: nextActionLabel, date: dateOnly(row['Next Action Date']), type: actionsForCompany[0] ? actionsForCompany[0].type : '' },
      intelligence: buyerByLead[leadId] || [],
      productOpportunity: {
        angle: text(row['Current Opportunity']) || text(row['Personalized Hook']),
        products: splitList(row['Relevant Products']),
        sourcing: '',
        concern: text(row['Priority Reason'])
      },
      outreach: {
        sequence: hasOpportunity ? 'OPPORTUNITY' : 'COLD',
        superseded: hasOpportunity || /hold|nurture|do\s*not\s*contact/i.test(status),
        note: text(row['DNC Reason']) || text(row['SHALVADZE Owner Notes']),
        steps: actionsForCompany.map(function (action) { return { key: action.type, label: action.title, state: action.status === 'OPEN' ? 'CURRENT' : 'COMPLETED', date: action.due, evidence: action.executionStatus || action.approvalStatus }; })
      },
      notes: text(row['SHALVADZE Owner Notes']),
      contactCount: companyContacts.length
    };
  });
  const companyCountry = {};
  companies.forEach(function (company) { companyCountry[company.id] = company.country; });
  contacts.forEach(function (contact) { contact.country = companyCountry[contact.companyId] || ''; });
  opportunities.forEach(function (opportunity) { opportunity.country = companyCountry[opportunity.companyId] || ''; });

  const marketingCalendar = source.marketingCalendar.map(function (row) {
    return {
      id: text(row['Record ID']),
      date: dateOnly(row['Planning / Anchor Date']),
      title: text(row['Market Opportunity']),
      channel: text(row['Record Type']),
      campaign: text(row['Market Trigger']),
      priority: normalizePriority(row.Priority),
      status: text(row['Confidence / Status']),
      note: text(row['Recommended Commercial Action'])
    };
  });

  return {
    meta: {
      brand: 'SHALVADZE', owner: 'Taha', ownerRole: 'Founder',
      sourceType: 'AUTHENTICATED_LIVE_SOURCES',
      sourceLabel: 'Private CRM workbook + Master Commercial Calendar',
      schemaVersion: '2.0.0', retrievedAt: new Date().toISOString(),
      focusMarkets: ['Australia', 'New Zealand'], readOnly: true,
      cadence: ['Initial', 'D4', 'D10', 'D20', 'Monthly (15th)']
    },
    companies: companies,
    contacts: contacts,
    actions: actions,
    activities: activities,
    buyerIntelligence: buyerIntelligence,
    opportunities: opportunities,
    drafts: drafts,
    marketingCalendar: marketingCalendar,
    pipelineSummary: {
      order: ['Research', 'Approved for Outreach', 'Draft Ready', 'Initial Sent', 'D4', 'D10', 'D20', 'Monthly', 'Buyer Conversation', 'Active Opportunity', 'Nurture', 'Strategic Hold', 'Do Not Contact', 'Closed'],
      note: 'Counts are derived from live company records.'
    }
  };
}

async function readSources() {
  const auth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'] });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const drive = google.drive({ version: 'v3', auth: client });
  const ranges = [
    "'COMPANY INTELLIGENCE'!A4:AI",
    "'CONTACTS'!A4:V",
    "'OUTREACH CALENDAR'!A4:T",
    "'ACTIVITY HISTORY'!A4:S",
    "'BUYER INTELLIGENCE'!A4:AA",
    "'OPPORTUNITIES'!A4:V",
    "'EMAIL TEMPLATES'!A12:O"
  ];
  const sheetData = await sheets.spreadsheets.values.batchGet({ spreadsheetId: CRM_SPREADSHEET_ID, ranges: ranges, valueRenderOption: 'FORMATTED_VALUE' });
  const values = (sheetData.data.valueRanges || []).map(function (item) { return item.values || []; });
  const calendarFile = await drive.files.get({ fileId: CALENDAR_FILE_ID, alt: 'media' }, { responseType: 'arraybuffer' });
  return {
    companies: rowsToObjects(values[0]),
    contacts: rowsToObjects(values[1]),
    actions: rowsToObjects(values[2]),
    activities: rowsToObjects(values[3]),
    buyerIntelligence: rowsToObjects(values[4]),
    opportunities: rowsToObjects(values[5]),
    drafts: rowsToObjects(values[6]),
    marketingCalendar: readCalendarRows(Buffer.from(calendarFile.data))
  };
}

async function verifyRequest(req) {
  const header = text(req.get('authorization'));
  if (!/^Bearer\s+/i.test(header)) throw Object.assign(new Error('Authentication required.'), { status: 401 });
  const decoded = await admin.auth().verifyIdToken(header.replace(/^Bearer\s+/i, '').trim());
  const tokenEmail = String(decoded.email || '').trim().toLowerCase();
  if (!tokenEmail || tokenEmail !== AUTHORIZED_EMAIL || decoded.email_verified !== true) {
    throw Object.assign(new Error('Access denied.'), { status: 403 });
  }
  return decoded;
}

exports.crmSnapshot = onRequest({ region: 'us-central1', timeoutSeconds: 60, memory: '512MiB' }, async function (req, res) {
  if (applyCors(req, res)) return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    await verifyRequest(req);
    const snapshot = buildSnapshot(await readSources());
    return res.status(200).json(snapshot);
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status >= 500) logger.error('CRM snapshot request failed', error);
    return res.status(status).json({ error: status === 401 || status === 403 ? error.message : 'CRM data is temporarily unavailable.' });
  }
});

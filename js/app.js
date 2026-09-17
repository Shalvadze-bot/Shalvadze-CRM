(function(){
  window.__SV_BOOTED = false;
  window.__SV_ERROR = null;
  var FAILSAFE_MS = 2800;

  function capture(msg){ if(!window.__SV_ERROR) window.__SV_ERROR = String(msg||'Unknown error'); }
  window.addEventListener('error', function(e){
    capture((e && (e.message || (e.error && e.error.message))) || 'Script error');
  });
  window.addEventListener('unhandledrejection', function(e){
    var r = e && e.reason;
    capture((r && (r.message || r)) || 'Unhandled promise rejection');
  });

  function failsafe(){
    if(window.__SV_BOOTED) return;
    var sp = document.getElementById('splash');
    if(sp && sp.getAttribute('data-hidden') !== '1'){
      sp.setAttribute('data-hidden','1');
      sp.style.opacity = '0';
      setTimeout(function(){ if(sp.parentNode) sp.parentNode.removeChild(sp); }, 480);
    }
    var view = document.getElementById('view');
    if(view && !view.innerHTML.replace(/\s/g,'')){
      view.innerHTML =
        '<div class="page"><div class="errorbox"><h4>The CRM did not start</h4>' +
        '<p>' + (window.__SV_ERROR ? String(window.__SV_ERROR) : 'The application script did not initialise. This is usually a blocked or stripped inline script in the hosting environment.') + '</p>' +
        '<button class="btn btn-dark btn-block" style="margin-top:14px" onclick="location.reload()">Reload app</button>' +
        '</div><div class="note"><p style="font-size:11.5px;color:#857D6E;line-height:1.55;margin:0">' +
        'The demo snapshot is embedded in this file, so a reload normally recovers. Cached data is optional — the app runs with empty or blocked localStorage.</p></div></div>';
    }
    var pb = document.getElementById('pagebar');
    if(pb && !pb.innerHTML.replace(/\s/g,'')){
      pb.innerHTML = '<div class="pgtext"><h1>SHALVADZE CRM</h1><div class="pgsub">Startup issue</div></div>';
    }
  }
  window.__SV_FAILSAFE = setTimeout(failsafe, FAILSAFE_MS);
})();
</script>

<script>
/* ============================================================================
   0. ICONS — inline stroke SVG set
   ============================================================================ */
var ICON_PATHS = {
  dashboard:'<rect x="3" y="3" width="7.5" height="8.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.6"/><rect x="3" y="14.5" width="7.5" height="6.5" rx="1.6"/><rect x="13.5" y="11" width="7.5" height="10" rx="1.6"/>',
  bolt:'<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/>',
  building:'<path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21"/><path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5V21"/><path d="M2.5 21h19"/><path d="M7 8h4M7 12h4M7 16h4M17 14h.01M17 17.5h.01"/>',
  pulse:'<path d="M3 12h4l2.5-6.5L14 19l2.5-7H21"/>',
  dots:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  chevR:'<path d="M9 5l7 7-7 7"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  refresh:'<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4v5h-5"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="M16 16l4.5 4.5"/>',
  mail:'<rect x="2.8" y="5" width="18.4" height="14" rx="2.2"/><path d="M3.5 6.8 12 13l8.5-6.2"/>',
  mailOpen:'<path d="M3.5 10.5 12 4l8.5 6.5V19a1.8 1.8 0 0 1-1.8 1.8H5.3A1.8 1.8 0 0 1 3.5 19z"/><path d="M3.6 10.8 12 16.5l8.4-5.7"/>',
  reply:'<path d="M9 7 4 12l5 5"/><path d="M4 12h9.5a6.5 6.5 0 0 1 6.5 6.5V20"/>',
  send:'<path d="M21 3 10.5 13.5"/><path d="M21 3 14.5 21l-4-7.5L3 9.5z"/>',
  user:'<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0"/>',
  users:'<circle cx="9.5" cy="8.5" r="3.4"/><path d="M3 20a6.6 6.6 0 0 1 13 0"/><path d="M16.5 5.6a3.3 3.3 0 0 1 0 6.2"/><path d="M18 14.4A6 6 0 0 1 21.4 20"/>',
  briefcase:'<rect x="3" y="7.5" width="18" height="12.5" rx="2.2"/><path d="M8.8 7.5V6a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2v1.5"/><path d="M3 12.8h18"/>',
  target:'<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
  diamond:'<path d="M6.5 3.5h11L21 9l-9 11.5L3 9z"/><path d="M3 9h18M9 3.5 7.5 9l4.5 11.5L16.5 9 15 3.5"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.4l3.4 2"/>',
  alert:'<path d="M12 3.6 1.9 20.4h20.2z"/><path d="M12 9.6v4.6M12 17.3h.01"/>',
  info:'<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4M12 7.8h.01"/>',
  flag:'<path d="M5 21V4.2"/><path d="M5 5.2h11.5l-1.8 3.6 1.8 3.6H5"/>',
  calendar:'<rect x="3.2" y="5" width="17.6" height="16" rx="2.2"/><path d="M3.2 10h17.6M8 3v4M16 3v4"/>',
  layers:'<path d="M12 3 3 7.6l9 4.6 9-4.6z"/><path d="m3 12.4 9 4.6 9-4.6"/><path d="m3 16.9 9 4.6 9-4.6"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.6 13h6.8M8.6 16.6h4.6"/>',
  checkCircle:'<circle cx="12" cy="12" r="8.6"/><path d="m8.2 12.3 2.7 2.7 5-5.4"/>',
  x:'<circle cx="12" cy="12" r="8.6"/><path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6"/>',
  globe:'<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8"/><path d="M12 3.4c2.2 2.4 3.3 5.4 3.3 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.3-5.4-3.3-8.6S9.8 5.8 12 3.4z"/>',
  phone:'<path d="M6.4 3.5h3l1.5 4-2 1.4a11.5 11.5 0 0 0 5.2 5.2l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2z"/>',
  database:'<ellipse cx="12" cy="6" rx="7.6" ry="3"/><path d="M4.4 6v12c0 1.7 3.4 3 7.6 3s7.6-1.3 7.6-3V6"/><path d="M4.4 12c0 1.7 3.4 3 7.6 3s7.6-1.3 7.6-3"/>',
  lock:'<rect x="4.6" y="10.4" width="14.8" height="10" rx="2"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/>',
  eye:'<path d="M2.4 12S6 5.8 12 5.8 21.6 12 21.6 12 18 18.2 12 18.2 2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.9"/>',
  eyeOff:'<path d="M9.6 6.2A8.7 8.7 0 0 1 12 5.8c6 0 9.6 6.2 9.6 6.2a17 17 0 0 1-2.7 3.5M6.4 7.9A16.7 16.7 0 0 0 2.4 12S6 18.2 12 18.2a9 9 0 0 0 3.6-.7"/><path d="m10 10 4 4M4 4l16 16"/>',
  trendUp:'<path d="M3 17.5 9.5 11l4 4L21 7.5"/><path d="M15.5 7.5H21v5.5"/>',
  sparkles:'<path d="m12 3.5 1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  box:'<path d="M20.5 7.8 12 3.5 3.5 7.8v8.4L12 20.5l8.5-4.3z"/><path d="M3.5 7.8 12 12l8.5-4.2M12 12v8.5"/>',
  copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M5.5 15.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h9A1.5 1.5 0 0 1 15.5 5v.5"/>',
  pause:'<rect x="7" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.4" y="5" width="3.6" height="14" rx="1.2"/>',
  archive:'<rect x="3" y="4.5" width="18" height="4.4" rx="1.4"/><path d="M5 8.9V19a1.6 1.6 0 0 0 1.6 1.6h10.8A1.6 1.6 0 0 0 19 19V8.9"/><path d="M10 12.6h4"/>',
  megaphone:'<path d="M3.5 10.5v3a1.6 1.6 0 0 0 1.6 1.6H7l8.5 4.4V6.1L7 10.5H5.1a1.6 1.6 0 0 0-1.6 1.6z"/><path d="M18.4 9.2a4 4 0 0 1 0 5.6"/>',
  factory:'<path d="M3 20.5V10l5.5 3V10l5.5 3V6.5L21 10v10.5z"/><path d="M3 20.5h18"/><path d="M7 17h1.5M12 17h1.5M16.5 17H18"/>',
  shield:'<path d="M12 3.2 4.8 6v6c0 4.4 3 7.6 7.2 9 4.2-1.4 7.2-4.6 7.2-9V6z"/><path d="m9.2 12 2 2 3.6-3.8"/>',
  question:'<circle cx="12" cy="12" r="8.6"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.3M12 17.2h.01"/>',
  scale:'<path d="M12 4v16M6 8h12"/><path d="M6 8 3.5 14h5zM18 8l-2.5 6h5z"/><path d="M8.5 20h7"/>',
  history:'<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4v5h5"/><path d="M12 7.8V12l3 1.8"/>'
};
function icon(name){
  var p = ICON_PATHS[name] || ICON_PATHS.info;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
}

/* ============================================================================
   1. DATE UTILITIES + RELATIVE TOKEN RESOLVER
   ----------------------------------------------------------------------------
   Demo tokens keep the sample data permanently "live":
     "D+3" / "D-1"  -> local date string yyyy-mm-dd
     "T-4h" / "T-2d"-> epoch milliseconds
   FIX: the date pattern now REQUIRES an explicit sign (or a bare 0) so the
   cadence enums "D4", "D10", "D20" are never mistaken for offsets.
   ============================================================================ */
var DateUtil = (function(){
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DATE_TOKEN = /^D(?:[+-]\d+|0)$/;
  var TIME_TOKEN = /^T-(\d+)([hmd])$/;

  function today(){ var d=new Date(); d.setHours(0,0,0,0); return d; }
  function addDays(base,n){ var d=new Date(base.getTime()); d.setDate(d.getDate()+n); return d; }
  function pad(n){ return (n<10?'0':'')+n; }
  function iso(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }

  function parseDateOnly(s){
    if(s==null || s==='') return null;
    if(s instanceof Date) return isNaN(s.getTime()) ? null : s;
    if(typeof s==='number'){ var dn=new Date(s); if(isNaN(dn.getTime())) return null; dn.setHours(0,0,0,0); return dn; }
    var m=String(s).slice(0,10).split('-');
    if(m.length<3) return null;
    var d=new Date(+m[0], (+m[1]||1)-1, +m[2]||1);
    return isNaN(d.getTime()) ? null : d;
  }
  function dayDiff(s){ var d=parseDateOnly(s); if(!d) return NaN; return Math.round((d.getTime()-today().getTime())/86400000); }
  function short(s){ var d=parseDateOnly(s); return d ? MONTHS[d.getMonth()]+' '+d.getDate() : '—'; }
  function shortYear(s){ var d=parseDateOnly(s); return d ? MONTHS[d.getMonth()]+' '+d.getDate()+", '"+String(d.getFullYear()).slice(2) : '—'; }
  function withDow(s){ var d=parseDateOnly(s); return d ? DAYS[d.getDay()]+', '+MONTHS[d.getMonth()]+' '+d.getDate() : '—'; }
  function label(s){
    var n=dayDiff(s);
    if(isNaN(n)) return 'Not scheduled';
    if(n===0) return 'Today'; if(n===1) return 'Tomorrow'; if(n===-1) return 'Yesterday';
    return withDow(s);
  }
  function relative(s){
    var n=dayDiff(s); if(isNaN(n)) return '—';
    if(n===0) return 'due today'; if(n===1) return 'due tomorrow'; if(n===-1) return '1 day overdue';
    if(n<0) return Math.abs(n)+' days overdue'; if(n<=7) return 'in '+n+' days';
    return short(s);
  }
  function timeAgo(ts){
    if(!ts) return '—';
    var diff=Date.now()-ts; if(diff<0) diff=0;
    var m=Math.floor(diff/60000);
    if(m<1) return 'just now'; if(m<60) return m+'m ago';
    var h=Math.floor(m/60); if(h<24) return h+'h ago';
    var d=Math.floor(h/24); if(d===1) return 'yesterday'; if(d<7) return d+'d ago';
    var dt=new Date(ts); return MONTHS[dt.getMonth()]+' '+dt.getDate();
  }
  function clock(ts){ var d=new Date(ts); var h=d.getHours(); var mm=pad(d.getMinutes()); var ap=h>=12?'pm':'am'; h=h%12||12; return h+':'+mm+ap; }
  function stamp(ts){ var d=new Date(ts); return MONTHS[d.getMonth()]+' '+d.getDate()+' · '+clock(ts); }
  function dayKey(ts){ var d=new Date(ts); d.setHours(0,0,0,0); return d.getTime(); }
  function greeting(){ var h=new Date().getHours(); if(h<12) return 'Good morning'; if(h<17) return 'Good afternoon'; return 'Good evening'; }
  function fullToday(){ var d=new Date(); return DAYS[d.getDay()]+', '+MONTHS[d.getMonth()]+' '+d.getDate(); }

  function resolve(node){
    var t0=today(), now=Date.now();
    function conv(v){
      if(typeof v!=='string') return undefined;
      if(DATE_TOKEN.test(v)) return iso(addDays(t0, parseInt(v.slice(1),10)));
      var m=v.match(TIME_TOKEN);
      if(m){
        var n=parseInt(m[1],10);
        if(m[2]==='h') return now-n*3600000;
        if(m[2]==='m') return now-n*60000;
        return now-n*86400000;
      }
      return undefined;
    }
    (function walk(o){
      if(!o || typeof o!=='object') return;
      if(Object.prototype.toString.call(o)==='[object Array]'){
        for(var i=0;i<o.length;i++){ var r=conv(o[i]); if(r!==undefined) o[i]=r; else walk(o[i]); }
        return;
      }
      for(var k in o){
        if(!Object.prototype.hasOwnProperty.call(o,k)) continue;
        var rv=conv(o[k]); if(rv!==undefined) o[k]=rv; else walk(o[k]);
      }
    })(node);
    return node;
  }

  return { today:today, addDays:addDays, iso:iso, parseDateOnly:parseDateOnly, dayDiff:dayDiff,
    short:short, shortYear:shortYear, withDow:withDow, label:label, relative:relative, timeAgo:timeAgo,
    clock:clock, stamp:stamp, dayKey:dayKey, greeting:greeting, fullToday:fullToday, resolve:resolve,
    MONTHS:MONTHS, DAYS:DAYS };
})();

/* ============================================================================
   2. DATA DOCUMENT — content of /data/crm.json (inlined for the prototype)
   ============================================================================ */
var CRM_SEED_DOCUMENT = {
  meta:{
    brand:'SHALVADZE', owner:'Taha', ownerRole:'Founder',
    sourceType:'LOCAL_JSON', sourceLabel:'/data/crm.json', endpoint:null,
    schemaVersion:'1.0.1', generatedAt:'T-2m',
    focusMarkets:['Australia','New Zealand'], readOnly:true,
    cadence:['Initial','D4','D10','D20','Monthly (15th)']
  },

  companies:[
    { id:'maxim', crmId:'SV-AU-014', name:'Maxim Office Group', country:'Australia', countryCode:'AU',
      buyerType:'Office & school products wholesaler / importer', priority:'High',
      status:'Active Opportunity', pipelineStage:'Active Opportunity', stage:'Opportunity',
      commercialFit:'High', opportunityId:'opp-maxim',
      about:'National office and school products wholesaler supplying independent stationers, office retailers and educational resellers across Australia. Operates own-brand ranges alongside distributed international brands.',
      categories:['Sharpeners','Pencil cases','Student scissors','Desk organisation','Back-to-school ranges'],
      tags:['Back-to-school','Own brand','High volume','2027 programme'],
      nextAction:{label:'Review buyer response / follow up if no response', date:'D+10', type:'OPPORTUNITY_REVIEW'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Named decision maker engaged', detail:'Lloyd Dunn, General Manager, responded directly to outreach and requested indicative pricing on three product families.', source:'Gmail thread · Outreach Agent', date:'D-9'},
        {type:'VERIFIED_FACT', title:'Imports own-brand product from China', detail:'Import records show recurring shipments of own-brand plastic stationery from Guangdong and Zhejiang suppliers into Melbourne.', source:'Import records review', date:'D-21'},
        {type:'VERIFIED_FACT', title:'Product families confirmed', detail:'Plastic and metal sharpeners, pencil cases and student scissors explicitly discussed for a 2027 programme.', source:'Buyer email · Gmail', date:'D-9'},
        {type:'OBSERVATION', title:'Annual range refresh cycle', detail:'Back-to-school ranges appear to be finalised roughly 12–15 months ahead of season, with sampling windows in Q1–Q2.', source:'Website archive + range history', date:'D-21'},
        {type:'HYPOTHESIS', title:'Second-source opening on metal sharpeners', detail:'Current metal sharpener supply may be single-sourced with limited capacity. A qualified second source with tighter lead time could win the line without displacing the whole programme.', source:'SHALVADZE analysis — not verified with buyer', date:'D-14'},
        {type:'UNKNOWN', title:'Annual volume and target FOB', detail:'Volumes per SKU, current FOB pricing and payment terms have not been disclosed.', source:'Research required', date:'D-9'}
      ],
      productOpportunity:{
        angle:'Lead with the PP plastic and metal sharpener family where SHALVADZE has direct factory depth, then bundle pencil cases and student scissors into one consolidated back-to-school programme.',
        products:['Plastic sharpeners (single + twin hole)','Metal sharpeners','PP pencil cases (zip / flap / box)','Student scissors (blunt tip, 5" / 6")'],
        sourcing:'Two-factory shortlist per family, target-price build against buyer retail point, sample round with SHALVADZE QC sign-off, consolidated FCL into Melbourne.',
        concern:'Buyer timing is 2027 — long horizon. Risk is going quiet; needs a light, scheduled review cadence rather than frequent chasing. Packaging artwork approvals may sit with their brand team, not Lloyd directly.'
      },
      outreach:{ sequence:'OPPORTUNITY', superseded:true,
        note:'Cold sequence superseded — live buyer conversation. No automated D4/D10/D20 follow-ups.',
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-31', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'SUPERSEDED', date:'D-27', evidence:'Superseded by buyer reply'},
          {key:'REPLY', label:'Buyer reply', state:'COMPLETED', date:'D-9', evidence:'Gmail · received'},
          {key:'OPP', label:'Opportunity', state:'CURRENT', date:'D+10', evidence:'Await buyer direction'}
        ]},
      notes:'Do not place Maxim in the normal cold sequence. All contact is buyer-led until direction is received.' },

    { id:'modish', crmId:'SV-AU-021', name:'Modish Australia', country:'Australia', countryCode:'AU',
      buyerType:'Gift & lifestyle distributor / private label developer', priority:'High',
      status:'Draft Ready', pipelineStage:'Draft Ready', stage:'Initial',
      commercialFit:'High', altName:'Future Brand Products',
      about:'Distributor and private-label developer behind Future Brand Products. Supplies gift, lifestyle and homewares ranges to independent retail, department and boutique channels across Australia and New Zealand.',
      categories:['Drinkware','Bags & cases','Accessories','Promotional gift lines','Desk accessories'],
      tags:['Private label','Range developer','AU + NZ'],
      nextAction:{label:'Founder Review — approve initial outreach', date:'D+0', type:'INITIAL'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Develops own brands', detail:'Future Brand Products is presented as an in-house brand development arm with multiple registered lifestyle labels.', source:'Company website · About / Brands', date:'D-4'},
        {type:'VERIFIED_FACT', title:'Imports finished goods', detail:'Import records indicate regular inbound consignments of giftware and drinkware from China.', source:'Import records review', date:'D-6'},
        {type:'OBSERVATION', title:'Range-led buying behaviour', detail:'Ranges appear to be built seasonally in coordinated colour stories, which suits multi-SKU consolidated sourcing.', source:'Catalogue + retail listings', date:'D-4'},
        {type:'HYPOTHESIS', title:'Desk accessory gap', detail:'Their gift ranges show limited desk / stationery adjacency. A PP desk-organiser capsule could be an easy new line for them.', source:'SHALVADZE analysis — not verified', date:'D-3'},
        {type:'UNKNOWN', title:'Purchasing contact name', detail:'Only a role inbox has been identified. Named buyer, title and decision path unconfirmed.', source:'Research required', date:'D-2'}
      ],
      productOpportunity:{
        angle:'Open on private-label development capability: target-price build, factory shortlisting, sampling and QC under one roof — positioned as an extension of their own brand team, not a catalogue supplier.',
        products:['PP desk organisers','Pencil cases / pouches','Drinkware (private label)','Bags & cases','Promotional gift sets'],
        sourcing:'Sample-led approach: propose two comparable programmes with indicative FOB and MOQ, then a paid sample round.',
        concern:'No named contact yet — initial email goes to a role inbox and may be filtered. Gift margins are tight; expect target-price pressure on first enquiry.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'CURRENT', date:'D+0', evidence:'Awaiting founder approval'},
          {key:'D4', label:'D4', state:'SCHEDULED', date:'D+4', evidence:'Draft prepared'},
          {key:'D10', label:'D10', state:'SCHEDULED', date:'D+10', evidence:'Draft prepared'},
          {key:'D20', label:'D20', state:'SCHEDULED', date:'D+20', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'Founder to approve subject line and the two comparable programmes referenced in the body.' },

    { id:'envon', crmId:'SV-AU-025', name:'Envon Pet Supplies', country:'Australia', countryCode:'AU',
      buyerType:'Pet supplies wholesaler / private label', priority:'High',
      status:'Buyer Conversation', pipelineStage:'Buyer Conversation', stage:'Buyer Replied',
      commercialFit:'High', opportunityId:'opp-envon',
      about:'Wholesale pet supplies business supplying independent pet retailers and garden centres. Runs a growing own-brand range and is actively reviewing Asian supply for bowls, feeding accessories and travel lines.',
      categories:['Pet bowls & feeding','Pet travel & carriers','Pet accessories','Private label packaging'],
      tags:['Buyer replied','Own brand','Sampling stage'],
      nextAction:{label:'Review buyer response / send quotation recap', date:'D+0', type:'BUYER_REVIEW'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Requested FOB pricing and MOQ', detail:'Sarah Whitcombe asked for FOB pricing, MOQ and lead time on three feeding SKUs and indicated interest in a private-label bowl set.', source:'Gmail · buyer reply', date:'D-1'},
        {type:'VERIFIED_FACT', title:'Distributes to independent retail', detail:'Retailer locator and stockist listings confirm wholesale distribution across AU independent pet and garden channels.', source:'Company website', date:'D-12'},
        {type:'OBSERVATION', title:'Own-brand packaging in transition', detail:'Current own-brand packaging looks inconsistent across ranges — suggests an active refresh or a supplier change.', source:'Retail shelf + web imagery', date:'D-12'},
        {type:'HYPOTHESIS', title:'Price-sensitive on bowls', detail:'Bowl category is highly commoditised; they are likely benchmarking us against an existing supplier on price per unit rather than service.', source:'SHALVADZE analysis — not verified', date:'D-5'},
        {type:'UNKNOWN', title:'Order volume and cadence', detail:'No indication of annual volume or reorder frequency yet.', source:'Discovery question — next email', date:'D-1'}
      ],
      productOpportunity:{
        angle:'Move fast from enquiry to a costed sample: quotation recap with clear FOB / MOQ / lead time tiers, plus one value-engineering option per SKU to show sourcing depth.',
        products:['Stainless + PP pet bowls','Slow-feeder bowls','Collapsible travel bowls','Pet carrier bags','Private-label packaging'],
        sourcing:'Three-factory quote round in Guangdong, target-price build against their retail point, sample kit with SHALVADZE QC report.',
        concern:'Fast-moving conversation — delay risks losing the thread to an incumbent. Retail season for pet gifting starts early Q4; sampling must close before then.'
      },
      outreach:{ sequence:'COLD', superseded:true,
        note:'Buyer replied — cold sequence superseded. Conversation is now buyer-led with quotation follow-ups.',
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-16', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-12', evidence:'Gmail · sent'},
          {key:'REPLY', label:'Buyer reply', state:'COMPLETED', date:'D-1', evidence:'Gmail · received'},
          {key:'QUOTE', label:'Quote recap', state:'CURRENT', date:'D+0', evidence:'Draft approved — awaiting send'}
        ]},
      notes:'Quotation recap is approved and awaiting manual send by the Outreach Agent in Gmail.' },

    { id:'axis', crmId:'SV-AU-009', name:'Axis Toys & Gifts', country:'Australia', countryCode:'AU',
      buyerType:'Toy & gift wholesaler / importer', priority:'High',
      status:'Outreach In Progress', pipelineStage:'D4', stage:'D4',
      commercialFit:'High',
      about:'Importer and wholesaler of toys, gifts and novelty lines supplying independent toy retailers, gift stores and variety channels nationally.',
      categories:['Toys','Novelty gifts','Promotional toys','Bags & cases','Drinkware'],
      tags:['Toy safety compliance','Range buyer'],
      nextAction:{label:'D4 follow-up — send approved draft', date:'D+2', type:'D4'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Imports toys from China', detail:'Import records show frequent inbound toy consignments from Guangdong and Shantou suppliers.', source:'Import records review', date:'D-18'},
        {type:'VERIFIED_FACT', title:'Compliance aware', detail:'Website and job listings reference mandatory toy safety standards (AS/NZS ISO 8124) testing on imported lines.', source:'Company website / careers', date:'D-18'},
        {type:'OBSERVATION', title:'Seasonal buying peaks', detail:'Range updates cluster around Christmas and Easter buying windows.', source:'Catalogue history', date:'D-18'},
        {type:'HYPOTHESIS', title:'Opportunity in non-electronic plastic lines', detail:'Their catalogue is heavy on electronic novelty; simple injection-moulded play sets may be under-developed and easier to source well.', source:'SHALVADZE analysis — not verified', date:'D-9'},
        {type:'UNKNOWN', title:'Category buyer identity', detail:'Initial email went to a general enquiries address. Named category buyer unconfirmed.', source:'Research required', date:'D-9'}
      ],
      productOpportunity:{
        angle:'Position SHALVADZE as the compliance-safe sourcing partner: factory vetting, tested to AS/NZS ISO 8124, full documentation pack with every shipment.',
        products:['Injection-moulded play sets','Novelty toys','PP storage / carry cases','Promotional toys','Drinkware for kids ranges'],
        sourcing:'Supplier shortlist with existing test reports, target-price build, pre-shipment inspection standard.',
        concern:'Toy category carries high compliance risk. Any quotation must include testing cost, not hide it.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-9', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'CURRENT', date:'D+2', evidence:'Draft approved'},
          {key:'D10', label:'D10', state:'SCHEDULED', date:'D+8', evidence:'Draft prepared'},
          {key:'D20', label:'D20', state:'SCHEDULED', date:'D+18', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'D4 references the compliance documentation pack — keep that as the differentiator.' },

    { id:'avalon', crmId:'SV-AU-003', name:'Avalon International', country:'Australia', countryCode:'AU',
      buyerType:'Stationery, gift & licence importer', priority:'High',
      status:'Outreach In Progress', pipelineStage:'D10', stage:'D10',
      commercialFit:'High',
      about:'Long-established importer and distributor of stationery, gift and licensed product ranges into Australian mass retail, independents and educational channels.',
      categories:['PP stationery','School supplies','Licensed product','Gift packaging','Office accessories'],
      tags:['Mass retail','Licensing','Core category'],
      nextAction:{label:'D10 follow-up — value angle refresh', date:'D+5', type:'D10'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Core category overlap', detail:'Ranges directly overlap SHALVADZE deepest expertise: PP plastic stationery, school and office products.', source:'Catalogue + website', date:'D-26'},
        {type:'VERIFIED_FACT', title:'Large-scale importing', detail:'Import records show high-volume, multi-supplier inbound container activity.', source:'Import records review', date:'D-26'},
        {type:'OBSERVATION', title:'Licensed ranges require audit trail', detail:'Licensed product implies factory audit and approval requirements — a barrier for weak suppliers, an advantage for a compliant one.', source:'Brand partnership listings', date:'D-26'},
        {type:'HYPOTHESIS', title:'Cost-down pressure on PP lines', detail:'PP resin and freight volatility usually pushes mass retailers to re-tender PP stationery annually. Their line may be open to a cost-down quote.', source:'SHALVADZE analysis — not verified', date:'D-20'},
        {type:'UNKNOWN', title:'Sourcing structure', detail:'Unclear whether sourcing is in-house, via an agent, or direct from factories.', source:'Research required', date:'D-20'}
      ],
      productOpportunity:{
        angle:'Cost-down offer on an existing PP stationery line: same spec, audited factory, better FOB — plus documented compliance for licensed programmes.',
        products:['PP folders & document wallets','Pencil cases','Desk trays and organisers','School supply sets','Office accessories'],
        sourcing:'Existing-spec cost-down study, alternative supplier options, factory audit pack for licensing approval.',
        concern:'Large importer with entrenched suppliers. Realistic entry is a single trial line, not a range.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-20', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-16', evidence:'Gmail · sent'},
          {key:'D10', label:'D10', state:'CURRENT', date:'D+5', evidence:'Draft in progress'},
          {key:'D20', label:'D20', state:'SCHEDULED', date:'D+15', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'Highest category fit in the AU book. Worth a founder-authored note at D20 if D10 is silent.' },

    { id:'koru', crmId:'SV-NZ-014', name:'Koru Kids', country:'New Zealand', countryCode:'NZ',
      buyerType:"Children's retail chain / merchandise buyer", priority:'High',
      status:'Buyer Conversation', pipelineStage:'Buyer Conversation', stage:'Buyer Replied',
      commercialFit:'High', opportunityId:'opp-koru',
      about:"New Zealand children's retail chain with school, play and back-to-school merchandise ranges across physical stores and e-commerce.",
      categories:['School supplies','PP stationery','Bags & cases','Drinkware','Toys'],
      tags:['Buyer replied','Back-to-school','NZ'],
      nextAction:{label:'Reply to buyer — sample kit proposal', date:'D+3', type:'BUYER_REVIEW'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Buyer engaged with reply', detail:'Daniel Ng (Head of Merchandise) replied asking about MOQ flexibility and NZ back-to-school timing.', source:'Gmail · buyer reply', date:'D-2'},
        {type:'VERIFIED_FACT', title:'Runs back-to-school programme', detail:'Public seasonal marketing confirms an annual back-to-school range with school stationery at the core.', source:'Retail marketing / web', date:'D-14'},
        {type:'OBSERVATION', title:'Smaller volumes than AU mass retail', detail:'Store count implies moderate volumes; mixed-SKU consolidation matters more than pure unit price.', source:'Store locator', date:'D-14'},
        {type:'HYPOTHESIS', title:'Consolidation is the win', detail:'They may currently buy school ranges from two or three suppliers. A single consolidated programme from SHALVADZE could reduce their freight and admin cost.', source:'SHALVADZE analysis — not verified', date:'D-8'},
        {type:'UNKNOWN', title:'Budget owner', detail:'Whether merchandise budget sits with Daniel or a separate purchasing manager.', source:'Discovery question', date:'D-2'}
      ],
      productOpportunity:{
        angle:'Consolidated NZ back-to-school programme: stationery sets, pencil cases, drinkware and bags shipped as one consolidated order timed for NZ term start.',
        products:['School stationery sets','PP pencil cases','Kids drinkware','School bags','Name labels & accessories'],
        sourcing:'Mixed-SKU consolidation, staggered production to hit NZ shipping windows, sample kit with retail-ready packaging options.',
        concern:'NZ freight economics on lower-volume orders. Must quote landed cost thinking, not just FOB.'
      },
      outreach:{ sequence:'COLD', superseded:true,
        note:'Buyer replied — cold sequence superseded; conversation-led follow-up only.',
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-14', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'SUPERSEDED', date:'D-10', evidence:'Superseded by buyer reply'},
          {key:'REPLY', label:'Buyer reply', state:'COMPLETED', date:'D-2', evidence:'Gmail · received'},
          {key:'QUOTE', label:'Sample proposal', state:'CURRENT', date:'D+3', evidence:'Draft ready for review'}
        ]},
      notes:'Keep timing conversation anchored to NZ school term dates.' },

    { id:'pgnz', crmId:'SV-NZ-006', name:'PGNZ Wholesale', country:'New Zealand', countryCode:'NZ',
      buyerType:'General merchandise wholesaler', priority:'High',
      status:'Draft Ready', pipelineStage:'Draft Ready', stage:'Initial',
      commercialFit:'Medium-High',
      about:'New Zealand general merchandise wholesaler supplying retailers across stationery, household, gift and promotional categories.',
      categories:['Stationery','Household','Promotional products','Drinkware','Accessories'],
      tags:['NZ','Multi-category'],
      nextAction:{label:'Founder Review — approve initial outreach', date:'D+1', type:'INITIAL'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Wholesale distribution confirmed', detail:'Trade-only wholesale model with retailer registration and catalogue distribution.', source:'Company website', date:'D-7'},
        {type:'OBSERVATION', title:'Broad but shallow range', detail:'Catalogue spans many categories with limited depth per category — typical of a reseller buying through intermediaries.', source:'Catalogue review', date:'D-7'},
        {type:'HYPOTHESIS', title:'Intermediary margin available', detail:'If they buy via AU agents today, direct China sourcing with SHALVADZE could release meaningful margin for them.', source:'SHALVADZE analysis — not verified', date:'D-5'},
        {type:'UNKNOWN', title:'Import capability', detail:'No evidence yet that they import directly or handle customs themselves.', source:'Research required', date:'D-5'}
      ],
      productOpportunity:{
        angle:'Direct-from-factory alternative to AU intermediary buying, starting with one fast-moving stationery category to prove the model.',
        products:['PP stationery','Desk accessories','Drinkware','Promotional products'],
        sourcing:'Landed-cost modelling for NZ, small-FCL / LCL consolidation support.',
        concern:'Smaller order sizes may not justify full container; needs LCL-friendly packaging plan.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'CURRENT', date:'D+1', evidence:'Awaiting founder approval'},
          {key:'D4', label:'D4', state:'SCHEDULED', date:'D+5', evidence:'Not drafted'},
          {key:'D10', label:'D10', state:'SCHEDULED', date:'D+11', evidence:'Not drafted'},
          {key:'D20', label:'D20', state:'SCHEDULED', date:'D+21', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'' },

    { id:'ugames', crmId:'SV-AU-017', name:'U. Games Australia', country:'Australia', countryCode:'AU',
      buyerType:'Games, novelty & gift distributor', priority:'Medium',
      status:'Outreach In Progress', pipelineStage:'D20', stage:'D20',
      commercialFit:'Medium',
      about:'Distributor of games, puzzles, novelty and gift lines into retail, tourism and entertainment channels across Australia.',
      categories:['Games & puzzles','Novelty gifts','Promotional products','Packaging'],
      tags:['Novelty','Tourism retail'],
      nextAction:{label:'D20 final touch — then move to monthly', date:'D+13', type:'D20'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Active importer', detail:'Import records confirm inbound games and novelty consignments.', source:'Import records review', date:'D-30'},
        {type:'OBSERVATION', title:'Packaging-led differentiation', detail:'Their retail presentation relies heavily on printed packaging and gift boxing.', source:'Retail listings', date:'D-30'},
        {type:'HYPOTHESIS', title:'Packaging cost-down entry point', detail:'A packaging and print cost-down offer may be an easier first conversation than the product itself.', source:'SHALVADZE analysis — not verified', date:'D-25'},
        {type:'UNKNOWN', title:'Category relevance to PP stationery', detail:'Limited obvious overlap with core SHALVADZE stationery expertise.', source:'Research required', date:'D-25'}
      ],
      productOpportunity:{
        angle:'Packaging, print and simple plastic components rather than full product supply.',
        products:['Gift boxes & packaging','Plastic game components','PP storage trays','Promotional novelty items'],
        sourcing:'Print + plastics combined sourcing, artwork-to-production management.',
        concern:'Weaker category fit. Keep effort proportionate — do not over-invest before a reply.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-25', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-21', evidence:'Gmail · sent'},
          {key:'D10', label:'D10', state:'COMPLETED', date:'D-15', evidence:'Gmail · sent'},
          {key:'D20', label:'D20', state:'CURRENT', date:'D+13', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'SCHEDULED', date:'D+26', evidence:'Moves to monthly after D20'}
        ]},
      notes:'If D20 is silent, move to monthly re-engagement on the 15th.' },

    { id:'meridian', crmId:'SV-AU-011', name:'Meridian Office & Print', country:'Australia', countryCode:'AU',
      buyerType:'Office products reseller / print supplies', priority:'Medium',
      status:'Outreach In Progress', pipelineStage:'Monthly', stage:'Monthly',
      commercialFit:'Medium',
      about:'Office products reseller and print supplies business serving SMB and corporate accounts with recurring consumable ordering.',
      categories:['Office accessories','PP stationery','Print consumables','Desk organisation'],
      tags:['Monthly re-engagement','Completed cadence'],
      nextAction:{label:'Monthly re-engagement — new range angle', date:'D+8', type:'MONTHLY'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Completed full cold cadence with no reply', detail:'Initial, D4, D10 and D20 all sent and verified in Gmail with no buyer response.', source:'Gmail · activity history', date:'D-12'},
        {type:'OBSERVATION', title:'Recurring consumable demand', detail:'Reseller model implies steady repeat demand for desk and office accessories.', source:'Business model review', date:'D-40'},
        {type:'UNKNOWN', title:'Current supplier arrangement', detail:'Unknown whether they buy via a national wholesaler or direct.', source:'Research required', date:'D-12'}
      ],
      productOpportunity:{
        angle:'Monthly touch with one specific, costed idea rather than a generic check-in.',
        products:['PP document wallets','Desk organisers','Office accessory bundles'],
        sourcing:'Small-batch consolidation via a national wholesaler relationship if direct import is not viable.',
        concern:'Low engagement probability. Keep monthly, keep cheap, keep useful.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-62', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-58', evidence:'Gmail · sent'},
          {key:'D10', label:'D10', state:'COMPLETED', date:'D-52', evidence:'Gmail · sent'},
          {key:'D20', label:'D20', state:'COMPLETED', date:'D-42', evidence:'Gmail · sent'},
          {key:'MONTHLY', label:'Monthly', state:'CURRENT', date:'D+8', evidence:'Scheduled on the 15th'}
        ]},
      notes:'' },

    { id:'pinnacle', crmId:'SV-AU-022', name:'Pinnacle Learning Supplies', country:'Australia', countryCode:'AU',
      buyerType:'Education & school supplies distributor', priority:'Medium',
      status:'Outreach In Progress', pipelineStage:'D20', stage:'D20',
      commercialFit:'High',
      about:'Distributor of classroom and school supplies to independent schools, education resellers and childcare groups.',
      categories:['School supplies','PP stationery','Classroom storage','Student scissors','Arts & craft'],
      tags:['Education','Core category','Overdue'],
      nextAction:{label:'D20 follow-up — overdue', date:'D-2', type:'D20'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Direct category match', detail:'Classroom supplies include PP stationery, scissors and storage — SHALVADZE core expertise.', source:'Catalogue review', date:'D-32'},
        {type:'VERIFIED_FACT', title:'Two outreach touches sent', detail:'Initial and D10 sent and verified; no reply recorded.', source:'Gmail · activity history', date:'D-18'},
        {type:'OBSERVATION', title:'Term-based purchasing', detail:'School purchasing follows term calendars with bulk ordering before term start.', source:'Sector knowledge', date:'D-32'},
        {type:'UNKNOWN', title:'Decision maker', detail:'Named purchasing contact not yet identified.', source:'Research required', date:'D-18'}
      ],
      productOpportunity:{
        angle:'Classroom bulk packs: student scissors, PP storage and stationery sets built to per-classroom quantities.',
        products:['Student scissors','PP classroom storage','Stationery sets','Arts & craft consumables'],
        sourcing:'Bulk-pack configuration, school-safe specification, term-aligned production windows.',
        concern:'Long sales cycle tied to school budgets. D20 is overdue — send or consciously deprioritise.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-30', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-26', evidence:'Gmail · sent'},
          {key:'D10', label:'D10', state:'COMPLETED', date:'D-20', evidence:'Gmail · sent'},
          {key:'D20', label:'D20', state:'CURRENT', date:'D-2', evidence:'Overdue'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'' },

    { id:'crestview', crmId:'SV-AU-028', name:'Crestview Giftware', country:'Australia', countryCode:'AU',
      buyerType:'Giftware importer / retail supplier', priority:'Medium',
      status:'Outreach In Progress', pipelineStage:'Initial Sent', stage:'Initial',
      commercialFit:'Medium',
      about:'Giftware importer supplying homewares, gift and lifestyle ranges to department stores and independent gift retail.',
      categories:['Drinkware','Bags & cases','Accessories','Gift packaging','Textile gift lines'],
      tags:['Overdue','Giftware'],
      nextAction:{label:'Initial outreach — overdue send', date:'D-1', type:'INITIAL'},
      intelligence:[
        {type:'OBSERVATION', title:'Range refreshed twice yearly', detail:'Seasonal gift drops suggest structured buying windows.', source:'Catalogue + social', date:'D-11'},
        {type:'HYPOTHESIS', title:'Drinkware line could be private labelled', detail:'Several drinkware lines look like generic imported product that could be upgraded to their own brand.', source:'SHALVADZE analysis — not verified', date:'D-11'},
        {type:'UNKNOWN', title:'Buying contact and import model', detail:'No named buyer, no import evidence reviewed yet.', source:'Research required', date:'D-11'}
      ],
      productOpportunity:{
        angle:'Private-label drinkware and gift accessories with retail-ready packaging.',
        products:['Drinkware','Gift boxes','Bags & pouches','Accessories'],
        sourcing:'Factory shortlist, packaging design-to-production, consolidated seasonal shipments.',
        concern:'Research is thin — complete intelligence before investing drafting time beyond initial.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'INITIAL', label:'Initial', state:'CURRENT', date:'D-1', evidence:'Overdue — not yet sent'},
          {key:'D4', label:'D4', state:'SCHEDULED', date:'D+3', evidence:'Not drafted'},
          {key:'D10', label:'D10', state:'SCHEDULED', date:'D+9', evidence:'Not drafted'},
          {key:'D20', label:'D20', state:'SCHEDULED', date:'D+19', evidence:'Not drafted'},
          {key:'MONTHLY', label:'Monthly', state:'NOT_STARTED', date:null, evidence:'15th of month'}
        ]},
      notes:'' },

    { id:'southern', crmId:'SV-NZ-009', name:'Southern Cross Promotions', country:'New Zealand', countryCode:'NZ',
      buyerType:'Promotional products supplier', priority:'Medium',
      status:'Research', pipelineStage:'Research', stage:'Research',
      commercialFit:'Medium',
      about:'New Zealand promotional products and branded merchandise supplier serving corporate, events and agency clients.',
      categories:['Promotional products','Drinkware','Bags & cases','Accessories','Apparel'],
      tags:['Research stage','NZ','Promo'],
      nextAction:{label:'Complete company intelligence review', date:'D+16', type:'RESEARCH'},
      intelligence:[
        {type:'OBSERVATION', title:'Agency-led ordering', detail:'Promo suppliers typically order short-run, deadline-driven product — needs fast sampling and reliable air/sea mix.', source:'Sector knowledge', date:'D-3'},
        {type:'UNKNOWN', title:'Import directness', detail:'Not yet established whether they import direct or buy through AU promo wholesalers.', source:'Research required', date:'D-3'},
        {type:'UNKNOWN', title:'Category depth', detail:'Range breadth versus manufacturing depth not yet assessed.', source:'Research required', date:'D-3'}
      ],
      productOpportunity:{
        angle:'Fast-turn branded drinkware and bags with reliable short-run production — the core pain point of promo suppliers.',
        products:['Branded drinkware','Bags & cases','Promotional accessories','Apparel'],
        sourcing:'Short-run capable factories, rapid sampling, mixed air/sea logistics planning.',
        concern:'Still in research — do not draft outreach until intelligence is completed.'
      },
      outreach:{ sequence:'COLD', superseded:false,
        steps:[
          {key:'RESEARCH', label:'Research', state:'CURRENT', date:'D+16', evidence:'Intelligence incomplete'},
          {key:'INITIAL', label:'Initial', state:'NOT_STARTED', date:null, evidence:'Blocked until approved'},
          {key:'D4', label:'D4', state:'NOT_STARTED', date:null, evidence:''},
          {key:'D10', label:'D10', state:'NOT_STARTED', date:null, evidence:''}
        ]},
      notes:'Approve for outreach once import model and category depth are verified.' },

    { id:'harbour', crmId:'SV-NZ-011', name:'Harbour Stationery Co.', country:'New Zealand', countryCode:'NZ',
      buyerType:'Stationery retailer / e-commerce', priority:'Low',
      status:'Nurture', pipelineStage:'Nurture', stage:'Nurture',
      commercialFit:'Low-Medium',
      about:'Independent New Zealand stationery retailer with a strong e-commerce presence and curated brand mix.',
      categories:['PP stationery','Notebooks','Desk accessories','Gift stationery'],
      tags:['Nurture','No active outreach'],
      nextAction:{label:'Nurture — no active outreach scheduled', date:null, type:'NURTURE'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Buying model too small for direct import', detail:'Buyer confirmed order volumes sit below viable direct-import MOQ for our factory partners.', source:'Buyer email · Gmail', date:'D-34'},
        {type:'OBSERVATION', title:'Good brand fit, wrong scale (for now)', detail:'Category fit is strong; scale is the only barrier.', source:'SHALVADZE assessment', date:'D-34'},
        {type:'HYPOTHESIS', title:'May become viable via consolidation', detail:'If we run a consolidated NZ stationery programme, small retailers could join a shared container.', source:'SHALVADZE analysis — not verified', date:'D-30'}
      ],
      productOpportunity:{
        angle:'Future consolidated NZ programme participant — not a direct sourcing client today.',
        products:['PP stationery','Desk accessories'],
        sourcing:'Revisit if a shared-container NZ programme is launched.',
        concern:'No active outreach. Nurture only — do not send cadence emails.'
      },
      outreach:{ sequence:'COLD', superseded:true, paused:true,
        note:'NURTURE — all future cadence actions are suppressed. Completed history remains visible.',
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-70', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'COMPLETED', date:'D-66', evidence:'Gmail · sent'},
          {key:'REPLY', label:'Buyer reply', state:'COMPLETED', date:'D-34', evidence:'Gmail · received'},
          {key:'NURTURE', label:'Nurture', state:'PAUSED', date:null, evidence:'Suppressed by rule'}
        ]},
      notes:'Review at Q1 range planning; do not add to monthly cadence until scale changes.' },

    { id:'nxp', crmId:'SV-NZ-002', name:'NXP', country:'New Zealand', countryCode:'NZ',
      buyerType:'Promotional products & print group', priority:'Low',
      status:'Strategic Hold', pipelineStage:'Strategic Hold', stage:'On Hold',
      commercialFit:'Unknown',
      about:'New Zealand promotional products and print group. Placed on strategic hold pending clarity on channel conflict with existing SHALVADZE relationships.',
      categories:['Promotional products','Print','Apparel'],
      tags:['Strategic hold','Channel conflict'],
      nextAction:{label:'Strategic hold — founder decision required', date:null, type:'HOLD'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Placed on hold by founder', detail:'Hold applied to avoid potential conflict with an existing NZ promotional relationship.', source:'CRM status change · Founder', date:'D-19'},
        {type:'UNKNOWN', title:'Commercial potential', detail:'Not assessed — research paused while on hold.', source:'Paused', date:'D-19'}
      ],
      productOpportunity:{ angle:'None while on hold.', products:[], sourcing:'Not assessed.',
        concern:'Do not contact until the founder releases the strategic hold.' },
      outreach:{ sequence:'COLD', superseded:true, paused:true,
        note:'STRATEGIC HOLD — outreach suppressed. Drafts cancelled.',
        steps:[
          {key:'INITIAL', label:'Initial', state:'COMPLETED', date:'D-48', evidence:'Gmail · sent'},
          {key:'D4', label:'D4', state:'CANCELLED', date:'D-44', evidence:'Cancelled — strategic hold'},
          {key:'HOLD', label:'Hold', state:'PAUSED', date:null, evidence:'Founder decision required'}
        ]},
      notes:'' },

    { id:'brightline', crmId:'SV-AU-001', name:'Brightline Office Supplies', country:'Australia', countryCode:'AU',
      buyerType:'Office products national wholesaler', priority:'None',
      status:'Do Not Contact', pipelineStage:'Do Not Contact', stage:'DNC',
      commercialFit:'None',
      about:'National office products wholesaler with an established in-house China sourcing office. Competes directly with SHALVADZE sourcing services in the same channel.',
      categories:['Office products','PP stationery'],
      tags:['Do not contact','In-house sourcing','Channel conflict'],
      nextAction:{label:'Do not contact — permanently suppressed', date:null, type:'DNC'},
      intelligence:[
        {type:'VERIFIED_FACT', title:'Operates own China sourcing office', detail:'Public listings confirm a Guangzhou-based sourcing office and direct factory relationships.', source:'Company website / recruitment', date:'D-55'},
        {type:'VERIFIED_FACT', title:'Marked Do Not Contact', detail:'Founder applied DNC status: no commercial fit and direct channel conflict.', source:'CRM status change · Founder', date:'D-52'}
      ],
      productOpportunity:{ angle:'None. Not a prospect.', products:[], sourcing:'Not applicable.',
        concern:'Permanent suppression — never include in outreach or marketing lists.' },
      outreach:{ sequence:'COLD', superseded:true, paused:true,
        note:'DO NOT CONTACT — all outreach permanently suppressed.',
        steps:[ {key:'DNC', label:'DNC', state:'CANCELLED', date:'D-52', evidence:'Initial draft cancelled'} ]},
      notes:'' }
  ],

  contacts:[
    {id:'ct-lloyd', companyId:'maxim', name:'Lloyd Dunn', title:'General Manager', email:'l.dunn@maximofficegroup.example', phone:'+61 3 9000 0000', country:'Australia', confidence:'VERIFIED', status:'Engaged — active conversation', source:'Buyer email thread (Gmail) + company website', notes:'Responds directly. Prefers concise, costed proposals.'},
    {id:'ct-maxim-2', companyId:'maxim', name:'Priya Anand', title:'Range Manager — School & Stationery', email:'p.anand@maximofficegroup.example', phone:null, country:'Australia', confidence:'LIKELY', status:'Introduced by Lloyd Dunn (cc)', source:'Email cc on buyer thread', notes:'Likely owns range-level decisions. Confirm role before direct approach.'},
    {id:'ct-sarah', companyId:'envon', name:'Sarah Whitcombe', title:'Purchasing Manager', email:'sarah.w@envonpet.example', phone:'+61 2 8000 0000', country:'Australia', confidence:'VERIFIED', status:'Engaged — awaiting quotation recap', source:'Buyer email reply (Gmail)', notes:'Asked for FOB, MOQ and lead time on three feeding SKUs.'},
    {id:'ct-daniel', companyId:'koru', name:'Daniel Ng', title:'Head of Merchandise', email:'daniel@korukids.example', phone:'+64 9 300 0000', country:'New Zealand', confidence:'VERIFIED', status:'Engaged — sample kit discussion', source:'Buyer email reply (Gmail) + LinkedIn', notes:'Focused on MOQ flexibility and NZ term timing.'},
    {id:'ct-modish-role', companyId:'modish', name:null, title:'Purchasing team (role inbox)', email:'purchasing@modishau.example', phone:null, country:'Australia', confidence:'UNCONFIRMED', status:'No named buyer confirmed', source:'Company website contact form', notes:'Do not present as a verified contact. Named buyer research outstanding.'},
    {id:'ct-axis-role', companyId:'axis', name:'Mark Halloran', title:'Director (probable)', email:'info@axistoys.example', phone:'+61 3 8700 0000', country:'Australia', confidence:'LIKELY', status:'Unconfirmed — inferred from company registry', source:'ABN registry + website footer', notes:'Name inferred, not confirmed by direct contact. Verify before using in a greeting.'},
    {id:'ct-avalon-role', companyId:'avalon', name:null, title:'Category buyer (unidentified)', email:'sales@avalonint.example', phone:'+61 2 9900 0000', country:'Australia', confidence:'UNCONFIRMED', status:'No named buyer confirmed', source:'Company website', notes:'Priority research: identify stationery category buyer.'},
    {id:'ct-pgnz', companyId:'pgnz', name:'Rachel Tui', title:'Buyer — General Merchandise', email:'rachel@pgnz.example', phone:'+64 4 500 0000', country:'New Zealand', confidence:'LIKELY', status:'Unconfirmed — from trade directory', source:'NZ trade directory listing', notes:'Directory listing only. Confirm by email before named outreach.'},
    {id:'ct-ugames', companyId:'ugames', name:null, title:'Purchasing (role inbox)', email:'buy@ugames.example', phone:null, country:'Australia', confidence:'UNCONFIRMED', status:'No named buyer confirmed', source:'Company website', notes:''},
    {id:'ct-meridian', companyId:'meridian', name:'Greg Palmer', title:'National Purchasing Manager', email:'g.palmer@meridianoffice.example', phone:'+61 7 3100 0000', country:'Australia', confidence:'LIKELY', status:'Unconfirmed — no reply yet', source:'LinkedIn + company website', notes:'Identified but never engaged. Treat as likely, not verified.'},
    {id:'ct-pinnacle', companyId:'pinnacle', name:null, title:'Procurement (role inbox)', email:'procurement@pinnaclelearning.example', phone:'+61 8 6100 0000', country:'Australia', confidence:'UNCONFIRMED', status:'No named buyer confirmed', source:'Company website', notes:''},
    {id:'ct-crestview', companyId:'crestview', name:null, title:'Buyer (unidentified)', email:'hello@crestviewgift.example', phone:null, country:'Australia', confidence:'UNCONFIRMED', status:'No named buyer confirmed', source:'Company website', notes:''},
    {id:'ct-southern', companyId:'southern', name:null, title:'Sales / production contact', email:'sales@southerncrosspromo.example', phone:'+64 3 700 0000', country:'New Zealand', confidence:'UNCONFIRMED', status:'Research stage — no buyer identified', source:'Company website', notes:''},
    {id:'ct-harbour', companyId:'harbour', name:'Emma Rowe', title:'Owner / Buyer', email:'emma@harbourstationery.example', phone:'+64 4 800 0000', country:'New Zealand', confidence:'VERIFIED', status:'Nurture — previously replied', source:'Buyer email thread (Gmail)', notes:'Replied in good faith; volumes too small today. Keep relationship warm.'},
    {id:'ct-nxp', companyId:'nxp', name:null, title:'Not researched — strategic hold', email:null, phone:null, country:'New Zealand', confidence:'UNCONFIRMED', status:'Research paused (Strategic Hold)', source:'—', notes:''},
    {id:'ct-brightline', companyId:'brightline', name:null, title:'Not applicable — Do Not Contact', email:null, phone:null, country:'Australia', confidence:'UNCONFIRMED', status:'Suppressed', source:'—', notes:''}
  ],

  actions:[
    {id:'ac-crestview-initial', companyId:'crestview', type:'INITIAL', context:'COLD', title:'Initial outreach — send', due:'D-1', priority:'Medium', founderReview:false, draftId:'dr-crestview-initial', draftStatus:'CURRENT_READY', status:'OPEN', note:'Overdue. Approved copy exists; send or consciously deprioritise.'},
    {id:'ac-pinnacle-d20', companyId:'pinnacle', type:'D20', context:'COLD', title:'D20 follow-up — classroom bulk packs', due:'D-2', priority:'Medium', founderReview:true, draftId:null, draftStatus:'NOT_DRAFTED', status:'OPEN', note:'Overdue. D20 needs drafting — no copy prepared yet.'},
    {id:'ac-modish-initial', companyId:'modish', type:'INITIAL', context:'COLD', title:'Initial outreach — founder review & approve', due:'D+0', priority:'High', founderReview:true, draftId:'dr-modish-initial', draftStatus:'CURRENT_READY', status:'OPEN', note:'Approve subject line and the two comparable programmes referenced in the body.'},
    {id:'ac-envon-review', companyId:'envon', type:'BUYER_REVIEW', context:'OPPORTUNITY', title:'Review buyer response / send quotation recap', due:'D+0', priority:'High', founderReview:true, draftId:'dr-envon-quote', draftStatus:'APPROVED_AWAITING_SEND', status:'OPEN', note:'Buyer asked for FOB, MOQ and lead time on three feeding SKUs.'},
    {id:'ac-pgnz-initial', companyId:'pgnz', type:'INITIAL', context:'COLD', title:'Initial outreach — founder review', due:'D+1', priority:'High', founderReview:true, draftId:'dr-pgnz-initial', draftStatus:'CURRENT_READY', status:'OPEN', note:'NZ angle: direct-from-factory alternative to AU intermediary buying.'},
    {id:'ac-axis-d4', companyId:'axis', type:'D4', context:'COLD', title:'D4 follow-up — compliance pack angle', due:'D+2', priority:'High', founderReview:false, draftId:'dr-axis-d4', draftStatus:'APPROVED_AWAITING_SEND', status:'OPEN', note:'Draft approved. Send via Gmail and log to CRM.'},
    {id:'ac-koru-reply', companyId:'koru', type:'BUYER_REVIEW', context:'OPPORTUNITY', title:'Reply to buyer — sample kit proposal', due:'D+3', priority:'High', founderReview:true, draftId:'dr-koru-reply', draftStatus:'CURRENT_READY', status:'OPEN', note:'Address MOQ flexibility and NZ term-start timing directly.'},
    {id:'ac-avalon-d10', companyId:'avalon', type:'D10', context:'COLD', title:'D10 follow-up — PP cost-down study', due:'D+5', priority:'Medium', founderReview:false, draftId:'dr-avalon-d10', draftStatus:'PREPARED_FUTURE', status:'OPEN', note:'Refresh value angle: cost-down on an existing PP line.'},
    {id:'ac-meridian-monthly', companyId:'meridian', type:'MONTHLY', context:'COLD', title:'Monthly re-engagement — 15th', due:'D+8', priority:'Low', founderReview:false, draftId:'dr-meridian-monthly', draftStatus:'PREPARED_FUTURE', status:'OPEN', note:'One specific costed idea, not a generic check-in.'},
    {id:'ac-maxim-review', companyId:'maxim', type:'OPPORTUNITY_REVIEW', context:'OPPORTUNITY', title:'Review buyer response / follow up if no response', due:'D+10', priority:'High', founderReview:true, draftId:null, draftStatus:'NOT_REQUIRED', status:'OPEN', note:'Await buyer direction on 2027 programme. Do not chase more than once.'},
    {id:'ac-ugames-d20', companyId:'ugames', type:'D20', context:'COLD', title:'D20 final touch — packaging cost-down', due:'D+13', priority:'Low', founderReview:false, draftId:'dr-ugames-d20', draftStatus:'PREPARED_FUTURE', status:'OPEN', note:'After D20, move to monthly re-engagement.'},
    {id:'ac-southern-research', companyId:'southern', type:'RESEARCH', context:'RESEARCH', title:'Complete company intelligence review', due:'D+16', priority:'Medium', founderReview:false, draftId:null, draftStatus:'NOT_REQUIRED', status:'OPEN', note:'Establish import model and category depth before approval for outreach.'},

    {id:'ac-harbour-hold', companyId:'harbour', type:'MONTHLY', context:'COLD', title:'Monthly re-engagement', due:'D+14', priority:'Low', founderReview:false, draftId:null, draftStatus:'NOT_DRAFTED', status:'ON_HOLD', note:'Suppressed — company is NURTURE.'},
    {id:'ac-nxp-hold', companyId:'nxp', type:'D4', context:'COLD', title:'D4 follow-up', due:'D-44', priority:'Low', founderReview:false, draftId:'dr-nxp-d4', draftStatus:'CANCELLED', status:'ON_HOLD', note:'Suppressed — company is STRATEGIC HOLD.'},
    {id:'ac-brightline-dnc', companyId:'brightline', type:'INITIAL', context:'COLD', title:'Initial outreach', due:'D-52', priority:'None', founderReview:false, draftId:'dr-brightline-initial', draftStatus:'CANCELLED', status:'ON_HOLD', note:'Suppressed — company is DO NOT CONTACT.'},

    {id:'ac-maxim-initial-done', companyId:'maxim', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-31', priority:'High', founderReview:false, draftId:'dr-maxim-initial', draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-avalon-initial-done', companyId:'avalon', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-20', priority:'High', founderReview:false, draftId:'dr-avalon-initial', draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-avalon-d4-done', companyId:'avalon', type:'D4', context:'COLD', title:'D4 follow-up sent', due:'D-16', priority:'High', founderReview:false, draftId:'dr-avalon-d4', draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-envon-initial-done', companyId:'envon', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-16', priority:'High', founderReview:false, draftId:'dr-envon-initial', draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-envon-d4-done', companyId:'envon', type:'D4', context:'COLD', title:'D4 follow-up sent', due:'D-12', priority:'High', founderReview:false, draftId:'dr-envon-d4', draftStatus:'SUPERSEDED', status:'DONE', note:'Superseded by buyer reply.'},
    {id:'ac-axis-initial-done', companyId:'axis', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-9', priority:'High', founderReview:false, draftId:'dr-axis-initial', draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-pinnacle-initial-done', companyId:'pinnacle', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-30', priority:'Medium', founderReview:false, draftId:null, draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-pinnacle-d10-done', companyId:'pinnacle', type:'D10', context:'COLD', title:'D10 follow-up sent', due:'D-20', priority:'Medium', founderReview:false, draftId:null, draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-ugames-initial-done', companyId:'ugames', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-25', priority:'Medium', founderReview:false, draftId:null, draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-meridian-d20-done', companyId:'meridian', type:'D20', context:'COLD', title:'D20 follow-up sent', due:'D-42', priority:'Low', founderReview:false, draftId:null, draftStatus:'SENT_VERIFIED', status:'DONE', note:''},
    {id:'ac-koru-initial-done', companyId:'koru', type:'INITIAL', context:'COLD', title:'Initial outreach sent', due:'D-14', priority:'High', founderReview:false, draftId:'dr-koru-initial', draftStatus:'SENT_VERIFIED', status:'DONE', note:''}
  ],

  activities:[
    {id:'ev-1', companyId:'envon', type:'BUYER_REPLY', at:'T-3h', title:'Buyer replied', description:'Sarah Whitcombe asked for FOB pricing, MOQ and lead time on three feeding SKUs, and floated a private-label bowl set for Q1.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-2', companyId:'envon', type:'DRAFT_PREPARED', at:'T-5h', title:'Quotation recap drafted', description:'Draft prepared covering FOB / MOQ / lead-time tiers plus one value-engineering option per SKU. Status: approved, awaiting manual send.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-3', companyId:'koru', type:'BUYER_REPLY', at:'T-1d', title:'Buyer replied', description:'Daniel Ng asked about MOQ flexibility and whether production can land before NZ term start.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-4', companyId:'modish', type:'DRAFT_PREPARED', at:'T-1d', title:'Initial outreach draft ready', description:'Private-label development angle with two comparable programme references. Awaiting founder review.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-5', companyId:'axis', type:'DRAFT_PREPARED', at:'T-2d', title:'D4 draft approved', description:'Compliance documentation pack angle (AS/NZS ISO 8124) approved for send on the D4 date.', agent:'Founder', channel:'CRM'},
    {id:'ev-6', companyId:'pinnacle', type:'OUTREACH_SENT', at:'T-2d', title:'D10 follow-up verified sent', description:'D10 sent and verified in Gmail. D20 now the current operational stage — currently overdue.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-7', companyId:'avalon', type:'RESEARCH_UPDATED', at:'T-3d', title:'Buying intelligence updated', description:'Added licensed-range audit requirement observation and cost-down hypothesis for PP lines. Two items remain UNKNOWN.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-8', companyId:'modish', type:'RESEARCH_UPDATED', at:'T-4d', title:'Company intelligence completed', description:'Verified own-brand development arm (Future Brand Products) and import activity. Purchasing contact still unconfirmed.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-9', companyId:'pgnz', type:'STATUS_CHANGE', at:'T-5d', title:'Status changed: Research to Draft Ready', description:'Approved for outreach. Initial draft queued for founder review.', agent:'Founder', channel:'CRM'},
    {id:'ev-10', companyId:'maxim', type:'OPPORTUNITY_CREATED', at:'T-6d', title:'Opportunity created', description:'2027 programme opportunity recorded: sharpeners, pencil cases, student scissors. Removed from cold cadence.', agent:'Founder', channel:'CRM'},
    {id:'ev-11', companyId:'crestview', type:'CONTACT_UPDATED', at:'T-7d', title:'Contact record created (unconfirmed)', description:'Role inbox only. No named buyer confirmed — flagged visually in Contacts.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-12', companyId:'ugames', type:'FOLLOWUP_SENT', at:'T-8d', title:'D10 follow-up sent', description:'Packaging and print cost-down angle sent. No reply. D20 is the current stage.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-13', companyId:'southern', type:'RESEARCH_UPDATED', at:'T-9d', title:'Research started', description:'Company added to research queue: NZ promotional products supplier. Import directness unknown.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-14', companyId:'axis', type:'OUTREACH_SENT', at:'T-9d', title:'Initial outreach sent', description:'Initial email sent to info role inbox, referencing toy compliance documentation.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-16', companyId:'maxim', type:'BUYER_REPLY', at:'T-9d', title:'Buyer replied — opportunity opened', description:'Lloyd Dunn confirmed interest in a 2027 programme across sharpeners, pencil cases and student scissors.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-28', companyId:'maxim', type:'CONTACT_UPDATED', at:'T-8d', title:'Second contact added', description:'Priya Anand (Range Manager — School & Stationery) copied on the buyer thread. Confidence: LIKELY.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-29', companyId:'envon', type:'OPPORTUNITY_CREATED', at:'T-2d', title:'Opportunity created', description:'Pet feeding programme opened at sampling stage after buyer pricing request.', agent:'Founder', channel:'CRM'},
    {id:'ev-15', companyId:'envon', type:'FOLLOWUP_SENT', at:'T-12d', title:'D4 follow-up sent', description:'Follow-up sent with three pet feeding supply angles. Buyer replied on day 15.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-17', companyId:'avalon', type:'FOLLOWUP_SENT', at:'T-16d', title:'D4 follow-up sent', description:'Cost-down study offer on PP document wallets sent. No reply recorded.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-18', companyId:'envon', type:'OUTREACH_SENT', at:'T-16d', title:'Initial outreach sent', description:'Initial pet supplies sourcing email sent to purchasing manager.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-19', companyId:'nxp', type:'STRATEGIC_HOLD', at:'T-19d', title:'Moved to Strategic Hold', description:'Founder applied hold pending channel-conflict review. All outreach suppressed and D4 draft cancelled.', agent:'Founder', channel:'CRM'},
    {id:'ev-20', companyId:'avalon', type:'OUTREACH_SENT', at:'T-20d', title:'Initial outreach sent', description:'Initial email sent referencing PP stationery cost-down capability.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-21', companyId:'pinnacle', type:'DRAFT_PREPARED', at:'T-21d', title:'D10 draft prepared', description:'Classroom bulk pack angle prepared and sent on schedule.', agent:'Outreach Agent', channel:'CRM'},
    {id:'ev-22', companyId:'ugames', type:'FOLLOWUP_SENT', at:'T-21d', title:'D4 follow-up sent', description:'Novelty components and packaging angle sent.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-23', companyId:'koru', type:'OUTREACH_SENT', at:'T-14d', title:'Initial outreach sent', description:'NZ back-to-school consolidation angle sent to Head of Merchandise.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-30', companyId:'modish', type:'STATUS_CHANGE', at:'T-5d', title:'Approved for outreach', description:'Moved from Research to Approved for Outreach; initial draft generated.', agent:'Founder', channel:'CRM'},
    {id:'ev-24', companyId:'harbour', type:'NURTURE', at:'T-34d', title:'Moved to Nurture', description:'Buyer confirmed volumes below viable direct-import MOQ. Cadence suppressed; relationship kept warm.', agent:'Founder', channel:'CRM'},
    {id:'ev-25', companyId:'harbour', type:'BUYER_REPLY', at:'T-34d', title:'Buyer replied', description:'Emma Rowe explained order volumes are too small for direct import at this stage.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-26', companyId:'meridian', type:'FOLLOWUP_SENT', at:'T-42d', title:'D20 follow-up sent', description:'Final cadence touch sent. No reply — account moved to monthly re-engagement.', agent:'Outreach Agent', channel:'Gmail'},
    {id:'ev-27', companyId:'brightline', type:'STATUS_CHANGE', at:'T-52d', title:'Marked Do Not Contact', description:'In-house Guangzhou sourcing office and direct channel conflict. Initial draft cancelled.', agent:'Founder', channel:'CRM'}
  ],

  opportunities:[
    { id:'opp-maxim', companyId:'maxim', company:'Maxim Office Group', country:'Australia',
      status:'Await Buyer Direction', buyerName:'Lloyd Dunn', buyerTitle:'General Manager',
      buyerEmail:'l.dunn@maximofficegroup.example',
      products:['Plastic and metal sharpeners','Pencil cases','Student scissors'],
      requirement:'2027 back-to-school programme across three product families. Buyer requested indicative FOB pricing and MOQ ranges; awaiting internal direction on volumes and specification.',
      timing:'2027 purchasing interest',
      stage:'Buyer conversation — awaiting direction',
      latestCommunication:{at:'T-9d', channel:'Gmail', summary:'Lloyd Dunn confirmed interest in sharpeners, pencil cases and student scissors for a 2027 programme and asked for indicative pricing bands.'},
      nextAction:{label:'Review buyer response / follow up if no response', date:'D+10'},
      supplierWork:{status:'In progress', detail:'Two-factory shortlist per family assembled. Plastic sharpener quotes received; metal sharpener tooling options under review. Sample plan drafted, not yet committed.'},
      notes:['Do not place Maxim in the normal cold sequence.','Single consolidated programme is more attractive to them than per-SKU buying.','Priya Anand (Range Manager) is likely the range-level decision influencer — confirm before direct approach.','No financial value recorded. Do not estimate revenue until volumes are confirmed.'],
      valueKnown:false },
    { id:'opp-envon', companyId:'envon', company:'Envon Pet Supplies', country:'Australia',
      status:'Quotation Stage', buyerName:'Sarah Whitcombe', buyerTitle:'Purchasing Manager',
      buyerEmail:'sarah.w@envonpet.example',
      products:['Stainless + PP pet bowls','Slow-feeder bowls','Collapsible travel bowls'],
      requirement:'FOB pricing, MOQ and lead time on three feeding SKUs, plus interest in a private-label bowl set with own-brand packaging.',
      timing:'Q1 range — sampling must close before Q4 retail season planning',
      stage:'Quotation / sampling',
      latestCommunication:{at:'T-3h', channel:'Gmail', summary:'Buyer requested FOB, MOQ and lead time on three feeding SKUs and asked whether private-label packaging is possible at their volumes.'},
      nextAction:{label:'Send approved quotation recap (manual send in Gmail)', date:'D+0'},
      supplierWork:{status:'Quote round open', detail:'Three Guangdong factories quoted. Two returned FOB + MOQ; one outstanding. Value-engineering option identified on the slow-feeder tooling.'},
      notes:['Buyer is price-benchmarking — include a value-engineering alternative, not just a cheaper number.','Quotation recap is approved and awaiting manual send. This app does not send email.'],
      valueKnown:false },
    { id:'opp-koru', companyId:'koru', company:'Koru Kids', country:'New Zealand',
      status:'Early Conversation', buyerName:'Daniel Ng', buyerTitle:'Head of Merchandise',
      buyerEmail:'daniel@korukids.example',
      products:['School stationery sets','PP pencil cases','Kids drinkware','School bags'],
      requirement:'Consolidated NZ back-to-school programme. Buyer testing MOQ flexibility and whether production can land before NZ term start.',
      timing:'NZ school term start — next back-to-school window',
      stage:'Early conversation — sample kit proposed',
      latestCommunication:{at:'T-1d', channel:'Gmail', summary:'Buyer asked about MOQ flexibility per SKU and confirmed timing against NZ term dates is the deciding factor.'},
      nextAction:{label:'Reply with sample kit proposal and consolidated shipping plan', date:'D+3'},
      supplierWork:{status:'Not started', detail:'Awaiting buyer confirmation on category mix before opening factory quotes.'},
      notes:['Lead with consolidated shipping and staggered production, not unit price.','NZ freight economics matter — think landed cost.'],
      valueKnown:false }
  ],

  drafts:[
    {id:'dr-modish-initial', companyId:'modish', stage:'Initial', status:'CURRENT_READY',
      subject:'Private-label stationery & gift development — sourcing support from Hong Kong',
      greeting:'Hello Modish Australia team,',
      body:'Future Brand Products caught our attention — particularly the way you build own-brand gift and lifestyle ranges for Australian retail rather than simply importing catalogue product.\n\nWe are SHALVADZE, a Hong Kong-based sourcing and trading company. Our deepest expertise is PP plastic stationery, school and office products — pencil cases, sharpeners, desk organiser lines — developed directly with factories we audit and visit in person.\n\nMost of our work starts with a target price. You give us the retail point and the specification; we build the factory shortlist, the cost breakdown and the sampling plan around it. We also handle private label and OEM development, quality control and consolidation into a single shipment.\n\nWould it be useful to see two comparable Australian programmes we have sourced, with indicative FOB pricing and MOQ ranges?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'purchasing@modishau.example', recipientNote:'Role inbox — no named buyer confirmed',
      preparedAt:'D-1', preparedBy:'Outreach Agent', threadRef:'Gmail · thread not yet started'},
    {id:'dr-modish-d4', companyId:'modish', stage:'D4', status:'PREPARED_FUTURE',
      subject:'Re: Private-label stationery & gift development — sourcing support from Hong Kong',
      greeting:'Hello again,',
      body:'Following up briefly on my note last week.\n\nThe single most useful thing we do for brand developers is a target-price build: you tell us the FOB you need to hit, and we come back with the factory options, material substitutions and packaging changes that get you there — before you commit to sampling.\n\nIf there is one range you are cost-reviewing this quarter, send it across and we will return a short, costed comparison.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'purchasing@modishau.example', recipientNote:'Role inbox — no named buyer confirmed',
      preparedAt:'D-1', preparedBy:'Outreach Agent', threadRef:'Gmail · reply to initial thread'},
    {id:'dr-modish-d10', companyId:'modish', stage:'D10', status:'PREPARED_FUTURE',
      subject:'Re: Private-label development — one idea worth four minutes',
      greeting:'Hello,',
      body:'Rather than another follow-up, one specific observation.\n\nAcross your gift ranges there is very little desk and stationery adjacency — yet the same retail customers buy into both. A small PP desk capsule (organiser, pen pot, tray, pencil case) reuses your existing brand language and ships in the same container as your current lines.\n\nWe could cost that capsule against your current drinkware FOB for comparison. Happy to send a one-page breakdown if useful.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'purchasing@modishau.example', recipientNote:'Role inbox — no named buyer confirmed',
      preparedAt:'D-1', preparedBy:'Outreach Agent', threadRef:'Gmail · reply to initial thread'},
    {id:'dr-pgnz-initial', companyId:'pgnz', stage:'Initial', status:'CURRENT_READY',
      subject:'Direct-from-factory alternative for your stationery and household lines',
      greeting:'Hello Rachel,',
      body:'PGNZ breadth across stationery, household and promotional categories suggests you are buying a lot of product through intermediaries — which usually means two margins before it reaches your retailers.\n\nWe are SHALVADZE, a Hong Kong sourcing and trading company working with Australian and New Zealand wholesalers. Our core strength is PP plastic stationery, school and office products, manufactured with factories we audit and visit.\n\nFor New Zealand specifically we handle LCL consolidation, so a trial category does not require a full container.\n\nWould a costed comparison on one fast-moving stationery line be useful? If it does not beat your current landed cost, you have lost nothing.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'rachel@pgnz.example', recipientNote:'Name from trade directory — confidence LIKELY, not verified',
      preparedAt:'D-2', preparedBy:'Outreach Agent', threadRef:'Gmail · thread not yet started'},
    {id:'dr-envon-quote', companyId:'envon', stage:'Buyer follow-up', status:'APPROVED_AWAITING_SEND',
      subject:'Re: Pet feeding SKUs — FOB, MOQ and lead time',
      greeting:'Hi Sarah,',
      body:'Thank you for the quick reply — here is the costed detail you asked for.\n\n1. Stainless + PP pet bowls (2 sizes)\n   FOB and MOQ tiers attached for 3,000 / 5,000 / 10,000 units. Lead time 30–35 days from approved sample.\n\n2. Slow-feeder bowls\n   Existing tooling available at a lower MOQ. One value-engineering option reduces unit cost by adjusting wall thickness without affecting function.\n\n3. Collapsible travel bowls\n   Silicone and PP options both costed; silicone carries a longer sampling window.\n\nOn private label: yes, we handle own-brand packaging, artwork-to-production management and carton configuration for retail-ready presentation.\n\nI would suggest a sample kit covering all three families so you can assess finish and print quality together. Happy to arrange that this week.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sarah.w@envonpet.example', recipientNote:'Verified contact — Purchasing Manager',
      preparedAt:'D-0', preparedBy:'Outreach Agent · approved by Founder', threadRef:'Gmail · active thread'},
    {id:'dr-koru-reply', companyId:'koru', stage:'Buyer follow-up', status:'CURRENT_READY',
      subject:'Re: NZ back-to-school — MOQ flexibility and term timing',
      greeting:'Hi Daniel,',
      body:'Both of your questions answered directly.\n\nMOQ flexibility: for a first consolidated programme we can mix SKUs within a family — for example three pencil case colourways sharing one production run — which brings the effective per-SKU commitment down considerably. I will include the exact structure in the sample proposal.\n\nTerm timing: working back from your shelf date, we need artwork confirmed by the sampling window and production booked roughly 12 weeks ahead of vessel. I have set out a dated plan so you can see exactly where the risk sits.\n\nThe attached proposal covers a sample kit across stationery sets, pencil cases, drinkware and bags, plus a consolidated shipping plan for New Zealand.\n\nIf the mix looks right, we can start sampling immediately.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'daniel@korukids.example', recipientNote:'Verified contact — Head of Merchandise',
      preparedAt:'D-1', preparedBy:'Outreach Agent', threadRef:'Gmail · active thread'},
    {id:'dr-axis-d4', companyId:'axis', stage:'D4', status:'APPROVED_AWAITING_SEND',
      subject:'Re: Toy sourcing with full AS/NZS ISO 8124 documentation',
      greeting:'Hello Axis team,',
      body:'One point from my last note is worth expanding, because it is where most toy importers get caught.\n\nEvery line we source ships with a complete documentation pack: AS/NZS ISO 8124 test reports, factory audit summary, packing list and carton marking detail. You receive it before the vessel sails, not after a compliance query.\n\nIf you have a line in the current range where documentation has been slow or incomplete, send us the specification. We will return a costed comparison and a sample of the pack we provide.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'info@axistoys.example', recipientNote:'Role inbox — Director name inferred, not confirmed',
      preparedAt:'D-3', preparedBy:'Outreach Agent · approved by Founder', threadRef:'Gmail · reply to initial thread'},
    {id:'dr-axis-initial', companyId:'axis', stage:'Initial', status:'SENT_VERIFIED',
      subject:'Toy & gift sourcing from Hong Kong — compliance-documented',
      greeting:'Hello Axis team,',
      body:'We are SHALVADZE, a Hong Kong-based sourcing and trading company supplying Australian importers with toys, gifts and promotional lines manufactured in China.\n\nWhat makes us different in the toy category is documentation. Every shipment includes AS/NZS ISO 8124 test reports, factory audit details and full carton marking — provided before loading, not on request afterwards.\n\nWe also handle target-price sourcing: you give us the retail point, we build the factory shortlist and cost breakdown around it.\n\nWould a costed comparison on one current line be useful?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'info@axistoys.example', recipientNote:'Role inbox',
      preparedAt:'D-10', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-9'},
    {id:'dr-avalon-d10', companyId:'avalon', stage:'D10', status:'PREPARED_FUTURE',
      subject:'Re: PP stationery cost-down study',
      greeting:'Hello,',
      body:'A concrete offer rather than another introduction.\n\nSend us the specification and current FOB of one PP stationery line — a document wallet, pencil case or desk tray — and we will return a cost-down study within five working days: alternative factory options, material or wall-thickness adjustments, packaging changes, and the resulting FOB.\n\nBecause your ranges include licensed product, we will also include our factory audit and documentation summary, which is usually the part that slows approval.\n\nIf the study does not improve your cost, you keep it and we move on.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sales@avalonint.example', recipientNote:'Role inbox — category buyer not yet identified',
      preparedAt:'D-4', preparedBy:'Outreach Agent', threadRef:'Gmail · reply to initial thread'},
    {id:'dr-avalon-d4', companyId:'avalon', stage:'D4', status:'SENT_VERIFIED',
      subject:'Re: PP stationery & school product sourcing',
      greeting:'Hello,',
      body:'Following my note last week. Our deepest capability sits exactly where your range is strongest: PP plastic stationery, school and office products.\n\nWe work on target price, provide alternative suppliers where an incumbent is not performing, and manage quality control and consolidation from Hong Kong.\n\nWould a costed comparison on one PP line be useful?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sales@avalonint.example', recipientNote:'Role inbox',
      preparedAt:'D-17', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-16'},
    {id:'dr-avalon-initial', companyId:'avalon', stage:'Initial', status:'SENT_VERIFIED',
      subject:'PP stationery & school products — direct factory sourcing from Hong Kong',
      greeting:'Hello Avalon team,',
      body:'Avalon stationery and school ranges overlap precisely with our core manufacturing expertise: PP plastic stationery, school and office products.\n\nWe are SHALVADZE, a Hong Kong sourcing and trading company. We supply Australian importers with target-price sourcing, alternative suppliers, private label and OEM development, quality control and consolidated logistics — with factories we audit and visit ourselves.\n\nWould it be useful to see indicative FOB pricing on two or three comparable PP lines?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sales@avalonint.example', recipientNote:'Role inbox',
      preparedAt:'D-21', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-20'},
    {id:'dr-ugames-d20', companyId:'ugames', stage:'D20', status:'PREPARED_FUTURE',
      subject:'Re: packaging & print cost-down for games ranges',
      greeting:'Hello,',
      body:'Last note from me on this.\n\nYour retail presentation is packaging-led, so the fastest saving is usually in print and box structure rather than the product. We handle packaging and plastics together from Hong Kong, which means one supplier accountable for how the product looks on shelf.\n\nIf a packaging cost-down study is useful at any point, we can turn it around in a week.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'buy@ugames.example', recipientNote:'Role inbox — no named buyer confirmed',
      preparedAt:'D-6', preparedBy:'Outreach Agent', threadRef:'Gmail · reply to initial thread'},
    {id:'dr-meridian-monthly', companyId:'meridian', stage:'Monthly', status:'PREPARED_FUTURE',
      subject:'One costed idea for your desk accessory range',
      greeting:'Hello Greg,',
      body:'Monthly note, one idea only.\n\nPP desk organiser sets are one of the easiest lines to improve on cost without changing what the customer sees: same visual spec, adjusted wall thickness and a consolidated multi-SKU carton. In comparable reseller programmes this has moved FOB meaningfully on a set of four items.\n\nIf you send the current spec and FOB, we will return a costed alternative. No sampling commitment required to see the numbers.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'g.palmer@meridianoffice.example', recipientNote:'Likely contact — never engaged',
      preparedAt:'D-8', preparedBy:'Outreach Agent', threadRef:'Gmail · new monthly thread'},
    {id:'dr-envon-d4', companyId:'envon', stage:'D4', status:'SUPERSEDED',
      subject:'Re: Pet supplies sourcing — three feeding lines',
      greeting:'Hi Sarah,',
      body:'[Superseded by buyer reply — retained for history.]\n\nFollowing up on my note about pet feeding lines. We can cost three SKUs against your current FOB, including private-label packaging options.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sarah.w@envonpet.example', recipientNote:'Verified contact',
      preparedAt:'D-13', preparedBy:'Outreach Agent', threadRef:'Gmail · superseded by live thread', sentAt:'D-12'},
    {id:'dr-envon-initial', companyId:'envon', stage:'Initial', status:'SENT_VERIFIED',
      subject:'Own-brand pet supplies — factory sourcing & QC from Hong Kong',
      greeting:'Hi Sarah,',
      body:'Envon own-brand direction is exactly where a sourcing partner adds most value.\n\nWe are SHALVADZE, Hong Kong. We develop and source pet supplies — bowls and feeding, travel and carriers, accessories — with factories we audit and visit, and we manage quality control, private-label packaging and consolidated shipping.\n\nIf you are cost-reviewing any feeding line this quarter, send the specification and target FOB. We will return factory options and a cost breakdown.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'sarah.w@envonpet.example', recipientNote:'Verified contact',
      preparedAt:'D-17', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-16'},
    {id:'dr-koru-initial', companyId:'koru', stage:'Initial', status:'SENT_VERIFIED',
      subject:'NZ back-to-school — consolidated stationery, cases & drinkware',
      greeting:'Hi Daniel,',
      body:'Koru Kids back-to-school programme is a natural fit for consolidated sourcing.\n\nWe are SHALVADZE, a Hong Kong sourcing and trading company. School stationery sets, PP pencil cases, kids drinkware and bags are core categories for us — produced with factories we audit and visit, then consolidated into a single shipment timed for NZ term start.\n\nWould a sample kit and a dated production plan be useful?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'daniel@korukids.example', recipientNote:'Verified contact',
      preparedAt:'D-15', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-14'},
    {id:'dr-crestview-initial', companyId:'crestview', stage:'Initial', status:'CURRENT_READY',
      subject:'Private-label drinkware & gift accessories — Hong Kong sourcing',
      greeting:'Hello Crestview team,',
      body:'Several of your drinkware and gift accessory lines look like generic imported product carrying a Crestview label — which usually means you are paying for someone else sourcing margin.\n\nWe are SHALVADZE, a Hong Kong sourcing and trading company. We build private-label programmes directly with factories we audit: target-price costing, alternative suppliers, packaging development, quality control and consolidated seasonal shipments.\n\nIf you send one line you are reviewing, we will return a costed comparison including retail-ready packaging.\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'hello@crestviewgift.example', recipientNote:'Role inbox — no named buyer confirmed',
      preparedAt:'D-2', preparedBy:'Outreach Agent', threadRef:'Gmail · thread not yet started'},
    {id:'dr-brightline-initial', companyId:'brightline', stage:'Initial', status:'CANCELLED',
      subject:'[Cancelled — Do Not Contact]',
      greeting:'—',
      body:'Draft cancelled by founder. Brightline Office Supplies operates an in-house Guangzhou sourcing office and competes in the same channel. Company is permanently marked Do Not Contact.',
      recipient:'—', recipientNote:'Suppressed',
      preparedAt:'D-53', preparedBy:'Outreach Agent', threadRef:'Cancelled before send'},
    {id:'dr-nxp-d4', companyId:'nxp', stage:'D4', status:'CANCELLED',
      subject:'[Cancelled — Strategic Hold]',
      greeting:'—',
      body:'Draft cancelled. NXP placed on Strategic Hold pending channel-conflict review. No outreach permitted while the hold is active.',
      recipient:'—', recipientNote:'Suppressed',
      preparedAt:'D-45', preparedBy:'Outreach Agent', threadRef:'Cancelled before send'},
    {id:'dr-maxim-initial', companyId:'maxim', stage:'Initial', status:'SENT_VERIFIED',
      subject:'Sharpeners, pencil cases & student scissors — factory sourcing from Hong Kong',
      greeting:'Dear Mr Dunn,',
      body:'Maxim school and stationery ranges sit precisely within our manufacturing depth.\n\nWe are SHALVADZE, a Hong Kong-based sourcing and trading company. PP plastic stationery, school and office products are our core specialism: plastic and metal sharpeners, pencil cases, student scissors and desk organisation lines, produced with factories we audit and visit.\n\nWe work on target price, provide alternative suppliers where a line is not performing, and manage quality control and consolidation into a single shipment.\n\nWould indicative FOB pricing on two or three of these families be useful for your forward planning?\n\nKind regards,\nTaha\nSHALVADZE · Hong Kong',
      recipient:'l.dunn@maximofficegroup.example', recipientNote:'Verified contact — General Manager',
      preparedAt:'D-32', preparedBy:'Outreach Agent', threadRef:'Gmail · sent and verified', sentAt:'D-31'}
  ],

  marketingCalendar:[
    {id:'mk-1', date:'D-5', title:'Website — Sourcing Process page copy review', channel:'Website', campaign:'Site Refresh Q3', status:'Completed', priority:'Medium', note:'Explains target-price sourcing, factory audits and QC in plain commercial language.'},
    {id:'mk-2', date:'D-2', title:'LinkedIn — factory visit content (3 posts)', channel:'Social', campaign:'Factory Transparency', status:'Completed', priority:'Medium', note:'Photography from the Guangdong stationery factory visit, captioned for AU/NZ buyers.'},
    {id:'mk-3', date:'D+1', title:'PP Stationery Range Guide v2 — final PDF', channel:'Content', campaign:'Range Guide', status:'In Progress', priority:'High', note:'Core sales asset for stationery conversations. Include indicative FOB bands and MOQ.'},
    {id:'mk-4', date:'D+3', title:'Case study — consolidated NZ back-to-school programme', channel:'Content', campaign:'Range Guide', status:'Planned', priority:'High', note:'Written to support the Koru Kids conversation without naming the buyer.'},
    {id:'mk-5', date:'D+6', title:'Email — Q4 nurture note to warm list', channel:'Email', campaign:'Nurture Q4', status:'Planned', priority:'Medium', note:'Nurture contacts only. Explicitly excluded from the sales outreach cadence.'},
    {id:'mk-6', date:'D+9', title:'Website — Pet Supplies category page', channel:'Website', campaign:'Site Refresh Q3', status:'Planned', priority:'Medium', note:'Supports the Envon conversation and future pet category outreach.'},
    {id:'mk-7', date:'D+12', title:'LinkedIn — target-price sourcing explainer article', channel:'Social', campaign:'Authority Building', status:'Draft', priority:'Low', note:'Position SHALVADZE on commercial method, not price.'},
    {id:'mk-8', date:'D+15', title:'Sample kit packaging refresh — print spec', channel:'Campaign', campaign:'Sample Kit', status:'Planned', priority:'High', note:'Sample kits are the highest-conversion asset in the current pipeline.'},
    {id:'mk-9', date:'D+19', title:'Trade event — AU gift & homewares fair (attend)', channel:'Event', campaign:'Market Presence', status:'Confirmed', priority:'Medium', note:'Attendance only. Collect buyer cards for the research queue.'},
    {id:'mk-10', date:'D+24', title:'Content — Quality Control: what our inspection report covers', channel:'Content', campaign:'Authority Building', status:'Planned', priority:'Medium', note:'Differentiator for toy and school categories where compliance matters.'},
    {id:'mk-11', date:'D+31', title:'Website — Testimonial / evidence section', channel:'Website', campaign:'Site Refresh Q3', status:'Planned', priority:'Low', note:'Only publish evidence that is verified and approved by the buyer.'},
    {id:'mk-12', date:'D+38', title:'Campaign — 2027 back-to-school sourcing window', channel:'Campaign', campaign:'Back to School 2027', status:'Planned', priority:'High', note:'Timed to the Maxim 2027 programme horizon and AU retail planning cycle.'},
    {id:'mk-13', date:'D+44', title:'Email — factory capacity update to active buyers', channel:'Email', campaign:'Buyer Retention', status:'Planned', priority:'Medium', note:'Active buyers and opportunities only. Not a cold list.'},
    {id:'mk-14', date:'D+52', title:'Social — behind the scenes: supplier vetting checklist', channel:'Social', campaign:'Factory Transparency', status:'Idea', priority:'Low', note:'Short-form content showing how suppliers are screened.'}
  ],

  pipelineSummary:{
    order:['Research','Approved for Outreach','Draft Ready','Initial Sent','D4','D10','D20','Monthly','Buyer Conversation','Active Opportunity','Nurture','Strategic Hold','Do Not Contact','Closed'],
    note:'Counts are derived live from the company records in this snapshot.'
  }
};

/* ============================================================================
   3. CONFIG + DATA SOURCES (only layer that changes when Sheets goes live)
   ============================================================================ */
var CRM_CONFIG = {
  mode:'local',
  endpoint:null,
  localPath:'/data/crm.json',
  cacheKey:'shalvadze.crm.cache.v1',
  cacheTtlMs:60*60*1000,
  simulateFailure:false,
  latencyMs:420
};
var MIN_SPLASH_MS = 1100;

var LocalJsonSource = {
  id:'local-json', label:'Local JSON',
  load:function(){
    if(CRM_CONFIG.simulateFailure) return Promise.reject(new Error('Simulated data source failure (prototype tool).'));
    return wait(CRM_CONFIG.latencyMs).then(function(){ return deepCopy(CRM_SEED_DOCUMENT); });
  }
};

var RemoteApiSource = {
  id:'remote-api', label:'Google Sheets API',
  load:function(){
    if(!CRM_CONFIG.endpoint) return Promise.reject(new Error('CRM_API_ENDPOINT is not configured.'));
    return fetch(CRM_CONFIG.endpoint, {cache:'no-store'}).then(function(res){
      if(!res.ok) throw new Error('API responded '+res.status);
      return res.json();
    }).then(function(raw){
      return SheetsAdapter.detect(raw) ? SheetsAdapter.toSnapshot(raw) : raw;
    });
  }
};

/* Apps Script payload (sheet-keyed rows) -> app schema */
var SheetsAdapter = {
  detect:function(raw){ return !!(raw && typeof raw==='object' && raw.sheets); },
  camel:function(s){ return String(s).trim().toLowerCase().replace(/[^a-z0-9]+(.)/g,function(m,c){return c.toUpperCase();}).replace(/[^a-zA-Z0-9]/g,''); },
  rows:function(list){
    if(!list || Object.prototype.toString.call(list)!=='[object Array]') return [];
    return list.map(function(r){ var o={}; for(var k in r){ if(Object.prototype.hasOwnProperty.call(r,k)) o[SheetsAdapter.camel(k)]=r[k]; } return o; });
  },
  toSnapshot:function(raw){
    var s = raw.sheets || {};
    var companies = SheetsAdapter.rows(s.COMPANY_INTELLIGENCE);
    var intel = SheetsAdapter.rows(s.BUYER_INTELLIGENCE);
    companies.forEach(function(c){
      c.intelligence = intel.filter(function(i){ return i.companyid===c.id || i.crmid===c.crmId; });
    });
    var baseMeta = CRM_SEED_DOCUMENT.meta;
    var out = {
      meta:{}, companies:companies,
      contacts:SheetsAdapter.rows(s.CONTACTS),
      actions:SheetsAdapter.rows(s.OUTREACH_CALENDAR),
      activities:SheetsAdapter.rows(s.ACTIVITY_HISTORY),
      opportunities:SheetsAdapter.rows(s.OPPORTUNITIES),
      drafts:SheetsAdapter.rows(s.EMAIL_DRAFTS),
      marketingCalendar:SheetsAdapter.rows(s.MARKETING_CALENDAR),
      pipelineSummary:raw.pipelineSummary || CRM_SEED_DOCUMENT.pipelineSummary
    };
    for(var mk in baseMeta) if(Object.prototype.hasOwnProperty.call(baseMeta,mk)) out.meta[mk]=baseMeta[mk];
    if(raw && raw.meta) for(var rk in raw.meta) if(Object.prototype.hasOwnProperty.call(raw.meta,rk)) out.meta[rk]=raw.meta[rk];
    out.meta.sourceType='GOOGLE_SHEETS_API';
    out.meta.sourceLabel=CRM_CONFIG.endpoint;
    return out;
  }
};

function wait(ms){ return new Promise(function(r){ setTimeout(r, ms||0); }); }
function deepCopy(o){
  try{ return JSON.parse(JSON.stringify(o)); }
  catch(e){ return JSON.parse(JSON.stringify(CRM_SEED_DOCUMENT)); }
}
function isArr(v){ return Object.prototype.toString.call(v)==='[object Array]'; }
function isValidSnapshot(raw){
  return !!(raw && typeof raw==='object' && isArr(raw.companies) && isArr(raw.actions));
}

/* ============================================================================
   4. CACHE — localStorage with an in-memory fallback (blocked/private mode safe)
   ============================================================================ */
var Cache = (function(){
  var mem = {};
  var storageOK = (function(){
    try{ var k='__sv_probe__'; window.localStorage.setItem(k,'1'); window.localStorage.removeItem(k); return true; }
    catch(e){ return false; }
  })();
  return {
    available:storageOK,
    read:function(k){
      try{
        var raw = storageOK ? window.localStorage.getItem(k) : (mem[k]||null);
        if(!raw) return null;
        var parsed = JSON.parse(raw);
        if(!parsed || !parsed.data || !isValidSnapshot(parsed.data)) return null;   /* corrupt/legacy -> ignore */
        return parsed;
      }catch(e){ return null; }
    },
    write:function(k,data){
      var payload;
      try{ payload = JSON.stringify({savedAt:Date.now(), data:data}); }catch(e){ return false; }
      try{ if(storageOK) window.localStorage.setItem(k,payload); else mem[k]=payload; return true; }
      catch(e){ try{ mem[k]=payload; }catch(e2){} return false; }
    },
    clear:function(k){ try{ if(storageOK) window.localStorage.removeItem(k); }catch(e){} delete mem[k]; },
    meta:function(k){ var c=Cache.read(k); return c? {savedAt:c.savedAt} : null; }
  };
})();

/* ============================================================================
   5. CRM DATA SERVICE — the single interface the UI is allowed to use.
      init()/refresh() never throw; they always resolve with state.
   ============================================================================ */
var CRM = {
  _snapshot:null, _byId:null, _loadedAt:null, _error:null, _fromCache:false, _loading:false,
  _listeners:[],

  onChange:function(fn){ if(typeof fn==='function') this._listeners.push(fn); },
  _emit:function(){ var s=this.state; this._listeners.forEach(function(fn){ try{ fn(s); }catch(e){} }); },

  get source(){ return CRM_CONFIG.mode==='remote' ? RemoteApiSource : LocalJsonSource; },
  get state(){
    return { loading:this._loading, error:this._error, loadedAt:this._loadedAt,
      fromCache:this._fromCache, source:this.source.label, mode:CRM_CONFIG.mode,
      endpoint:CRM_CONFIG.endpoint, ready:!!this._snapshot, storage:Cache.available };
  },

  init:function(){
    var self=this;
    /* cache hydration is guarded: a missing/corrupt entry must never abort boot */
    try{
      var cached=Cache.read(CRM_CONFIG.cacheKey);
      if(cached && isValidSnapshot(cached.data)) this._setSnapshot(cached.data, true);
      else if(cached) Cache.clear(CRM_CONFIG.cacheKey);
    }catch(e){ console.warn('[CRM] cache hydration skipped:', e && e.message); }

    this._loading=true;
    return this.source.load().then(function(raw){
      if(!isValidSnapshot(raw)) throw new Error('Malformed CRM payload (companies/actions arrays expected).');
      Cache.write(CRM_CONFIG.cacheKey, raw);
      self._setSnapshot(raw, false);
      self._error=null; self._fromCache=false;
    }).catch(function(err){
      if(!self._snapshot) self._error=(err && err.message) || 'Unable to load CRM data.';
      else self._fromCache=true;
      console.warn('[CRM] source load failed:', err);
    }).then(function(){
      self._loading=false;
      self._emit();
      return self.state;
    });
  },

  refresh:function(){
    var self=this;
    this._loading=true; this._emit();
    return this.source.load().then(function(raw){
      if(!isValidSnapshot(raw)) throw new Error('Malformed CRM payload.');
      Cache.write(CRM_CONFIG.cacheKey, raw);
      self._setSnapshot(raw,false);
      self._error=null; self._fromCache=false;
    }).catch(function(err){
      self._error=(err && err.message) || 'Refresh failed.';
      if(self._snapshot) self._fromCache=true;
    }).then(function(){
      self._loading=false; self._emit(); return self.state;
    });
  },

  _setSnapshot:function(raw, fromCache){
    if(!raw || typeof raw!=='object') throw new Error('CRM snapshot is empty.');
    var copy=deepCopy(raw);
    if(!isValidSnapshot(copy)) throw new Error('CRM snapshot failed validation.');
    DateUtil.resolve(copy);
    this._snapshot=copy;
    this._loadedAt=Date.now();
    this._fromCache=!!fromCache;
    this._index();
  },

  _index:function(){
    var s=this._snapshot; if(!s) return;
    this._byId={companies:{},contacts:{},actions:{},opportunities:{},drafts:{}};
    (s.companies||[]).forEach(function(c){ this._byId.companies[c.id]=c; }, this);
    (s.contacts||[]).forEach(function(c){ this._byId.contacts[c.id]=c; }, this);
    (s.actions||[]).forEach(function(a){ this._byId.actions[a.id]=a; }, this);
    (s.opportunities||[]).forEach(function(o){ this._byId.opportunities[o.id]=o; }, this);
    (s.drafts||[]).forEach(function(d){ this._byId.drafts[d.id]=d; }, this);
  },

  /* ---- getters ---- */
  getMeta:function(){ return this._snapshot ? (this._snapshot.meta||{}) : {}; },
  getCompanies:function(){ return this._snapshot && isArr(this._snapshot.companies) ? this._snapshot.companies.slice() : []; },
  getCompanyById:function(id){ return (this._snapshot && this._byId) ? (this._byId.companies[id]||null) : null; },
  getContacts:function(){ return this._snapshot && isArr(this._snapshot.contacts) ? this._snapshot.contacts.slice() : []; },
  getContactsByCompany:function(id){ return this.getContacts().filter(function(c){ return c.companyId===id; }); },
  getActions:function(){ return this._snapshot && isArr(this._snapshot.actions) ? this._snapshot.actions.slice() : []; },
  getActivities:function(){ return this._snapshot && isArr(this._snapshot.activities) ? this._snapshot.activities.slice().sort(function(a,b){ return (b.at||0)-(a.at||0); }) : []; },
  getActivitiesByCompany:function(id){ return this.getActivities().filter(function(a){ return a.companyId===id; }); },
  getOpportunities:function(){ return this._snapshot && isArr(this._snapshot.opportunities) ? this._snapshot.opportunities.slice() : []; },
  getOpportunityById:function(id){ return (this._snapshot && this._byId) ? (this._byId.opportunities[id]||null) : null; },
  getDrafts:function(){ return this._snapshot && isArr(this._snapshot.drafts) ? this._snapshot.drafts.slice() : []; },
  getDraftById:function(id){ return (this._snapshot && this._byId) ? (this._byId.drafts[id]||null) : null; },
  getDraftsByCompany:function(id){ return this.getDrafts().filter(function(d){ return d.companyId===id; }); },
  getMarketingCalendar:function(){
    if(!this._snapshot || !isArr(this._snapshot.marketingCalendar)) return [];
    return this._snapshot.marketingCalendar.slice().sort(function(a,b){
      return (DateUtil.parseDateOnly(a.date)||0) - (DateUtil.parseDateOnly(b.date)||0);
    });
  },
  getActiveActions:function(){ return Rules.activeActions(this.getActions(), this.getCompanies()); },
  getHiddenFutureStages:function(){ return Rules.hiddenFutureCount(this.getActions(), this.getCompanies(), this.getDrafts()); },

  getPipelineSummary:function(){
    var ps=(this._snapshot && this._snapshot.pipelineSummary) || {};
    var order=isArr(ps.order)? ps.order.slice() : [];
    var counts={}; order.forEach(function(k){ counts[k]=0; });
    this.getCompanies().forEach(function(c){ var k=c.pipelineStage||'Research'; counts[k]=(counts[k]||0)+1; });
    return {order:order, counts:counts, total:this.getCompanies().length};
  },

  getStats:function(){
    var acts=this.getActiveActions(), companies=this.getCompanies(), drafts=this.getDrafts();
    var overdue=acts.filter(function(a){ return DateUtil.dayDiff(a.due)<0; });
    var today=acts.filter(function(a){ return DateUtil.dayDiff(a.due)===0; });
    var tomorrow=acts.filter(function(a){ return DateUtil.dayDiff(a.due)===1; });
    var ready=drafts.filter(function(d){ return d.status==='CURRENT_READY'||d.status==='APPROVED_AWAITING_SEND'; });
    var replies=companies.filter(function(c){ return c.status==='Buyer Conversation'||c.status==='Active Opportunity'; });
    return {
      actionsToday:today.length, overdue:overdue.length, tomorrow:tomorrow.length, openActions:acts.length,
      activeOpportunities:this.getOpportunities().length, draftsReady:ready.length, buyerReplies:replies.length,
      founderReview:acts.filter(function(a){ return a.founderReview; }).length,
      companies:companies.length, contacts:this.getContacts().length, hiddenStages:this.getHiddenFutureStages(),
      activities:this.getActivities().length, marketing:this.getMarketingCalendar().length
    };
  }
};

/* ============================================================================
   6. DOMAIN RULES
   ============================================================================ */
var SUPPRESSING_STATUSES=['Nurture','Do Not Contact','Strategic Hold','Stop','Closed'];

var Rules = {
  isSuppressed:function(c){ return !c || SUPPRESSING_STATUSES.indexOf(c.status)>-1; },
  isOpportunityLed:function(c){ return !!(c && (c.opportunityId || c.status==='Active Opportunity')); },
  cadenceActive:function(c){
    if(!c || Rules.isSuppressed(c) || Rules.isOpportunityLed(c)) return false;
    return !(c.outreach && c.outreach.paused);
  },
  activeActions:function(actions, companies){
    var map={}; (companies||[]).forEach(function(c){ map[c.id]=c; });
    var byCo={};
    (actions||[]).filter(function(a){ return a.status==='OPEN'; }).forEach(function(a){
      (byCo[a.companyId]=byCo[a.companyId]||[]).push(a);
    });
    var out=[];
    Object.keys(byCo).forEach(function(cid){
      var c=map[cid]; if(!c) return;
      if(Rules.isSuppressed(c)) return;
      var list=byCo[cid].slice().sort(function(a,b){
        return (DateUtil.parseDateOnly(a.due)||DateUtil.today()) - (DateUtil.parseDateOnly(b.due)||DateUtil.today());
      });
      if(Rules.isOpportunityLed(c)){
        list.filter(function(a){ return a.context!=='COLD'; }).slice(0,1).forEach(function(a){ out.push(a); });
      }else{
        var cold=list.filter(function(a){ return a.context==='COLD'; });
        var other=list.filter(function(a){ return a.context!=='COLD'; });
        if(cold.length) out.push(cold[0]);
        if(other.length) out.push(other[0]);
      }
    });
    return out.sort(function(a,b){
      return (DateUtil.parseDateOnly(a.due)||DateUtil.today()) - (DateUtil.parseDateOnly(b.due)||DateUtil.today());
    });
  },
  hiddenFutureCount:function(actions, companies, drafts){
    var map={}; (companies||[]).forEach(function(c){ map[c.id]=c; });
    var active={};
    Rules.activeActions(actions,companies).forEach(function(a){ active[a.id]=true; });
    var n=0;
    (actions||[]).forEach(function(a){
      if(a.status==='OPEN' && !active[a.id]){
        var c=map[a.companyId];
        if(c && !Rules.isSuppressed(c)) n++;
      }
    });
    (drafts||[]).forEach(function(d){ if(d.status==='PREPARED_FUTURE') n++; });
    return n;
  },
  groupActions:function(actions){
    var g={overdue:[],today:[],tomorrow:[],week:[],later:[]};
    (actions||[]).forEach(function(a){
      var n=DateUtil.dayDiff(a.due);
      if(isNaN(n)) g.later.push(a);
      else if(n<0) g.overdue.push(a);
      else if(n===0) g.today.push(a);
      else if(n===1) g.tomorrow.push(a);
      else if(n<=7) g.week.push(a);
      else g.later.push(a);
    });
    return g;
  }
};

/* ============================================================================
   7. PRESENTATION METADATA
   ============================================================================ */
var META = {
  actionType:{
    INITIAL:{label:'Initial Outreach', icon:'send', v:'blue'},
    D4:{label:'D4 Follow-up', icon:'reply', v:'blue'},
    D10:{label:'D10 Follow-up', icon:'reply', v:'blue'},
    D20:{label:'D20 Follow-up', icon:'reply', v:'blue'},
    MONTHLY:{label:'Monthly Re-engagement', icon:'refresh', v:'neutral'},
    BUYER_REVIEW:{label:'Buyer Response Review', icon:'mailOpen', v:'gold'},
    FOUNDER_REVIEW:{label:'Founder Review', icon:'eye', v:'gold'},
    OPPORTUNITY_REVIEW:{label:'Opportunity Review', icon:'diamond', v:'gold'},
    RESEARCH:{label:'Research Update', icon:'search', v:'neutral'},
    NURTURE:{label:'Nurture', icon:'pause', v:'neutral'},
    HOLD:{label:'Strategic Hold', icon:'pause', v:'amber'},
    DNC:{label:'Do Not Contact', icon:'x', v:'danger'}
  },
  status:{
    'Research':{v:'neutral',icon:'search'}, 'Approved for Outreach':{v:'blue',icon:'checkCircle'},
    'Draft Ready':{v:'blue',icon:'file'}, 'Outreach In Progress':{v:'blue',icon:'send'},
    'Buyer Conversation':{v:'gold',icon:'mailOpen'}, 'Active Opportunity':{v:'gold',icon:'diamond'},
    'Nurture':{v:'neutral',icon:'pause'}, 'Strategic Hold':{v:'amber',icon:'pause'},
    'Do Not Contact':{v:'danger',icon:'x'}, 'Closed':{v:'neutral',icon:'archive'}
  },
  activity:{
    OUTREACH_SENT:{label:'Outreach Sent', icon:'send', v:'blue'},
    FOLLOWUP_SENT:{label:'Follow-up Sent', icon:'reply', v:'blue'},
    BUYER_REPLY:{label:'Buyer Reply', icon:'mailOpen', v:'gold'},
    DRAFT_PREPARED:{label:'Draft Prepared', icon:'file', v:'neutral'},
    STATUS_CHANGE:{label:'CRM Status Change', icon:'layers', v:'neutral'},
    OPPORTUNITY_CREATED:{label:'Opportunity Created', icon:'diamond', v:'gold'},
    NURTURE:{label:'Moved to Nurture', icon:'pause', v:'neutral'},
    STRATEGIC_HOLD:{label:'Strategic Hold', icon:'shield', v:'amber'},
    CONTACT_UPDATED:{label:'Contact Updated', icon:'user', v:'neutral'},
    RESEARCH_UPDATED:{label:'Research Updated', icon:'search', v:'green'}
  },
  intel:{
    VERIFIED_FACT:{label:'Verified Fact', v:'blue', icon:'shield'},
    OBSERVATION:{label:'Observation', v:'neutral', icon:'eye'},
    HYPOTHESIS:{label:'Hypothesis', v:'amber', icon:'sparkles'},
    UNKNOWN:{label:'Unknown', v:'ghost', icon:'question'}
  },
  draft:{
    PREPARED_FUTURE:{label:'Prepared — Future Stage', v:'neutral', icon:'clock'},
    CURRENT_READY:{label:'Current — Ready for Review', v:'gold', icon:'eye'},
    APPROVED_AWAITING_SEND:{label:'Approved — Awaiting Manual Send', v:'green', icon:'checkCircle'},
    SENT_VERIFIED:{label:'Sent — Verified', v:'blue', icon:'send'},
    SUPERSEDED:{label:'Superseded', v:'ghost', icon:'history'},
    CANCELLED:{label:'Cancelled', v:'danger', icon:'x'}
  },
  confidence:{
    VERIFIED:{label:'Verified', v:'green', icon:'shield'},
    LIKELY:{label:'Likely — unconfirmed', v:'amber', icon:'info'},
    UNCONFIRMED:{label:'Unconfirmed', v:'ghost', icon:'question'}
  },
  channelColor:{Website:'#3D6A93', Content:'#B08B4F', Social:'#4C7A5C', Email:'#3D6A93', Campaign:'#A5402C', Event:'#15140F'},
  pipelineGroups:[
    {title:'Pre-outreach', color:'#A79E8D', keys:['Research','Approved for Outreach','Draft Ready']},
    {title:'Active outreach', color:'#3D6A93', keys:['Initial Sent','D4','D10','D20','Monthly']},
    {title:'Conversation', color:'#B08B4F', keys:['Buyer Conversation','Active Opportunity']},
    {title:'Outcome', color:'#857D6E', keys:['Nurture','Strategic Hold','Do Not Contact','Closed']}
  ]
};

/* ============================================================================
   8. UI PRIMITIVES
   ============================================================================ */
function esc(s){
  if(s==null) return '';
  return String(s).replace(/[&<>"]/g, function(c){
    return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':'&quot;';
  });
}
function chip(text, v, opts){
  opts=opts||{};
  var ic = opts.icon ? icon(opts.icon) : '';
  return '<span class="chip chip-'+(v||'neutral')+(opts.xs?' chip-xs':'')+'">'+ic+esc(text)+'</span>';
}
function prioClass(p){ return p==='High'?'prio-high':(p==='Medium'||p==='Medium-High')?'prio-med':'prio-low'; }
function initials(name){
  if(!name) return '—';
  var parts=String(name).trim().split(/\s+/);
  var a=(parts[0]||'').charAt(0), b=(parts[1]||'').charAt(0);
  return (a+b).toUpperCase();
}
function countryTag(c){ return c==='New Zealand'?'NZ':(c==='Australia'?'AU':String(c||'').slice(0,2).toUpperCase()); }
function safeNum(n){ return (typeof n==='number' && !isNaN(n)) ? n : 0; }

function dueMeta(a){
  var n=DateUtil.dayDiff(a && a.due);
  if(isNaN(n)) return {cls:'due-later', label:'Not scheduled', rail:'rail-later', ico:'calendar'};
  if(n<0) return {cls:'due-over', label:n===-1?'1 day overdue':Math.abs(n)+' days overdue', rail:'rail-danger', ico:'alert'};
  if(n===0) return {cls:'due-today', label:'Due today', rail:'rail-today', ico:'clock'};
  if(n===1) return {cls:'due-soon', label:'Due tomorrow', rail:'rail-soon', ico:'clock'};
  if(n<=7) return {cls:'due-soon', label:'Due '+DateUtil.short(a.due), rail:'rail-soon', ico:'clock'};
  return {cls:'due-later', label:DateUtil.short(a.due), rail:'rail-later', ico:'calendar'};
}
function draftChip(status){
  var map={ CURRENT_READY:['Draft Ready','green'], APPROVED_AWAITING_SEND:['Approved · Ready to Send','green'],
    PREPARED_FUTURE:['Draft Prepared','neutral'], SENT_VERIFIED:['Sent · Verified','blue'],
    SUPERSEDED:['Superseded','ghost'], CANCELLED:['Cancelled','danger'], NOT_DRAFTED:['No Draft','ghost'], NOT_REQUIRED:['','ghost'] };
  var m=map[status]||['','ghost'];
  if(!m[0]) return '';
  return chip(m[0], m[1], {xs:true});
}

function actionCard(a, opts){
  opts=opts||{};
  var c=CRM.getCompanyById(a.companyId);
  if(!c) return '';
  var t=META.actionType[a.type]||{label:a.type||'Action', icon:'bolt', v:'neutral'};
  var d=dueMeta(a);
  var opp = a.context==='OPPORTUNITY';
  return '<article class="acard" data-nav="#/company/'+esc(c.id)+'" role="button" tabindex="0">'+
    '<span class="acard-rail '+d.rail+'"></span>'+
    '<span class="acard-ico ico-'+t.v+'">'+icon(t.icon)+'</span>'+
    '<div class="acard-main">'+
      '<div class="acard-top"><h3>'+esc(c.name)+'</h3><span class="prio '+prioClass(a.priority)+'">'+esc(a.priority||'—')+'</span></div>'+
      '<div class="acard-meta">'+countryTag(c.country)+' · '+esc(c.buyerType)+'</div>'+
      '<div class="acard-title">'+esc(t.label)+
        (a.founderReview? chip('Founder Review','gold',{xs:true,icon:'eye'}) : '')+
        (opp? chip('Opportunity','blue',{xs:true,icon:'diamond'}) : chip('Cold','ghost',{xs:true}))+
      '</div>'+
      '<div class="acard-foot">'+
        '<span class="due '+d.cls+'">'+icon(d.ico)+esc(d.label)+'</span>'+
        draftChip(a.draftStatus)+
        chip(c.stage||c.pipelineStage||'—','neutral',{xs:true})+
      '</div>'+
      (opts.note && a.note? '<p class="hint" style="margin-top:8px">'+esc(a.note)+'</p>':'')+
    '</div>'+
    '<span class="acard-chev">'+icon('chevR')+'</span>'+
  '</article>';
}

function companyRow(c){
  var st=META.status[c.status]||{v:'neutral'};
  var off=Rules.isSuppressed(c);
  var cls='crow'+(c.priority==='High' && !off?' is-high':'')+(c.opportunityId?' is-opp':'')+(off?' is-off':'');
  var na=c.nextAction||{};
  return '<article class="'+cls+'" data-nav="#/company/'+esc(c.id)+'" role="button" tabindex="0">'+
    '<div class="crow-head">'+
      '<div class="cmono'+(off?' alt':'')+'">'+esc(initials(c.name))+'</div>'+
      '<div class="crow-id"><h3>'+esc(c.name)+'</h3>'+
        '<div class="crow-sub">'+esc(c.buyerType)+(c.altName?' · '+esc(c.altName):'')+'</div></div>'+
      '<span class="flagtag">'+countryTag(c.country)+'</span>'+
    '</div>'+
    '<div class="crow-badges">'+
      chip(c.status, st.v, {xs:true, icon:st.icon})+
      (c.stage && ['Initial','D4','D10','D20','Monthly'].indexOf(c.stage)>-1 ? chip(c.stage,'blue',{xs:true}) : '')+
      (c.opportunityId? chip('Opportunity','gold',{xs:true,icon:'diamond'}) : '')+
      (c.priority==='High'? chip('High priority','danger',{xs:true,icon:'flag'}) : '')+
      (c.commercialFit && c.commercialFit!=='None'? chip('Fit · '+c.commercialFit,'ghost',{xs:true}) : '')+
    '</div>'+
    '<div class="crow-next"><span class="nlabel">Next</span><span class="ntxt">'+esc(na.label||'—')+
      (na.date? ' · <b>'+esc(DateUtil.label(na.date))+'</b>' : (off? ' · <b>suppressed</b>':''))+'</span></div>'+
  '</article>';
}

function activityItem(ev){
  var m=META.activity[ev.type]||{label:ev.type||'Activity', icon:'pulse', v:'neutral'};
  var c=CRM.getCompanyById(ev.companyId);
  return '<div class="tl-item">'+
    '<span class="tl-ico ico-'+m.v+'">'+icon(m.icon)+'</span>'+
    '<div class="tl-body">'+
      '<div class="tl-top"><span class="tl-title">'+esc(ev.title||m.label)+'</span><span class="tl-time">'+esc(DateUtil.timeAgo(ev.at))+'</span></div>'+
      (c? '<a class="tl-co" href="#/company/'+esc(c.id)+'">'+esc(c.name)+'</a>' : '')+
      '<p class="tl-desc">'+esc(ev.description)+'</p>'+
      '<div class="tl-agent">'+icon('user')+esc(ev.agent||'CRM')+(ev.channel?' · '+esc(ev.channel):'')+'</div>'+
    '</div></div>';
}

function intelRow(item){
  var m=META.intel[item.type]||META.intel.UNKNOWN;
  var cls=item.type==='VERIFIED_FACT'?'intel-verified':item.type==='OBSERVATION'?'intel-observed':item.type==='HYPOTHESIS'?'intel-hypothesis':'intel-unknown';
  return '<div class="intel '+cls+'">'+
    '<div class="intel-head">'+chip(m.label, m.v, {xs:true, icon:m.icon})+
      (item.date? '<span style="font-size:10.5px;color:var(--muted-2);margin-left:auto">'+esc(DateUtil.short(item.date))+'</span>':'')+'</div>'+
    '<div class="intel-title">'+esc(item.title)+'</div>'+
    '<p class="intel-detail">'+esc(item.detail)+'</p>'+
    (item.type==='HYPOTHESIS'? '<div class="intel-warn">'+icon('alert')+'<span>Hypothesis — SHALVADZE analysis. Not verified with the buyer and must not be presented as fact.</span></div>':'')+
    (item.type==='UNKNOWN'? '<div class="intel-warn" style="color:var(--muted)">'+icon('search')+'<span>Research required — open question in the buying intelligence file.</span></div>':'')+
    (item.source? '<div class="intel-src">'+icon('file')+esc(item.source)+'</div>':'')+
  '</div>';
}

function contactBlock(ct, opts){
  opts=opts||{};
  var conf=META.confidence[ct.confidence]||META.confidence.UNCONFIRMED;
  var verified = ct.confidence==='VERIFIED';
  return '<div class="contact">'+
    '<div class="avatar'+(verified?'':' unverified')+'">'+esc(ct.name?initials(ct.name):'?')+'</div>'+
    '<div class="contact-main">'+
      '<h4>'+esc(ct.name||'No named buyer confirmed')+'</h4>'+
      '<div class="ct">'+esc(ct.title||'—')+'</div>'+
      '<div style="margin-top:7px">'+chip(conf.label, conf.v, {xs:true, icon:conf.icon})+'</div>'+
      '<div class="contact-lines">'+
        (ct.email? '<div class="cline">'+icon('mail')+esc(ct.email)+'<button class="copybtn" data-copy="'+esc(ct.email)+'" aria-label="Copy email">'+icon('copy')+'</button></div>':'')+
        (ct.phone? '<div class="cline">'+icon('phone')+esc(ct.phone)+'<button class="copybtn" data-copy="'+esc(ct.phone)+'" aria-label="Copy phone">'+icon('copy')+'</button></div>':'')+
        (!ct.email && !ct.phone? '<div class="cline" style="color:var(--muted-2)">'+icon('eyeOff')+'No direct channel recorded</div>':'')+
        (ct.source && ct.source!=='—'? '<div class="cline" style="color:var(--muted)">'+icon('database')+'Source: '+esc(ct.source)+'</div>':'')+
        (ct.status? '<div class="cline" style="color:var(--muted)">'+icon('info')+esc(ct.status)+'</div>':'')+
      '</div>'+
      (ct.notes? '<p class="hint" style="margin-top:8px">'+esc(ct.notes)+'</p>':'')+
    '</div></div>';
}

function cadenceTrack(o){
  if(!o || !isArr(o.steps) || !o.steps.length) return '';
  return '<div class="cadence">'+o.steps.map(function(s){
    var cls = s.state==='COMPLETED'?'done':s.state==='CURRENT'?'current':((s.state==='PAUSED'||s.state==='CANCELLED'||s.state==='SUPERSEDED')?'paused':'');
    return '<div class="cstep '+cls+'"><span class="cdot"></span><span class="cl">'+esc(s.label)+'</span>'+
      '<span class="cd">'+(s.date? esc(DateUtil.short(s.date)):'—')+'</span></div>';
  }).join('')+'</div>';
}

function emptyState(title, body, ico){
  return '<div class="empty"><div class="eico">'+icon(ico||'search')+'</div><h4>'+esc(title)+'</h4><p>'+esc(body)+'</p></div>';
}

function skeleton(){
  return '<div class="page"><div class="sk-tiles">'+
    '<div class="sk" style="grid-column:1/-1;height:96px;border-radius:16px"></div>'+
    '<div class="sk" style="height:78px;border-radius:16px"></div>'+
    '<div class="sk" style="height:78px;border-radius:16px"></div></div>'+
    '<div class="sk" style="height:14px;width:40%;margin:22px 0 12px"></div>'+
    '<div class="sk sk-card"></div><div class="sk sk-card"></div><div class="sk sk-card"></div><div class="sk sk-card"></div></div>';
}

function toast(msg, ico){
  var root=document.getElementById('toasts'); if(!root) return;
  var el=document.createElement('div');
  el.className='toast';
  el.innerHTML=icon(ico||'checkCircle')+'<span>'+esc(msg)+'</span>';
  root.appendChild(el);
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },260); }, 2200);
}

function debounce(fn,ms){ var t; return function(){ var a=arguments, self=this; clearTimeout(t); t=setTimeout(function(){ fn.apply(self,a); }, ms||150); }; }

/* ============================================================================
   9. SHEETS (bottom drawers)
   ============================================================================ */
var Sheets = {
  open:function(html, opts){
    opts=opts||{};
    var root=document.getElementById('sheetroot'); if(!root) return;
    root.innerHTML='<div class="backdrop" data-act="close-sheet"></div>'+
      '<div class="sheet" role="dialog" aria-modal="true">'+
      '<div class="sheet-grip"></div>'+
      (opts.title? '<div class="sheet-head"><h3>'+esc(opts.title)+'</h3><button class="sheet-close" data-act="close-sheet" aria-label="Close">'+icon('close')+'</button></div>':'')+
      '<div class="sheet-body">'+html+'</div></div>';
    root.style.pointerEvents='auto';
    var bd=root.querySelector('.backdrop'), sh=root.querySelector('.sheet');
    requestAnimationFrame(function(){ if(bd) bd.classList.add('on'); if(sh) sh.classList.add('on'); });
    var view=document.getElementById('view'); if(view) view.classList.add('no-scroll');
  },
  close:function(){
    var root=document.getElementById('sheetroot'); if(!root) return;
    var bd=root.querySelector('.backdrop'), sh=root.querySelector('.sheet');
    if(!sh) return;
    bd.classList.remove('on'); sh.classList.remove('on');
    var view=document.getElementById('view'); if(view) view.classList.remove('no-scroll');
    setTimeout(function(){ root.innerHTML=''; root.style.pointerEvents='none'; }, 320);
  },
  menuItem:function(href, ico, title, desc, count){
    return '<a class="menu-item" href="'+href+'" data-act="nav-link"><span class="mi-ico">'+icon(ico)+'</span>'+
      '<span class="mi-txt"><span class="mi-t">'+esc(title)+'</span><span class="mi-d">'+esc(desc)+'</span></span>'+
      (count!=null? '<span class="mi-count">'+count+'</span>' : '<span class="mi-chev">'+icon('chevR')+'</span>')+'</a>';
  }
};

function openMoreSheet(){
  var st=CRM.getStats();
  var html=
    '<div class="menu-group"><div class="micro" style="margin:2px 2px 6px">Pipeline &amp; people</div>'+
      Sheets.menuItem('#/contacts','users','Contacts','Buyers, confidence and verification status', st.contacts)+
      Sheets.menuItem('#/opportunities','diamond','Opportunities','Live commercial conversations', st.activeOpportunities)+
      Sheets.menuItem('#/drafts','mail','Email Drafts','Current, future sequence, superseded', st.draftsReady)+
    '</div>'+
    '<div class="menu-group"><div class="micro" style="margin:2px 2px 6px">Planning</div>'+
      Sheets.menuItem('#/marketing','megaphone','Marketing Calendar','Campaigns, content, social and events', st.marketing)+
      Sheets.menuItem('#/pipeline','trendUp','Pipeline Summary','Stage counts across the whole book', st.companies)+
    '</div>'+
    '<div class="menu-group"><div class="micro" style="margin:2px 2px 6px">System</div>'+
      Sheets.menuItem('#/settings','database','Settings &amp; Data Status','Source, cache, schema and architecture', null)+
    '</div>'+
    '<div class="banner ink" style="margin-top:4px">'+icon('lock')+
      '<p><b style="color:#EDE6D6">Read-only prototype.</b> The Google Sheet remains the source of truth. No add, edit, delete, send or status change is possible from this app.</p></div>';
  Sheets.open(html, {title:'More'});
}

function openSourceSheet(){
  var st=CRM.state, meta=CRM.getMeta();
  var rows=[['Companies',CRM.getCompanies().length],['Contacts',CRM.getContacts().length],['Actions',CRM.getActions().length],
    ['Activities',CRM.getActivities().length],['Opportunities',CRM.getOpportunities().length],['Drafts',CRM.getDrafts().length],
    ['Marketing items',CRM.getMarketingCalendar().length]];
  var html=
    '<div class="card pad" style="margin-bottom:12px">'+
      '<div class="kv"><span class="k">Active source</span><span class="v">'+esc(st.source)+'</span></div>'+
      '<div class="kv"><span class="k">Mode</span><span class="v">'+esc(st.mode==='remote'?'remote (API)':'local (JSON)')+'</span></div>'+
      '<div class="kv"><span class="k">Document</span><span class="v" style="font-size:11.5px">'+esc(meta.sourceLabel||CRM_CONFIG.localPath)+'</span></div>'+
      '<div class="kv"><span class="k">Endpoint</span><span class="v" style="font-size:11.5px">'+esc(st.endpoint||'CRM_API_ENDPOINT (not set)')+'</span></div>'+
      '<div class="kv"><span class="k">Last sync</span><span class="v">'+(st.loadedAt? esc(DateUtil.timeAgo(st.loadedAt)):'—')+'</span></div>'+
      '<div class="kv"><span class="k">Storage</span><span class="v">'+(st.storage?'localStorage available':'in-memory only')+'</span></div>'+
      '<div class="kv"><span class="k">Schema</span><span class="v">v'+esc(meta.schemaVersion||'1.0.0')+'</span></div>'+
      (st.fromCache? '<div class="banner" style="margin:10px 0 0">'+icon('alert')+'<p>Serving cached snapshot — live source unavailable.</p></div>':'')+
    '</div>'+
    '<div class="micro" style="margin:0 2px 8px">Records in snapshot</div>'+
    '<div class="card pad" style="margin-bottom:14px">'+
      rows.map(function(r){ return '<div class="kv"><span class="k">'+esc(r[0])+'</span><span class="v mono">'+safeNum(r[1])+'</span></div>'; }).join('')+
    '</div>'+
    '<button class="btn btn-dark btn-block" data-act="refresh-close">'+icon('refresh')+'Refresh now</button>'+
    '<a class="btn btn-block" style="margin-top:9px" href="#/settings" data-act="nav-link">'+icon('database')+'Open Settings &amp; Data Status</a>';
  Sheets.open(html, {title:'Data Status'});
}

function openCadenceSheet(){
  var rules=[['Buyer replies','Cold sequence is superseded — conversation-led follow-up only.'],
    ['Nurture','No active outreach. Completed history stays visible.'],
    ['Strategic Hold','Outreach suppressed pending a founder decision.'],
    ['Do Not Contact / Stop / Closed','Permanently suppressed from all outreach and marketing lists.'],
    ['Active Opportunity','Removed from cold cadence — opportunity actions only.']];
  var cadence=['Initial outreach','D4 — first follow-up','D10 — value refresh','D20 — final touch','Monthly re-engagement on the 15th'];
  var html=
    '<div class="banner info">'+icon('info')+'<p>The Action Center only ever shows the <b>current operational next action</b> for each company. Future D4 / D10 / D20 stages stay hidden until they become current — even when draft copy already exists.</p></div>'+
    '<div class="micro" style="margin:4px 2px 9px">Cold outreach cadence</div>'+
    '<div class="card pad" style="margin-bottom:12px">'+
      cadence.map(function(s,i){ return '<div class="kv"><span class="k">'+(i+1)+'</span><span class="v" style="text-align:left">'+esc(s)+'</span></div>'; }).join('')+
    '</div>'+
    '<div class="micro" style="margin:4px 2px 9px">Suppression rules</div>'+
    '<div class="card pad" style="margin-bottom:12px">'+
      rules.map(function(r){ return '<div class="opp-row"><div class="or-l">'+esc(r[0])+'</div><div class="or-v">'+esc(r[1])+'</div></div>'; }).join('')+
    '</div>'+
    '<div class="note">'+icon('shield')+'<span>Gmail is the communication evidence layer. Only actually-sent messages are shown as completed in the cadence track.</span></div>';
  Sheets.open(html, {title:'Cadence &amp; CRM Rules'});
}

/* ============================================================================
   10. UI STATE + ROUTER
   ============================================================================ */
var UIState = {
  route:{name:'dashboard', params:[]},
  filters:{action:'all', company:'all', activity:'all', contactCountry:'all'},
  companyQuery:'', contactQuery:'',
  marketingView:'agenda', calOffset:0, calSelected:null,
  scroll:{}
};

var ROUTES={
  dashboard:{tab:'dashboard', title:'Dashboard'},
  actions:{tab:'actions', title:'Action Center'},
  companies:{tab:'companies', title:'Companies'},
  company:{tab:'companies', title:'Company', detail:true},
  activity:{tab:'activity', title:'Activity'},
  contacts:{tab:'more', title:'Contacts'},
  opportunities:{tab:'more', title:'Opportunities'},
  opportunity:{tab:'more', title:'Opportunity', detail:true},
  drafts:{tab:'more', title:'Email Drafts'},
  draft:{tab:'more', title:'Draft', detail:true},
  marketing:{tab:'more', title:'Marketing Calendar'},
  pipeline:{tab:'more', title:'Pipeline Summary'},
  settings:{tab:'more', title:'Settings &amp; Data Status'}
};

var TABS=[
  {id:'dashboard', label:'Home', icon:'dashboard', href:'#/dashboard'},
  {id:'actions', label:'Actions', icon:'bolt', href:'#/actions'},
  {id:'companies', label:'Companies', icon:'building', href:'#/companies'},
  {id:'activity', label:'Activity', icon:'pulse', href:'#/activity'},
  {id:'more', label:'More', icon:'dots', href:null, act:'open-more'}
];

function parseHash(){
  var h=(location.hash||'#/dashboard').replace(/^#\/?/,'');
  var parts=h.split('/').filter(Boolean);
  var name=parts[0]||'dashboard';
  return {name:ROUTES[name]?name:'dashboard', params:parts.slice(1)};
}
function navigate(hash){ if(location.hash===hash) renderRoute(); else location.hash=hash; }

function renderTabbar(){
  var tb=document.getElementById('tabbar'); if(!tb) return;
  var active=(ROUTES[UIState.route.name]||{}).tab;
  var st=CRM.getStats();
  var badge = st.overdue>0 ? st.overdue : (st.actionsToday>0? st.actionsToday : 0);
  tb.innerHTML=TABS.map(function(t){
    var on=t.id===active;
    return '<button class="tab'+(on?' on':'')+'" '+(t.href? 'data-nav="'+t.href+'"' : 'data-act="'+t.act+'"')+
      ' aria-label="'+t.label+'"'+(on?' aria-current="page"':'')+'>'+
      icon(t.icon)+'<span>'+t.label+'</span>'+
      (t.id==='actions' && badge? '<span class="badge">'+badge+'</span>':'')+'</button>';
  }).join('');
}

function renderPagebar(){
  var bar=document.getElementById('pagebar'); if(!bar) return;
  var r=UIState.route, meta=ROUTES[r.name]||{};
  var title=meta.title||'', sub='', right='', back=null;

  if(r.name==='dashboard'){ title='Dashboard'; sub=esc(DateUtil.fullToday())+' · AU / NZ focus'; }
  else if(r.name==='actions'){ var s1=CRM.getStats(); title='Action Center'; sub=s1.openActions+' current actions · '+s1.overdue+' overdue'; }
  else if(r.name==='companies'){ title='Companies'; sub=CRM.getCompanies().length+' records in the book'; }
  else if(r.name==='activity'){ title='Activity Log'; sub=CRM.getActivities().length+' events · newest first'; }
  else if(r.name==='contacts'){ title='Contacts'; sub=CRM.getContacts().length+' contact records'; }
  else if(r.name==='opportunities'){ title='Opportunities'; sub=CRM.getOpportunities().length+' live commercial conversations'; }
  else if(r.name==='drafts'){ var s2=CRM.getStats(); title='Email Drafts'; sub=s2.draftsReady+' ready for review or send'; }
  else if(r.name==='pipeline'){ title='Pipeline Summary'; sub='Derived live from company records'; }
  else if(r.name==='settings'){ title='Settings &amp; Data Status'; sub='Source, cache, schema, architecture'; }
  else if(r.name==='marketing'){
    title='Marketing Calendar'; sub='Campaigns &amp; content — separate from outreach';
    right='<div class="segbtns"><button data-act="mk-view" data-val="agenda" class="'+(UIState.marketingView==='agenda'?'on':'')+'">Agenda</button>'+
          '<button data-act="mk-view" data-val="month" class="'+(UIState.marketingView==='month'?'on':'')+'">Month</button></div>';
  }
  else if(r.name==='company'){ var c=CRM.getCompanyById(r.params[0]); back='#/companies';
    title=c?esc(c.name):'Company'; sub=c?esc(c.crmId)+' · '+esc(c.country):'Not found'; }
  else if(r.name==='opportunity'){ var o=CRM.getOpportunityById(r.params[0]); back='#/opportunities';
    title=o?esc(o.company):'Opportunity'; sub=o?esc(o.status):'Not found'; }
  else if(r.name==='draft'){ var d=CRM.getDraftById(r.params[0]); back='#/drafts';
    title='Email Draft'; sub=d?esc((CRM.getCompanyById(d.companyId)||{}).name||'')+' · '+esc(d.stage):''; }

  bar.innerHTML=(back? '<button class="backbtn" data-nav="'+back+'" aria-label="Back">'+icon('back')+'</button>':'')+
    '<div class="pgtext"><h1>'+title+'</h1>'+(sub?'<div class="pgsub">'+sub+'</div>':'')+'</div>'+
    (right? '<div class="pgright">'+right+'</div>':'');
}

/* every page render is isolated: a broken screen can never freeze the shell */
function safePage(fn){
  try{ return fn(); }
  catch(err){
    console.error('[SHALVADZE CRM] page render error:', err);
    return '<div class="errorbox"><h4>This screen could not render</h4><p>'+esc((err && err.message)||'Unknown error')+'</p>'+
      '<button class="btn btn-dark btn-block" style="margin-top:14px" data-nav="#/dashboard">Back to Dashboard</button></div>';
  }
}

function renderRoute(){
  var prev=UIState.route.name;
  UIState.route=parseHash();
  var view=document.getElementById('view'); if(!view) return;
  var r=UIState.route;

  if(!CRM._snapshot){
    view.innerHTML=skeleton();
    renderPagebar(); renderTabbar();
    return;
  }

  var html='', slide=false;
  switch(r.name){
    case 'actions':       html=safePage(Pages.actions); break;
    case 'companies':     html=safePage(Pages.companies); break;
    case 'company':       html=safePage(function(){ return Pages.company(r.params[0]); }); slide=true; break;
    case 'activity':      html=safePage(Pages.activity); break;
    case 'contacts':      html=safePage(Pages.contacts); break;
    case 'opportunities': html=safePage(Pages.opportunities); break;
    case 'opportunity':   html=safePage(function(){ return Pages.opportunity(r.params[0]); }); slide=true; break;
    case 'drafts':        html=safePage(Pages.drafts); break;
    case 'draft':         html=safePage(function(){ return Pages.draft(r.params[0]); }); slide=true; break;
    case 'marketing':     html=safePage(Pages.marketing); break;
    case 'pipeline':      html=safePage(Pages.pipeline); break;
    case 'settings':      html=safePage(Pages.settings); break;
    case 'dashboard':
    default:              html=safePage(Pages.dashboard); break;
  }

  view.innerHTML='<div class="page'+(slide?' slide-in':'')+'">'+html+'</div>';
  renderPagebar(); renderTabbar(); updateSourcePill();
  view.scrollTop = (UIState.scroll[r.name] && prev===r.name) ? UIState.scroll[r.name] : 0;
  try{ Pages.afterRender(r.name); }catch(e){ console.warn('[CRM] afterRender', e); }
}

function updateSourcePill(){
  var pill=document.getElementById('srcPill'), lbl=document.getElementById('srcLabel');
  if(!pill || !lbl) return;
  var st=CRM.state;
  pill.classList.toggle('is-error', !!st.error && !st.ready);
  pill.classList.toggle('is-stale', !!st.fromCache || !!(st.loadedAt && Date.now()-st.loadedAt > CRM_CONFIG.cacheTtlMs));
  lbl.textContent = st.mode==='remote' ? (st.fromCache?'CACHED':'LIVE') : (st.fromCache?'CACHED':'LOCAL');
}

/* ============================================================================
   11. PAGES
   ============================================================================ */
var Pages = {

  dashboard:function(){
    var st=CRM.getStats(), meta=CRM.getMeta();
    var acts=CRM.getActiveActions();
    var groups=Rules.groupActions(acts);
    var todayish=groups.overdue.concat(groups.today);
    var upcoming=acts.filter(function(a){ var n=DateUtil.dayDiff(a.due); return !isNaN(n) && n>0; }).slice(0,7);
    var important=CRM.getCompanies()
      .filter(function(c){ return !Rules.isSuppressed(c) && (c.opportunityId || c.priority==='High'); })
      .sort(function(a,b){ return (b.opportunityId?1:0)-(a.opportunityId?1:0); }).slice(0,4);
    var recent=CRM.getActivities().slice(0,5);
    var h='';

    if(CRM.state.fromCache){
      h+='<div class="banner">'+icon('alert')+'<p>Showing a cached snapshot. The live source could not be reached — pull down or tap refresh to retry.</p></div>';
    }

    h+='<div class="greet"><div><div class="g-hi">'+esc(DateUtil.greeting())+', '+esc(meta.owner||'Taha')+'</div>'+
       '<div class="g-sub">'+icon('globe')+'Australia &amp; New Zealand · '+esc(meta.brand||'SHALVADZE')+' sourcing</div></div>'+
       '<div class="g-mark"><div class="gm-l">Pipeline</div><div class="gm-v">'+safeNum(st.companies)+' companies</div></div></div>';

    h+='<div class="tiles">'+
      '<button class="tile tile-featured" data-nav="#/actions"><span class="tile-label">Actions Today</span>'+
        '<span class="tile-value">'+safeNum(st.actionsToday)+'</span>'+
        '<span class="tile-sub">'+(st.overdue? st.overdue+' overdue · ':'')+safeNum(st.openActions)+' current actions in total</span>'+
        '<span class="tile-ico">'+icon('bolt')+'</span></button>'+
      '<button class="tile'+(st.overdue?' tile-alert':'')+'" data-act="filter-actions" data-val="overdue"><span class="tile-label">Overdue</span>'+
        '<span class="tile-value">'+safeNum(st.overdue)+'</span><span class="tile-sub">'+(st.overdue?'Needs a decision today':'Nothing overdue')+'</span>'+
        '<span class="tile-ico">'+icon('alert')+'</span></button>'+
      '<button class="tile tile-gold" data-nav="#/opportunities"><span class="tile-label">Active Opportunities</span>'+
        '<span class="tile-value">'+safeNum(st.activeOpportunities)+'</span><span class="tile-sub">'+safeNum(st.buyerReplies)+' buyer conversations</span>'+
        '<span class="tile-ico">'+icon('diamond')+'</span></button>'+
      '<button class="tile" data-nav="#/drafts"><span class="tile-label">Drafts Ready</span>'+
        '<span class="tile-value">'+safeNum(st.draftsReady)+'</span><span class="tile-sub">'+safeNum(st.founderReview)+' awaiting founder review</span>'+
        '<span class="tile-ico">'+icon('mail')+'</span></button>'+
      '<button class="tile tile-blue" data-act="filter-activity" data-val="replies"><span class="tile-label">Buyer Replies</span>'+
        '<span class="tile-value">'+safeNum(st.buyerReplies)+'</span><span class="tile-sub">Cold sequence superseded</span>'+
        '<span class="tile-ico">'+icon('mailOpen')+'</span></button>'+
    '</div>';

    h+='<div class="sechead"><h2 class="seclabel">Important Accounts</h2><a class="seclink" href="#/companies">All companies'+icon('chevR')+'</a></div>';
    if(!important.length){
      h+=emptyState('No priority accounts','Nothing is flagged high priority in this snapshot.','flag');
    }else{
      h+='<div class="hscroll">'+important.map(function(c){
        var stt=META.status[c.status]||{v:'neutral'};
        var na=c.nextAction||{};
        return '<article class="snapcard'+(c.opportunityId?' dark':'')+'" data-nav="#/company/'+esc(c.id)+'" role="button" tabindex="0">'+
          '<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">'+
            '<div style="min-width:0"><h3 style="font-size:15px;font-weight:600;letter-spacing:-.01em;line-height:1.25">'+esc(c.name)+'</h3>'+
            '<div class="sc-sub" style="font-size:11px;color:'+(c.opportunityId?'#9C927E':'var(--muted)')+';margin-top:3px">'+countryTag(c.country)+' · '+esc(c.crmId)+'</div></div>'+
            (c.priority==='High'? '<span class="prio '+(c.opportunityId?'':'prio-high')+'" style="'+(c.opportunityId?'color:#C6A15B':'')+'">High</span>':'')+'</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:11px">'+chip('Status: '+c.status, c.opportunityId?'gold':stt.v, {xs:true})+'</div>'+
          '<div style="margin-top:11px;padding-top:10px;border-top:1px dashed '+(c.opportunityId?'rgba(255,255,255,.14)':'var(--line)')+';font-size:11.5px;line-height:1.5;color:'+(c.opportunityId?'#C9C0AE':'var(--ink-3)')+'">'+
            esc(na.label||'—')+'<div style="margin-top:5px;opacity:.8">Next review · <b>'+(na.date? esc(DateUtil.label(na.date)):'not scheduled')+'</b></div></div>'+
        '</article>';
      }).join('')+'</div>';
    }

    h+='<div class="sechead"><h2 class="seclabel">Today\'s Actions</h2><a class="seclink" href="#/actions">Action Center'+icon('chevR')+'</a></div>';
    h+= todayish.length ? todayish.slice(0,5).map(function(a){ return actionCard(a,{note:true}); }).join('')
      : emptyState('Nothing due today','The outreach cadence is clear. Next action is '+(upcoming[0]? esc(DateUtil.label(upcoming[0].due)):'not scheduled')+'.','checkCircle');

    h+='<div class="sechead"><h2 class="seclabel">Recent Activity</h2><a class="seclink" href="#/activity">Full log'+icon('chevR')+'</a></div>';
    h+='<div class="card pad">'+(recent.length? '<div class="tl">'+recent.map(activityItem).join('')+'</div>' : '<p class="hint">No activity recorded.</p>')+'</div>';

    h+='<div class="sechead"><h2 class="seclabel">Upcoming</h2><span class="seccount">Next '+upcoming.length+'</span></div>';
    h+='<div class="card pad" style="padding:6px 14px">'+(upcoming.length? upcoming.map(function(a){
      var c=CRM.getCompanyById(a.companyId)||{};
      var t=META.actionType[a.type]||{label:a.type||'Action'};
      var n=DateUtil.dayDiff(a.due);
      return '<a class="kv" href="#/company/'+esc(c.id||'')+'" style="display:flex;align-items:center;gap:10px">'+
        '<span class="k" style="flex:0 0 62px;font-weight:700;color:'+(n<=1?'var(--gold)':'var(--muted)')+'">'+esc(n===1?'Tomorrow':DateUtil.short(a.due))+'</span>'+
        '<span class="v" style="text-align:left;flex:1;min-width:0"><span style="display:block;font-weight:600;font-size:12.5px">'+esc(c.name||'')+'</span>'+
        '<span style="display:block;font-size:11px;color:var(--muted);font-weight:500;margin-top:2px">'+esc(t.label)+(a.founderReview?' · Founder review':'')+'</span></span>'+
        '<span style="color:var(--muted-2)">'+icon('chevR')+'</span></a>';
    }).join('') : '<p class="hint" style="padding:8px 0">No upcoming actions scheduled.</p>')+'</div>';

    h+='<div class="note" style="margin-top:16px">'+icon('info')+'<span>'+safeNum(st.hiddenStages)+' future cadence stages are hidden until they become current. Read-only view of the Google Sheets CRM.</span></div>';
    h+='<div class="footmark">SHALVADZE · <b>Founder CRM</b> · read-only prototype</div>';
    return h;
  },

  actions:function(){
    var st=CRM.getStats();
    return '<div class="rule-strip" data-act="open-cadence" role="button" tabindex="0">'+icon('info')+
      '<p><b>One current action per company.</b> Future D4 / D10 / D20 stages stay hidden until they become current — '+safeNum(st.hiddenStages)+' suppressed. Tap for the rules.</p></div>'+
      '<div id="actionFilters">'+Pages.actionFilters()+'</div>'+
      '<div id="actionsWrap">'+Pages.actionsBody()+'</div>';
  },
  actionFilters:function(){
    var acts=CRM.getActiveActions();
    var defs=[['all','All',acts.length],
      ['today','Today',acts.filter(function(a){return DateUtil.dayDiff(a.due)===0;}).length],
      ['overdue','Overdue',acts.filter(function(a){var n=DateUtil.dayDiff(a.due);return !isNaN(n)&&n<0;}).length],
      ['INITIAL','Initial',acts.filter(function(a){return a.type==='INITIAL';}).length],
      ['D4','D4',acts.filter(function(a){return a.type==='D4';}).length],
      ['D10','D10',acts.filter(function(a){return a.type==='D10';}).length],
      ['D20','D20',acts.filter(function(a){return a.type==='D20';}).length],
      ['MONTHLY','Monthly',acts.filter(function(a){return a.type==='MONTHLY';}).length],
      ['opportunities','Opportunities',acts.filter(function(a){return a.context==='OPPORTUNITY';}).length],
      ['founder','Founder Review',acts.filter(function(a){return a.founderReview;}).length]];
    return '<div class="chipbar">'+defs.map(function(d){
      return '<button class="fchip'+(UIState.filters.action===d[0]?' on':'')+'" data-act="filter" data-group="action" data-val="'+d[0]+'">'+
        esc(d[1])+'<span class="cnt">'+safeNum(d[2])+'</span></button>';
    }).join('')+'</div>';
  },
  actionsBody:function(){
    var acts=CRM.getActiveActions(), f=UIState.filters.action;
    if(f==='today') acts=acts.filter(function(a){ return DateUtil.dayDiff(a.due)===0; });
    else if(f==='overdue') acts=acts.filter(function(a){ var n=DateUtil.dayDiff(a.due); return !isNaN(n)&&n<0; });
    else if(f==='opportunities') acts=acts.filter(function(a){ return a.context==='OPPORTUNITY'; });
    else if(f==='founder') acts=acts.filter(function(a){ return a.founderReview; });
    else if(['INITIAL','D4','D10','D20','MONTHLY'].indexOf(f)>-1) acts=acts.filter(function(a){ return a.type===f; });

    if(!acts.length) return emptyState('No actions in this view','Nothing matches this filter right now. The cadence is either complete or suppressed for these accounts.','checkCircle');

    var g=Rules.groupActions(acts);
    var sections=[['overdue','Overdue','g-over'],['today','Today','g-today'],['tomorrow','Tomorrow','g-tomorrow'],['week','This Week','g-week'],['later','Later','g-later']];
    var h='';
    sections.forEach(function(s){
      var list=g[s[0]]; if(!list.length) return;
      h+='<div class="group"><div class="grouphead '+s[2]+'"><span class="gl">'+s[1]+'</span><span class="gc">'+list.length+'</span><span class="gr"></span></div>'+
        list.map(function(a){ return actionCard(a,{note:f!=='all'}); }).join('')+'</div>';
    });
    h+='<div class="note">'+icon('shield')+'<span>Only actually-sent communication appears as completed. Drafts that exist for future stages are shown in Email Drafts, never as due actions.</span></div>';
    return h;
  },

  companies:function(){
    return '<div class="searchwrap">'+icon('search')+
      '<input class="search" id="companySearch" type="search" placeholder="Search companies…" value="'+esc(UIState.companyQuery)+'" autocomplete="off" aria-label="Search companies" />'+
      (UIState.companyQuery? '<button class="searchclear" data-act="clear-company-search" aria-label="Clear">'+icon('close')+'</button>':'')+'</div>'+
      '<div id="companyFilters">'+Pages.companyFilters()+'</div>'+
      '<div id="companiesWrap">'+Pages.companiesBody()+'</div>';
  },
  companyFilters:function(){
    var cs=CRM.getCompanies();
    var defs=[['all','All',cs.length],
      ['AU','Australia',cs.filter(function(c){return c.country==='Australia';}).length],
      ['NZ','New Zealand',cs.filter(function(c){return c.country==='New Zealand';}).length],
      ['active','Active Outreach',cs.filter(function(c){ return !Rules.isSuppressed(c) && !c.opportunityId && ['Initial Sent','D4','D10','D20','Monthly','Draft Ready','Approved for Outreach'].indexOf(c.pipelineStage)>-1; }).length],
      ['opportunity','Opportunity',cs.filter(function(c){return !!c.opportunityId;}).length],
      ['nurture','Nurture',cs.filter(function(c){return c.status==='Nurture';}).length],
      ['hold','Strategic Hold',cs.filter(function(c){return c.status==='Strategic Hold';}).length],
      ['dnc','Do Not Contact',cs.filter(function(c){return c.status==='Do Not Contact';}).length],
      ['research','Research',cs.filter(function(c){return c.status==='Research';}).length],
      ['high','High Priority',cs.filter(function(c){return c.priority==='High';}).length]];
    return '<div class="chipbar">'+defs.map(function(d){
      return '<button class="fchip'+(UIState.filters.company===d[0]?' on':'')+'" data-act="filter" data-group="company" data-val="'+d[0]+'">'+
        esc(d[1])+'<span class="cnt">'+safeNum(d[2])+'</span></button>';
    }).join('')+'</div>';
  },
  companiesBody:function(){
    var cs=CRM.getCompanies(), f=UIState.filters.company, q=UIState.companyQuery.trim().toLowerCase();
    if(q) cs=cs.filter(function(c){
      return (String(c.name)+' '+String(c.altName||'')+' '+String(c.crmId)+' '+String(c.buyerType)+' '+((c.categories||[]).join(' '))).toLowerCase().indexOf(q)>-1;
    });
    if(f==='AU') cs=cs.filter(function(c){return c.country==='Australia';});
    else if(f==='NZ') cs=cs.filter(function(c){return c.country==='New Zealand';});
    else if(f==='active') cs=cs.filter(function(c){ return !Rules.isSuppressed(c) && !c.opportunityId && ['Initial Sent','D4','D10','D20','Monthly','Draft Ready','Approved for Outreach'].indexOf(c.pipelineStage)>-1; });
    else if(f==='opportunity') cs=cs.filter(function(c){return !!c.opportunityId;});
    else if(f==='nurture') cs=cs.filter(function(c){return c.status==='Nurture';});
    else if(f==='hold') cs=cs.filter(function(c){return c.status==='Strategic Hold';});
    else if(f==='dnc') cs=cs.filter(function(c){return c.status==='Do Not Contact';});
    else if(f==='research') cs=cs.filter(function(c){return c.status==='Research';});
    else if(f==='high') cs=cs.filter(function(c){return c.priority==='High';});

    if(!cs.length) return emptyState('No companies match','Try a different filter or clear the search.','search');
    function rank(c){ return c.opportunityId?0:(c.priority==='High'?1:(Rules.isSuppressed(c)?3:2)); }
    cs=cs.slice().sort(function(a,b){ return rank(a)-rank(b) || String(a.name).localeCompare(String(b.name)); });
    return '<div class="note" style="padding-top:2px">'+icon('building')+'<span>'+cs.length+' companies · sorted by commercial importance</span></div>'+
      cs.map(companyRow).join('');
  },

  company:function(id){
    var c=CRM.getCompanyById(id);
    if(!c) return emptyState('Company not found','This record is not in the current snapshot.','search');
    var contacts=CRM.getContactsByCompany(c.id);
    var acts=CRM.getActivitiesByCompany(c.id);
    var drafts=CRM.getDraftsByCompany(c.id);
    var opp=c.opportunityId? CRM.getOpportunityById(c.opportunityId):null;
    var stt=META.status[c.status]||{v:'neutral',icon:'info'};
    var suppressed=Rules.isSuppressed(c);
    var h='';

    h+='<div class="hero">'+
      '<div class="hero-id">'+esc(c.crmId)+' · '+esc(c.country)+'</div>'+
      '<h2>'+esc(c.name)+(c.altName? ' <span style="font-size:14px;color:#8D8471;font-family:var(--ff)">( '+esc(c.altName)+' )</span>':'')+'</h2>'+
      '<div class="hero-sub">'+esc(c.buyerType)+'</div>'+
      '<div class="hero-badges">'+chip(c.status,'gold',{xs:true,icon:stt.icon})+
        chip('Priority · '+(c.priority||'—'), c.priority==='High'?'danger':'ghost',{xs:true,icon:'flag'})+
        chip('Fit · '+(c.commercialFit||'—'),'ghost',{xs:true})+
        (suppressed? chip('Outreach suppressed','danger',{xs:true,icon:'lock'}):'')+'</div>'+
      '<div class="hero-facts">'+
        '<div class="hero-fact"><div class="hf-l">Outreach stage</div><div class="hf-v">'+esc(c.stage||'—')+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Pipeline</div><div class="hf-v">'+esc(c.pipelineStage||'—')+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Contacts</div><div class="hf-v">'+contacts.filter(function(x){return x.confidence==='VERIFIED';}).length+' verified / '+contacts.length+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Next review</div><div class="hf-v">'+((c.nextAction&&c.nextAction.date)? esc(DateUtil.short(c.nextAction.date)):'—')+'</div></div>'+
      '</div></div>';

    h+='<div class="anchors" id="companyAnchors"><ul>'+
      [['overview','Overview'],['intel','Intelligence'],['product','Opportunity Angle'],['contacts','Contacts'],['outreach','Outreach'],['opp','Deal'],['activity','Activity'],['drafts','Drafts']]
      .map(function(a,i){ return '<li><button data-act="anchor" data-target="sec-'+a[0]+'" class="'+(i===0?'on':'')+'">'+esc(a[1])+'</button></li>'; }).join('')+'</ul></div>';

    /* OVERVIEW */
    var po=c.productOpportunity||{};
    h+='<section id="sec-overview"><div class="sechead"><h2 class="seclabel">Overview</h2></div><div class="card pad">'+
      '<p style="font-size:13px;line-height:1.68;color:var(--ink-3)">'+esc(c.about)+'</p>'+
      '<div class="micro" style="margin-top:14px">Product categories</div><div class="tagrow">'+
        (c.categories||[]).map(function(t){ return '<span class="tag">'+esc(t)+'</span>'; }).join('')+'</div>'+
      ((c.tags&&c.tags.length)? '<div class="micro" style="margin-top:14px">CRM tags</div><div class="tagrow">'+
        c.tags.map(function(t){ return '<span class="tag" style="background:var(--gold-soft);border-color:var(--gold-line);color:#8A6A32">'+esc(t)+'</span>'; }).join('')+'</div>':'')+
      '<div class="micro" style="margin-top:14px">Commercial fit</div>'+
      '<p style="font-size:12.5px;color:var(--ink-3);margin-top:6px;line-height:1.6">'+esc(c.commercialFit||'—')+
        (c.commercialFit==='High'?' — core SHALVADZE category overlap; worth founder time.':
         c.commercialFit==='Medium'?' — partial overlap; qualify before investing drafting time.':
         c.commercialFit==='Medium-High'?' — good overlap; needs one discovery reply to qualify.':
         c.commercialFit==='None'?' — no commercial fit.':' — limited overlap today.')+'</p>'+
      (c.notes? '<div class="banner info" style="margin-top:13px">'+icon('file')+'<p>'+esc(c.notes)+'</p></div>':'')+
    '</div></section>';

    /* BUYING INTELLIGENCE */
    var intel=c.intelligence||[];
    var counts={VERIFIED_FACT:0,OBSERVATION:0,HYPOTHESIS:0,UNKNOWN:0};
    intel.forEach(function(i){ if(counts[i.type]!=null) counts[i.type]++; });
    h+='<section id="sec-intel"><div class="sechead"><h2 class="seclabel">Buying Intelligence</h2><span class="seccount">'+intel.length+' items</span></div>';
    h+='<div class="card pad" style="margin-bottom:10px"><div style="display:flex;flex-wrap:wrap;gap:6px">'+
      chip(counts.VERIFIED_FACT+' Verified','blue',{xs:true,icon:'shield'})+
      chip(counts.OBSERVATION+' Observations','neutral',{xs:true,icon:'eye'})+
      chip(counts.HYPOTHESIS+' Hypotheses','amber',{xs:true,icon:'sparkles'})+
      chip(counts.UNKNOWN+' Unknown','ghost',{xs:true,icon:'question'})+'</div>'+
      '<p class="hint" style="margin-top:9px">Evidence is graded. Hypotheses are SHALVADZE analysis and are never presented to a buyer as fact.</p></div>';
    h+= intel.length? intel.map(intelRow).join('') : emptyState('No intelligence recorded','Research has not started for this account.','search');
    h+='</section>';

    /* PRODUCT OPPORTUNITY */
    h+='<section id="sec-product"><div class="sechead"><h2 class="seclabel">Product Opportunity</h2></div>';
    if(c.productOpportunity){
      h+='<div class="callout callout-gold"><div class="co-l">'+icon('target')+'Strongest SHALVADZE opening angle</div><p>'+esc(po.angle)+'</p></div>';
      if(po.products&&po.products.length) h+='<div class="callout"><div class="co-l">'+icon('box')+'Relevant products</div><div class="tagrow" style="margin-top:2px">'+po.products.map(function(p){ return '<span class="tag">'+esc(p)+'</span>'; }).join('')+'</div></div>';
      h+='<div class="callout callout-blue"><div class="co-l">'+icon('factory')+'Sourcing opportunity</div><p>'+esc(po.sourcing)+'</p></div>';
      h+='<div class="callout callout-amber"><div class="co-l">'+icon('alert')+'Commercial concern</div><p>'+esc(po.concern)+'</p></div>';
    } else h+=emptyState('No product opportunity recorded','','box');
    h+='</section>';

    /* CONTACTS */
    h+='<section id="sec-contacts"><div class="sechead"><h2 class="seclabel">Contacts</h2><a class="seclink" href="#/contacts">All contacts'+icon('chevR')+'</a></div>';
    h+='<div class="card pad">'+(contacts.length? contacts.map(function(x){ return contactBlock(x); }).join('') :
      '<div class="contact"><div class="avatar unverified">?</div><div class="contact-main"><h4>No named buyer confirmed</h4>'+
      '<div class="ct">Only a role inbox or no channel at all. Shown as unconfirmed — never treated as verified.</div></div></div>')+'</div></section>';

    /* OUTREACH */
    h+='<section id="sec-outreach"><div class="sechead"><h2 class="seclabel">Outreach</h2>'+
      (c.outreach&&c.outreach.sequence==='OPPORTUNITY'? '<span class="seccount">Opportunity-led</span>':'<span class="seccount">Cold cadence</span>')+'</div>';
    h+='<div class="card pad">';
    if(c.outreach){
      if(c.outreach.note) h+='<div class="banner '+(suppressed?'':'info')+'" style="margin-bottom:12px">'+icon(suppressed?'lock':'info')+'<p>'+esc(c.outreach.note)+'</p></div>';
      h+=cadenceTrack(c.outreach);
      h+='<div style="margin-top:14px">'+(c.outreach.steps||[]).map(function(s){
        return '<div class="kv"><span class="k">'+esc(s.label)+'</span><span class="v">'+
          (s.date? esc(DateUtil.shortYear(s.date))+' · ':'')+esc(s.evidence||s.state)+'</span></div>';
      }).join('')+'</div>';
      var next=c.nextAction||{};
      h+='<div class="callout callout-ink" style="margin-top:13px"><div class="co-l">'+icon('bolt')+'Current next action</div><p>'+esc(next.label||'None — suppressed')+
        (next.date? ' · '+esc(DateUtil.label(next.date)):'')+'</p></div>';
    } else {
      h+='<p class="hint">No outreach record for this account.</p>';
    }
    h+='</div></section>';

    /* OPPORTUNITY */
    if(opp){
      h+='<section id="sec-opp"><div class="sechead"><h2 class="seclabel">Opportunity</h2><a class="seclink" href="#/opportunity/'+esc(opp.id)+'">Open'+icon('chevR')+'</a></div>'+
        '<div class="opp-card"><div class="opp-head"><div class="oh-l">Active opportunity</div><h3>'+esc(opp.company)+'</h3>'+
        '<span class="oh-status">'+chip(opp.status,'gold',{xs:true,icon:'diamond'})+'</span></div>'+
        '<div class="opp-body">'+
          '<div class="opp-row"><div class="or-l">Buyer</div><div class="or-v">'+esc(opp.buyerName)+' · '+esc(opp.buyerTitle)+'</div></div>'+
          '<div class="opp-row"><div class="or-l">Products discussed</div><ul class="bullets">'+(opp.products||[]).map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('')+'</ul></div>'+
          '<div class="opp-row"><div class="or-l">Timing</div><div class="or-v">'+esc(opp.timing)+'</div></div>'+
          '<div class="opp-row"><div class="or-l">Next action</div><div class="or-v">'+esc(opp.nextAction.label)+' · <b>'+esc(DateUtil.label(opp.nextAction.date))+'</b></div></div>'+
          '<div class="opp-row"><div class="or-l">Commercial value</div><div class="value-unknown">Not recorded — no financial value invented in this CRM.</div></div>'+
        '</div></div></section>';
    }

    /* ACTIVITY */
    h+='<section id="sec-activity"><div class="sechead"><h2 class="seclabel">Activity Timeline</h2><span class="seccount">'+acts.length+'</span></div>'+
      '<div class="card pad">'+(acts.length? '<div class="tl">'+acts.map(activityItem).join('')+'</div>' :
      emptyState('No activity recorded','Nothing has been logged against this account yet.','history'))+'</div></section>';

    /* DRAFTS */
    h+='<section id="sec-drafts"><div class="sechead"><h2 class="seclabel">Email Drafts</h2><a class="seclink" href="#/drafts">All drafts'+icon('chevR')+'</a></div>'+
      (drafts.length? drafts.slice().sort(function(a,b){ return (a.status==='CURRENT_READY'?-1:1)-(b.status==='CURRENT_READY'?-1:1); }).map(function(d){ return draftCard(d); }).join('')
        : emptyState('No drafts for this account','Draft copy has not been prepared.','mail'))+'</section>';

    h+='<div style="height:8px"></div><button class="btn btn-block" data-nav="#/companies">'+icon('back')+'Back to companies</button>';
    h+='<div class="footmark">'+esc(c.crmId)+' · record is read-only</div>';
    return h;
  },

  activity:function(){
    return '<div id="activityFilters">'+Pages.activityFilters()+'</div><div id="activityWrap">'+Pages.activityBody()+'</div>';
  },
  activityFilters:function(){
    var all=CRM.getActivities();
    var defs=[['all','All',all.length],
      ['emails','Emails',all.filter(function(e){return e.type==='OUTREACH_SENT'||e.type==='FOLLOWUP_SENT';}).length],
      ['replies','Replies',all.filter(function(e){return e.type==='BUYER_REPLY';}).length],
      ['crm','CRM',all.filter(function(e){return e.type==='DRAFT_PREPARED'||e.type==='CONTACT_UPDATED';}).length],
      ['opportunities','Opportunities',all.filter(function(e){return e.type==='OPPORTUNITY_CREATED';}).length],
      ['research','Research',all.filter(function(e){return e.type==='RESEARCH_UPDATED';}).length],
      ['status','Status Changes',all.filter(function(e){return e.type==='STATUS_CHANGE'||e.type==='NURTURE'||e.type==='STRATEGIC_HOLD';}).length]];
    return '<div class="chipbar">'+defs.map(function(d){
      return '<button class="fchip'+(UIState.filters.activity===d[0]?' on':'')+'" data-act="filter" data-group="activity" data-val="'+d[0]+'">'+
        esc(d[1])+'<span class="cnt">'+safeNum(d[2])+'</span></button>';
    }).join('')+'</div>';
  },
  activityBody:function(){
    var evs=CRM.getActivities(), f=UIState.filters.activity;
    if(f==='emails') evs=evs.filter(function(e){ return e.type==='OUTREACH_SENT'||e.type==='FOLLOWUP_SENT'; });
    else if(f==='replies') evs=evs.filter(function(e){ return e.type==='BUYER_REPLY'; });
    else if(f==='crm') evs=evs.filter(function(e){ return e.type==='DRAFT_PREPARED'||e.type==='CONTACT_UPDATED'; });
    else if(f==='opportunities') evs=evs.filter(function(e){ return e.type==='OPPORTUNITY_CREATED'; });
    else if(f==='research') evs=evs.filter(function(e){ return e.type==='RESEARCH_UPDATED'; });
    else if(f==='status') evs=evs.filter(function(e){ return e.type==='STATUS_CHANGE'||e.type==='NURTURE'||e.type==='STRATEGIC_HOLD'; });
    if(!evs.length) return emptyState('No activity in this view','Nothing logged matches this filter.','pulse');

    var byDay={};
    evs.forEach(function(e){ var k=DateUtil.dayKey(e.at); (byDay[k]=byDay[k]||[]).push(e); });
    var keys=Object.keys(byDay).map(Number).sort(function(a,b){ return b-a; });
    var h='';
    keys.forEach(function(k){
      var d=new Date(k); var isoK=DateUtil.iso(d); var diff=DateUtil.dayDiff(isoK);
      var lab = diff===0? 'Today' : diff===-1? 'Yesterday' : DateUtil.withDow(isoK);
      h+='<div class="group"><div class="grouphead g-week"><span class="gl">'+esc(lab)+'</span><span class="gc">'+byDay[k].length+'</span><span class="gr"></span></div>'+
        '<div class="card pad"><div class="tl">'+byDay[k].map(activityItem).join('')+'</div></div></div>';
    });
    h+='<div class="note">'+icon('database')+'<span>CRM is the operational source of truth; Gmail is the communication evidence. Only verified sends appear as completed.</span></div>';
    return h;
  },

  contacts:function(){
    return '<div class="searchwrap">'+icon('search')+
      '<input class="search" id="contactSearch" type="search" placeholder="Search name, company or title…" value="'+esc(UIState.contactQuery)+'" autocomplete="off" aria-label="Search contacts" />'+
      (UIState.contactQuery? '<button class="searchclear" data-act="clear-contact-search" aria-label="Clear">'+icon('close')+'</button>':'')+'</div>'+
      '<div id="contactFilters">'+Pages.contactFilters()+'</div><div id="contactsWrap">'+Pages.contactsBody()+'</div>';
  },
  contactFilters:function(){
    var cs=CRM.getContacts();
    var defs=[['all','All',cs.length],
      ['VERIFIED','Verified',cs.filter(function(c){return c.confidence==='VERIFIED';}).length],
      ['LIKELY','Likely',cs.filter(function(c){return c.confidence==='LIKELY';}).length],
      ['UNCONFIRMED','Unconfirmed',cs.filter(function(c){return c.confidence==='UNCONFIRMED';}).length],
      ['AU','Australia',cs.filter(function(c){return c.country==='Australia';}).length],
      ['NZ','New Zealand',cs.filter(function(c){return c.country==='New Zealand';}).length]];
    return '<div class="chipbar">'+defs.map(function(d){
      return '<button class="fchip'+(UIState.filters.contactCountry===d[0]?' on':'')+'" data-act="filter" data-group="contactCountry" data-val="'+d[0]+'">'+
        esc(d[1])+'<span class="cnt">'+safeNum(d[2])+'</span></button>';
    }).join('')+'</div>';
  },
  contactsBody:function(){
    var cs=CRM.getContacts(), f=UIState.filters.contactCountry, q=UIState.contactQuery.trim().toLowerCase();
    if(q) cs=cs.filter(function(c){
      var co=CRM.getCompanyById(c.companyId)||{};
      return (String(c.name||'')+' '+String(c.title||'')+' '+String(co.name||'')+' '+String(c.email||'')).toLowerCase().indexOf(q)>-1;
    });
    if(['VERIFIED','LIKELY','UNCONFIRMED'].indexOf(f)>-1) cs=cs.filter(function(c){ return c.confidence===f; });
    else if(f==='AU') cs=cs.filter(function(c){ return c.country==='Australia'; });
    else if(f==='NZ') cs=cs.filter(function(c){ return c.country==='New Zealand'; });
    if(!cs.length) return emptyState('No contacts match','Adjust the filter or clear the search.','users');
    function rank(c){ return c.confidence==='VERIFIED'?0:(c.confidence==='LIKELY'?1:2); }
    cs=cs.slice().sort(function(a,b){ return rank(a)-rank(b) || String(a.name||'zz').localeCompare(String(b.name||'zz')); });
    var verified=cs.filter(function(c){ return c.confidence==='VERIFIED'; }).length;
    return '<div class="banner info">'+icon('shield')+'<p><b>'+verified+' of '+cs.length+'</b> shown here are verified. Guessed or role-inbox contacts are clearly marked unconfirmed and are never presented as verified.</p></div>'+
      cs.map(function(c){
        var co=CRM.getCompanyById(c.companyId)||{};
        return '<div class="card pad" style="margin-bottom:9px" '+(co.id?'data-nav="#/company/'+esc(co.id)+'" role="button" tabindex="0"':'')+'>'+
          contactBlock(c)+
          '<div style="margin-top:10px;padding-top:9px;border-top:1px dashed var(--line);display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--muted)">'+
            icon('building')+esc(co.name||'No linked company')+'<span style="margin-left:auto;color:var(--muted-2)">'+countryTag(co.country||c.country)+'</span></div>'+
        '</div>';
      }).join('');
  },

  drafts:function(){
    var ds=CRM.getDrafts();
    var groups=[
      ['Current', ds.filter(function(d){ return d.status==='CURRENT_READY'||d.status==='APPROVED_AWAITING_SEND'; })],
      ['Future Sequence', ds.filter(function(d){ return d.status==='PREPARED_FUTURE'; })],
      ['Sent · Verified', ds.filter(function(d){ return d.status==='SENT_VERIFIED'; })],
      ['Superseded', ds.filter(function(d){ return d.status==='SUPERSEDED'; })],
      ['Cancelled', ds.filter(function(d){ return d.status==='CANCELLED'; })]
    ];
    var h='<div class="banner ink">'+icon('lock')+'<p>Read-only. Drafts are reviewed here; the Outreach Agent sends manually in Gmail and logs the result back to the Sheet.</p></div>';
    groups.forEach(function(g){
      if(!g[1].length) return;
      h+='<div class="group"><div class="grouphead '+(g[0]==='Current'?'g-today':((g[0]==='Cancelled'||g[0]==='Superseded')?'g-over':'g-week'))+'">'+
        '<span class="gl">'+g[0]+'</span><span class="gc">'+g[1].length+'</span><span class="gr"></span></div>'+
        g[1].map(function(d){ return draftCard(d); }).join('')+'</div>';
    });
    h+='<div class="note">'+icon('info')+'<span>Future stage copy is prepared early but is never shown as a due action in the Action Center until that stage becomes current.</span></div>';
    return h;
  },

  draft:function(id){
    var d=CRM.getDraftById(id);
    if(!d) return emptyState('Draft not found','This draft is not in the current snapshot.','mail');
    var c=CRM.getCompanyById(d.companyId)||{};
    var m=META.draft[d.status]||{label:d.status||'Draft', v:'neutral', icon:'file'};
    var h='<div class="mail-hero">'+
      '<div class="micro" style="color:#8D8471">'+esc(c.name||'')+' · '+esc(d.stage)+'</div>'+
      '<h2 style="font-family:var(--fs);font-size:22px;font-weight:400;color:#FCF9F2;margin-top:8px;line-height:1.25">'+esc(d.subject)+'</h2>'+
      '<div style="margin-top:12px">'+chip(m.label,'gold',{xs:true,icon:m.icon})+'</div>'+
      '<div class="mail-meta">'+
        '<div class="mm"><span class="k">To</span><span class="v">'+esc(d.recipient)+(d.recipientNote? '<span style="display:block;color:#8D8471;font-size:10.5px;margin-top:2px">'+esc(d.recipientNote)+'</span>':'')+'</span></div>'+
        '<div class="mm"><span class="k">Prepared</span><span class="v">'+esc(d.preparedBy)+' · '+esc(DateUtil.short(d.preparedAt))+'</span></div>'+
        (d.sentAt? '<div class="mm"><span class="k">Sent</span><span class="v">'+esc(DateUtil.shortYear(d.sentAt))+' · verified in Gmail</span></div>':'')+
        '<div class="mm"><span class="k">Thread</span><span class="v">'+esc(d.threadRef||'—')+'</span></div>'+
      '</div></div>';
    h+='<div class="mail-body"><div class="greet">'+esc(d.greeting)+'</div><div class="body">'+esc(d.body)+'</div></div>';
    h+='<div class="card pad" style="margin-top:10px">'+
      '<div class="kv"><span class="k">Company</span><span class="v"><a href="#/company/'+esc(c.id||'')+'" style="color:var(--gold);font-weight:600">'+esc(c.name||'—')+'</a></span></div>'+
      '<div class="kv"><span class="k">Stage</span><span class="v">'+esc(d.stage)+'</span></div>'+
      '<div class="kv"><span class="k">Status</span><span class="v">'+esc(m.label)+'</span></div>'+
      '<div class="kv"><span class="k">Intended recipient</span><span class="v" style="font-size:11.5px">'+esc(d.recipient)+'</span></div>'+
    '</div>';
    h+='<div class="banner" style="margin-top:10px">'+icon('lock')+'<p>Approve &amp; send is intentionally disabled in this prototype — sending stays in Gmail with the Outreach Agent.</p></div>';
    h+='<button class="btn btn-block" disabled>'+icon('lock')+'Approve &amp; send — future functionality</button>';
    if(c.id) h+='<button class="btn btn-block" style="margin-top:9px" data-nav="#/company/'+esc(c.id)+'">'+icon('building')+'Open '+esc(c.name||'company')+'</button>';
    h+='<div class="footmark">'+esc(d.id)+' · read-only</div>';
    return h;
  },

  opportunities:function(){
    var os=CRM.getOpportunities();
    var h='<div class="banner info">'+icon('diamond')+'<p>Opportunities sit outside the cold cadence. These accounts are removed from automated follow-up until the conversation closes.</p></div>';
    if(!os.length) return h+emptyState('No active opportunities','Nothing is in live buyer conversation yet.','diamond');
    h+=os.map(function(o){
      var c=CRM.getCompanyById(o.companyId)||{};
      return '<div class="opp-card"><div class="opp-head" data-nav="#/opportunity/'+esc(o.id)+'" role="button" tabindex="0">'+
        '<div class="oh-l">'+esc(o.country)+' · '+esc(c.crmId||'')+'</div><h3>'+esc(o.company)+'</h3>'+
        '<span class="oh-status">'+chip(o.status,'gold',{xs:true,icon:'diamond'})+'</span></div>'+
        '<div class="opp-body" data-nav="#/opportunity/'+esc(o.id)+'" role="button" tabindex="0">'+
          '<div class="opp-row"><div class="or-l">Buyer</div><div class="or-v">'+esc(o.buyerName)+' · '+esc(o.buyerTitle)+'</div></div>'+
          '<div class="opp-row"><div class="or-l">Products discussed</div><div class="or-v">'+(o.products||[]).map(esc).join(' · ')+'</div></div>'+
          '<div class="opp-row"><div class="or-l">Timing</div><div class="or-v">'+esc(o.timing)+'</div></div>'+
          '<div class="opp-row"><div class="or-l">Next action</div><div class="or-v">'+esc(o.nextAction.label)+'<br><b style="color:var(--gold)">'+esc(DateUtil.label(o.nextAction.date))+'</b></div></div>'+
          '<div class="opp-row"><div class="or-l">Supplier work</div><div class="or-v">'+chip((o.supplierWork||{}).status||'—','blue',{xs:true})+' <span style="font-size:12px">'+esc((o.supplierWork||{}).detail||'')+'</span></div></div>'+
        '</div></div>';
    }).join('');
    h+='<div class="note">'+icon('scale')+'<span>No financial values are recorded or estimated for these opportunities — none exist in the source Sheet yet.</span></div>';
    return h;
  },

  opportunity:function(id){
    var o=CRM.getOpportunityById(id);
    if(!o) return emptyState('Opportunity not found','This record is not in the current snapshot.','diamond');
    var c=CRM.getCompanyById(o.companyId)||{};
    var acts=CRM.getActions().filter(function(a){ return a.companyId===o.companyId && a.status==='OPEN'; });
    var evs=CRM.getActivitiesByCompany(o.companyId).slice(0,8);
    var lc=o.latestCommunication||{};
    var h='<div class="hero"><div class="hero-id">'+esc(c.crmId||'')+' · '+esc(o.country)+'</div>'+
      '<h2>'+esc(o.company)+'</h2><div class="hero-sub">'+esc(o.stage)+'</div>'+
      '<div class="hero-badges">'+chip(o.status,'gold',{xs:true,icon:'diamond'})+chip('Timing · '+o.timing,'ghost',{xs:true,icon:'calendar'})+'</div>'+
      '<div class="hero-facts">'+
        '<div class="hero-fact"><div class="hf-l">Buyer</div><div class="hf-v">'+esc(o.buyerName)+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Role</div><div class="hf-v">'+esc(o.buyerTitle)+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Next review</div><div class="hf-v">'+esc(DateUtil.short((o.nextAction||{}).date))+'</div></div>'+
        '<div class="hero-fact"><div class="hf-l">Value</div><div class="hf-v">Not recorded</div></div>'+
      '</div></div>';

    h+='<div class="sechead"><h2 class="seclabel">Requirement</h2></div><div class="card pad"><p style="font-size:13px;line-height:1.7;color:var(--ink-3)">'+esc(o.requirement)+'</p></div>';
    h+='<div class="sechead"><h2 class="seclabel">Products Discussed</h2></div><div class="card pad"><div class="tagrow" style="margin-top:0">'+(o.products||[]).map(function(p){ return '<span class="tag">'+esc(p)+'</span>'; }).join('')+'</div></div>';
    h+='<div class="sechead"><h2 class="seclabel">Latest Buyer Communication</h2></div>'+
      '<div class="callout callout-gold"><div class="co-l">'+icon('mailOpen')+esc(lc.at? DateUtil.timeAgo(lc.at):'—')+(lc.channel?' · '+esc(lc.channel):'')+'</div>'+
      '<p>'+esc(lc.summary||'No communication recorded.')+'</p></div>';
    h+='<div class="sechead"><h2 class="seclabel">Supplier Work Status</h2></div>'+
      '<div class="callout callout-blue"><div class="co-l">'+icon('factory')+esc((o.supplierWork||{}).status||'—')+'</div><p>'+esc((o.supplierWork||{}).detail||'')+'</p></div>';
    h+='<div class="sechead"><h2 class="seclabel">Next Action</h2></div>'+
      '<div class="callout callout-ink"><div class="co-l">'+icon('bolt')+'Due '+esc(DateUtil.label((o.nextAction||{}).date))+'</div><p>'+esc((o.nextAction||{}).label||'—')+'</p></div>';
    h+='<div class="sechead"><h2 class="seclabel">Internal Notes</h2></div><div class="card pad"><ul class="bullets">'+
      (o.notes||[]).map(function(n){ return '<li>'+esc(n)+'</li>'; }).join('')+'</ul></div>';
    if(acts.length) h+='<div class="sechead"><h2 class="seclabel">Scheduled Actions</h2></div>'+acts.map(function(a){ return actionCard(a,{note:true}); }).join('');
    h+='<div class="sechead"><h2 class="seclabel">Company Activity</h2><a class="seclink" href="#/company/'+esc(c.id||'')+'">Company file'+icon('chevR')+'</a></div>'+
      '<div class="card pad"><div class="tl">'+(evs.length? evs.map(activityItem).join('') : '<p class="hint">No activity recorded.</p>')+'</div></div>';
    h+='<div class="banner" style="margin-top:14px">'+icon('scale')+'<p>No financial value is invented. Revenue fields stay empty until the buyer confirms volumes.</p></div>';
    h+='<div class="footmark">'+esc(o.id)+' · read-only</div>';
    return h;
  },

  pipeline:function(){
    var p=CRM.getPipelineSummary();
    var vals=Object.keys(p.counts).map(function(k){ return p.counts[k]; });
    var max=Math.max.apply(null, [1].concat(vals));
    var funnelDefs=[
      ['Pre-outreach',['Research','Approved for Outreach','Draft Ready']],
      ['In outreach',['Initial Sent','D4','D10','D20','Monthly']],
      ['Conversation',['Buyer Conversation','Active Opportunity']],
      ['Outcome',['Nurture','Strategic Hold','Do Not Contact','Closed']]
    ];
    var funnel=funnelDefs.map(function(f){
      return {label:f[0], n:f[1].reduce(function(s,k){ return s+(p.counts[k]||0); },0)};
    });
    var h='<div class="funnel">'+funnel.map(function(f){ return '<div class="fcell"><div class="fn">'+safeNum(f.n)+'</div><div class="fl">'+esc(f.label)+'</div></div>'; }).join('')+'</div>';
    h+='<div class="note">'+icon('info')+'<span>'+safeNum(p.total)+' companies · counts derived live from company records, not stored separately.</span></div>';

    META.pipelineGroups.forEach(function(g){
      var keys=g.keys.filter(function(k){ return p.order.indexOf(k)>-1; });
      var total=keys.reduce(function(s,k){ return s+(p.counts[k]||0); },0);
      h+='<div class="sechead"><h2 class="seclabel">'+esc(g.title)+'</h2><span class="seccount">'+total+' accounts</span></div>';
      h+='<div class="card pad">'+keys.map(function(k){
        var n=p.counts[k]||0;
        return '<div class="prow"><span class="pl">'+esc(k)+'</span><span class="pbar"><span class="pfill" style="width:'+(n/max*100)+'%;background:'+g.color+'"></span></span><span class="pn">'+n+'</span></div>';
      }).join('')+'</div>';
    });

    var cs=CRM.getCompanies();
    var au=cs.filter(function(c){return c.country==='Australia';}).length;
    var nz=cs.filter(function(c){return c.country==='New Zealand';}).length;
    var tot=Math.max(1,cs.length);
    h+='<div class="sechead"><h2 class="seclabel">Market Split</h2></div><div class="card pad">'+
      '<div class="prow"><span class="pl">Australia</span><span class="pbar"><span class="pfill" style="width:'+(au/tot*100)+'%;background:var(--ink)"></span></span><span class="pn">'+au+'</span></div>'+
      '<div class="prow"><span class="pl">New Zealand</span><span class="pbar"><span class="pfill" style="width:'+(nz/tot*100)+'%;background:var(--gold-2)"></span></span><span class="pn">'+nz+'</span></div></div>';

    var cts=CRM.getContacts();
    var vc=cts.filter(function(c){return c.confidence==='VERIFIED';}).length;
    var lc=cts.filter(function(c){return c.confidence==='LIKELY';}).length;
    var uc=cts.filter(function(c){return c.confidence==='UNCONFIRMED';}).length;
    var ctot=Math.max(1,cts.length);
    h+='<div class="sechead"><h2 class="seclabel">Contact Verification</h2></div><div class="card pad">'+
      '<div class="prow"><span class="pl">Verified</span><span class="pbar"><span class="pfill" style="width:'+(vc/ctot*100)+'%;background:var(--green)"></span></span><span class="pn">'+vc+'</span></div>'+
      '<div class="prow"><span class="pl">Likely</span><span class="pbar"><span class="pfill" style="width:'+(lc/ctot*100)+'%;background:var(--amber)"></span></span><span class="pn">'+lc+'</span></div>'+
      '<div class="prow"><span class="pl">Unconfirmed</span><span class="pbar"><span class="pfill" style="width:'+(uc/ctot*100)+'%;background:var(--muted-2)"></span></span><span class="pn">'+uc+'</span></div></div>';

    h+='<div class="note">'+icon('scale')+'<span>Deliberately light on analytics. Depth lives in the Google Sheet; this view is for decisions.</span></div>';
    return h;
  },

  marketing:function(){
    var items=CRM.getMarketingCalendar();
    if(UIState.marketingView==='month') return Pages.marketingMonth(items);
    var upcoming=items.filter(function(i){ var n=DateUtil.dayDiff(i.date); return !isNaN(n)&&n>=0; });
    var past=items.filter(function(i){ var n=DateUtil.dayDiff(i.date); return !isNaN(n)&&n<0; }).reverse();
    var h='<div class="banner">'+icon('megaphone')+'<p>Marketing only — campaigns, website, content, social and events. Sales outreach lives in the <a href="#/actions" style="font-weight:700;text-decoration:underline">Action Center</a> and is never mixed in here.</p></div>';
    h+='<div class="group"><div class="grouphead g-today"><span class="gl">Upcoming</span><span class="gc">'+upcoming.length+'</span><span class="gr"></span></div>'+
      '<div class="card pad">'+(upcoming.length? upcoming.map(mkItem).join('') : '<p class="hint">Nothing scheduled.</p>')+'</div></div>';
    if(past.length){
      h+='<div class="group"><div class="grouphead g-week"><span class="gl">Recently Completed</span><span class="gc">'+past.length+'</span><span class="gr"></span></div>'+
        '<div class="card pad" style="opacity:.85">'+past.map(mkItem).join('')+'</div></div>';
    }
    h+='<div class="note">'+icon('calendar')+'<span>Sample marketing data for prototype evaluation. Statuses: Idea · Planned · Draft · In Progress · Confirmed · Completed.</span></div>';
    return h;
  },
  marketingMonth:function(items){
    var base=DateUtil.today();
    var view=new Date(base.getFullYear(), base.getMonth()+UIState.calOffset, 1);
    var y=view.getFullYear(), m=view.getMonth();
    var first=new Date(y,m,1);
    var startDow=(first.getDay()+6)%7;
    var daysInMonth=new Date(y,m+1,0).getDate();
    var todayIso=DateUtil.iso(DateUtil.today());
    var sel=UIState.calSelected || todayIso;
    var byDay={};
    (items||[]).forEach(function(i){ var k=i.date; (byDay[k]=byDay[k]||[]).push(i); });
    var cells='';
    for(var b=0;b<startDow;b++) cells+='<div class="cal-day out"></div>';
    for(var d=1;d<=daysInMonth;d++){
      var key=DateUtil.iso(new Date(y,m,d));
      var list=byDay[key]||[];
      cells+='<button class="cal-day'+(list.length?' has':'')+(key===sel?' sel':'')+(key===todayIso?' today':'')+'" data-act="cal-day" data-val="'+key+'">'+
        '<span>'+d+'</span>'+(list.length? '<span class="dots">'+list.slice(0,3).map(function(x){ return '<i style="background:'+(META.channelColor[x.channel]||'#857D6E')+'"></i>'; }).join('')+'</span>':'')+'</button>';
    }
    var h='<div class="cal"><div class="cal-head">'+
      '<button class="cal-nav" data-act="cal-nav" data-val="-1" aria-label="Previous month">'+icon('back')+'</button>'+
      '<span class="cm">'+DateUtil.MONTHS[m]+' '+y+'</span>'+
      '<button class="cal-nav" data-act="cal-nav" data-val="1" aria-label="Next month">'+icon('chevR')+'</button></div>'+
      '<div class="cal-grid">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(x){ return '<div class="cal-dow">'+x+'</div>'; }).join('')+cells+'</div></div>';
    var selItems=byDay[sel]||[];
    h+='<div class="sechead"><h2 class="seclabel">'+esc(DateUtil.label(sel))+'</h2><span class="seccount">'+selItems.length+' item'+(selItems.length===1?'':'s')+'</span></div>';
    h+='<div class="card pad">'+(selItems.length? selItems.map(mkItem).join('') :
      '<p class="hint">No marketing activity scheduled for this day. Outreach actions are tracked separately in the Action Center.</p>')+'</div>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">'+Object.keys(META.channelColor).map(function(k){
      return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:var(--muted);font-weight:600"><i style="width:7px;height:7px;border-radius:99px;background:'+META.channelColor[k]+';display:block"></i>'+esc(k)+'</span>';
    }).join('')+'</div>';
    return h;
  },

  settings:function(){
    var st=CRM.state, meta=CRM.getMeta();
    var cache=Cache.meta(CRM_CONFIG.cacheKey);
    var h='<div class="banner ink">'+icon('lock')+'<p><b style="color:#EDE6D6">Read-only viewer.</b> The Google Sheet remains the single source of truth. This prototype cannot add, edit, delete, approve, send or change status.</p></div>';

    h+='<div class="sechead" style="margin-top:14px"><h2 class="seclabel">Data Source</h2></div>';
    h+='<div class="card pad">'+
      '<div class="kv"><span class="k">Active source</span><span class="v">'+esc(st.source)+'</span></div>'+
      '<div class="kv"><span class="k">Mode</span><span class="v">'+esc(st.mode)+'</span></div>'+
      '<div class="kv"><span class="k">Document path</span><span class="v" style="font-size:11.5px">'+esc(meta.sourceLabel||CRM_CONFIG.localPath)+'</span></div>'+
      '<div class="kv"><span class="k">API endpoint</span><span class="v" style="font-size:11.5px;color:var(--muted)">'+esc(st.endpoint||'CRM_API_ENDPOINT — not configured')+'</span></div>'+
      '<div class="kv"><span class="k">Schema version</span><span class="v">v'+esc(meta.schemaVersion||'1.0.0')+'</span></div>'+
      '<div class="kv"><span class="k">Last sync</span><span class="v">'+(st.loadedAt? esc(DateUtil.timeAgo(st.loadedAt)):'—')+'</span></div>'+
      '<div class="kv"><span class="k">Local cache</span><span class="v">'+(cache? 'saved '+esc(DateUtil.timeAgo(cache.savedAt)):'empty')+'</span></div>'+
      '<div class="kv"><span class="k">Storage</span><span class="v">'+(st.storage?'localStorage':'in-memory fallback')+'</span></div>'+
      '<div class="kv"><span class="k">Cache TTL</span><span class="v">'+Math.round(CRM_CONFIG.cacheTtlMs/60000)+' min</span></div>'+
      (st.error? '<div class="banner" style="margin-top:10px">'+icon('alert')+'<p>Last load error: '+esc(st.error)+'</p></div>':'')+
      (st.fromCache? '<div class="banner" style="margin-top:10px">'+icon('database')+'<p>Serving cached snapshot for offline resilience.</p></div>':'')+
    '</div>';
    h+='<div style="display:flex;gap:9px;margin-top:10px">'+
      '<button class="btn btn-dark" style="flex:1" data-act="refresh">'+icon('refresh')+'Refresh</button>'+
      '<button class="btn" style="flex:1" disabled>'+icon('lock')+'Switch to live API</button></div>';
    h+='<div class="note">'+icon('info')+'<span>The live switch is a one-line config change: CRM_CONFIG = { mode: "remote", endpoint: CRM_API_ENDPOINT }. No UI code changes.</span></div>';

    var arch=[
      ['Google Sheets CRM','Source of truth — company intelligence, contacts, outreach calendar, activity history, opportunities, drafts.',true],
      ['Google Apps Script Web App','Read-only endpoint returning JSON per sheet tab. No write access is granted.',true],
      ['SheetsAdapter','Maps sheet rows to the app schema (COMPANY_INTELLIGENCE to companies, OUTREACH_CALENDAR to actions).',true],
      ['CRM data service','window.CRM — getCompanies(), getCompanyById(), getActions(), getActiveActions(), getActivities(), getOpportunities(), getDrafts(), getMarketingCalendar(). Handles caching, loading and error state.',false],
      ['Rules engine','Cadence and suppression logic: one operational action per company, nurture / DNC / hold suppression, buyer reply supersedes the cold sequence.',false],
      ['UI layer','Router to Pages to Components. Pure functions of CRM data plus UIState. Never touches localStorage or fetch directly.',false]
    ];
    h+='<div class="sechead"><h2 class="seclabel">Architecture</h2></div><div class="card pad"><div class="archflow">'+
      arch.map(function(s,i){
        return '<div class="archstep'+(s[2]?' future':'')+'"><span class="archnum">'+(i+1)+'</span><div><div class="at">'+esc(s[0])+(s[2]?' · future':'')+'</div><div class="ad">'+esc(s[1])+'</div></div></div>';
      }).join('')+'</div></div>';

    var screenMap=[['Dashboard','Pages.dashboard()'],['Action Center','Pages.actions() + Rules.activeActions()'],['Companies','Pages.companies()'],
      ['Company Intelligence','Pages.company(id)'],['Activity Log','Pages.activity()'],['Contacts','Pages.contacts()'],
      ['Opportunities','Pages.opportunities() / opportunity(id)'],['Email Drafts','Pages.drafts() / draft(id)'],
      ['Marketing Calendar','Pages.marketing()'],['Pipeline Summary','Pages.pipeline()'],['Settings','Pages.settings()']];
    h+='<div class="sechead"><h2 class="seclabel">Screen Map</h2></div><div class="card pad">'+
      screenMap.map(function(r){ return '<div class="kv"><span class="k" style="flex:0 0 132px">'+esc(r[0])+'</span><span class="v" style="text-align:left;font-size:11.5px;color:var(--muted)">'+esc(r[1])+'</span></div>'; }).join('')+'</div>';

    var recs=[['companies',CRM.getCompanies().length],['contacts',CRM.getContacts().length],['actions',CRM.getActions().length],
      ['activities',CRM.getActivities().length],['opportunities',CRM.getOpportunities().length],['drafts',CRM.getDrafts().length],
      ['marketingCalendar',CRM.getMarketingCalendar().length]];
    h+='<div class="sechead"><h2 class="seclabel">Snapshot Records</h2></div><div class="card pad">'+
      recs.map(function(r){ return '<div class="kv"><span class="k">'+esc(r[0])+'</span><span class="v mono">'+safeNum(r[1])+'</span></div>'; }).join('')+'</div>';

    h+='<div class="sechead"><h2 class="seclabel">Prototype Tools</h2></div><div class="card pad">'+
      '<div class="switchrow"><div><div class="sr-t">Simulate API failure</div><div class="sr-d">Forces the next refresh to fail so the error and cached-snapshot states can be reviewed.</div></div>'+
      '<button class="toggle'+(CRM_CONFIG.simulateFailure?' on':'')+'" data-act="toggle-fail" role="switch" aria-checked="'+(CRM_CONFIG.simulateFailure?'true':'false')+'"></button></div>'+
      '<div class="switchrow"><div><div class="sr-t">Use remote endpoint</div><div class="sr-d">Disabled until CRM_API_ENDPOINT is deployed.</div></div>'+
      '<button class="toggle" disabled style="opacity:.4"></button></div>'+
      '<div style="display:flex;gap:9px;margin-top:12px"><button class="btn btn-sm" style="flex:1" data-act="clear-cache">'+icon('archive')+'Clear cache</button>'+
      '<button class="btn btn-sm" style="flex:1" data-act="refresh">'+icon('refresh')+'Reload data</button></div></div>';

    h+='<div class="sechead"><h2 class="seclabel">Business Rules Encoded</h2></div>'+
      '<div class="card pad" style="font-size:12.5px;color:var(--ink-3);line-height:1.75">'+
      '<div>· CRM is the operational source of truth; Gmail is communication evidence.</div>'+
      '<div>· Cadence: Initial to D4 to D10 to D20 to Monthly on the 15th.</div>'+
      '<div>· Only one operational next action per prospect.</div>'+
      '<div>· A buyer reply supersedes the cold sequence.</div>'+
      '<div>· Nurture, Do Not Contact, Strategic Hold, Stop and Closed suppress future outreach.</div>'+
      '<div>· Completed communication history always remains visible.</div>'+
      '<div>· Hypotheses are never displayed as verified facts.</div></div>';

    h+='<div class="footmark" style="margin-top:22px">SHALVADZE · Founder CRM · v'+esc(meta.schemaVersion||'1.0.0')+' · read-only</div>';
    return h;
  },

  afterRender:function(name){
    if(name==='companies'){
      var inp=document.getElementById('companySearch');
      if(inp){
        inp.addEventListener('input', debounce(function(e){
          UIState.companyQuery=e.target.value;
          var w=document.getElementById('companiesWrap');
          if(w) w.innerHTML=safePage(Pages.companiesBody);
        },160));
      }
    }
    if(name==='contacts'){
      var cinp=document.getElementById('contactSearch');
      if(cinp){
        cinp.addEventListener('input', debounce(function(e){
          UIState.contactQuery=e.target.value;
          var w=document.getElementById('contactsWrap');
          if(w) w.innerHTML=safePage(Pages.contactsBody);
        },160));
      }
    }
    if(name==='company') initAnchors();
    if(name==='pipeline'){
      requestAnimationFrame(function(){
        var fills=document.querySelectorAll('.pfill');
        for(var i=0;i<fills.length;i++){
          (function(el){ var w=el.style.width; el.style.width='0%';
            requestAnimationFrame(function(){ el.style.width=w; }); })(fills[i]);
        }
      });
    }
  }
};

function draftCard(d){
  var c=CRM.getCompanyById(d.companyId)||{};
  var m=META.draft[d.status]||{label:d.status||'Draft', v:'neutral', icon:'file'};
  var dim=(d.status==='SUPERSEDED'||d.status==='CANCELLED');
  return '<article class="dcard'+(dim?' dim':'')+'" data-nav="#/draft/'+esc(d.id)+'" role="button" tabindex="0">'+
    '<div class="dcard-top"><span class="dcard-co">'+esc(c.name||'Unknown')+'</span>'+chip(d.stage,'neutral',{xs:true})+'</div>'+
    '<div class="dcard-subject">'+esc(d.subject)+'</div>'+
    '<div class="dcard-preview">'+esc(d.greeting)+' '+esc(String(d.body||'').replace(/\s+/g,' '))+'</div>'+
    '<div class="dcard-foot">'+chip(m.label, m.v, {xs:true, icon:m.icon})+
      '<span style="font-size:10.5px;color:var(--muted-2);margin-left:auto">'+esc(d.recipient||'—')+' · '+esc(DateUtil.short(d.preparedAt))+'</span></div>'+
  '</article>';
}

function mkItem(i){
  var col=META.channelColor[i.channel]||'#857D6E';
  var stV = i.status==='Completed'?'green':i.status==='In Progress'?'gold':i.status==='Confirmed'?'blue':i.status==='Idea'?'ghost':'neutral';
  var d=DateUtil.parseDateOnly(i.date);
  var stV2 = i.priority==='High'?'danger':'ghost';
  return '<div class="mk-item"><div class="mk-date"><div class="md">'+(d? d.getDate():'—')+'</div><div class="mm">'+(d? DateUtil.MONTHS[d.getMonth()]:'')+'</div></div>'+
    '<div class="mk-main"><h4>'+esc(i.title)+'</h4><div class="mk-meta">'+esc(i.campaign)+' · '+esc(DateUtil.label(i.date))+'</div>'+
    (i.note? '<div class="mk-note">'+esc(i.note)+'</div>':'')+
    '<div class="mk-badges">'+chip(i.channel,'neutral',{xs:true})+chip(i.status, stV, {xs:true})+chip((i.priority||'—')+' priority', stV2,{xs:true})+'</div></div>'+
    '<span class="chan-dot" style="background:'+col+'"></span></div>';
}

var anchorObserver=null;
function initAnchors(){
  var bar=document.getElementById('companyAnchors');
  if(!bar || typeof IntersectionObserver==='undefined') return;
  var view=document.getElementById('view');
  var btns=Array.prototype.slice.call(bar.querySelectorAll('button'));
  var secs=btns.map(function(b){ return document.getElementById(b.getAttribute('data-target')); }).filter(Boolean);
  if(anchorObserver){ try{ anchorObserver.disconnect(); }catch(e){} }
  if(!secs.length) return;
  anchorObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var id=en.target.id;
        btns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-target')===id); });
        var active=bar.querySelector('button.on');
        if(active && active.scrollIntoView) active.scrollIntoView({block:'nearest', inline:'center'});
      }
    });
  }, {root:view, rootMargin:'-96px 0px -65% 0px', threshold:0});
  secs.forEach(function(s){ anchorObserver.observe(s); });
}

/* ============================================================================
   12. GLOBAL EVENTS + REFRESH + FATAL STATE
   ============================================================================ */
function refreshData(silent){
  var btn=document.getElementById('refreshBtn');
  if(btn) btn.classList.add('spin');
  return CRM.refresh().then(function(st){
    if(btn) btn.classList.remove('spin');
    renderRoute();
    if(!silent) toast(st.error ? 'Refreshed from cache — source unavailable' : 'CRM snapshot refreshed', st.error?'alert':'checkCircle');
    return st;
  }).catch(function(){
    if(btn) btn.classList.remove('spin');
    if(!silent) toast('Refresh failed','alert');
  });
}

function hideSplash(){
  var sp=document.getElementById('splash');
  if(!sp || sp.getAttribute('data-hidden')==='1') return;
  sp.setAttribute('data-hidden','1');
  sp.style.opacity='0';
  setTimeout(function(){ if(sp.parentNode) sp.parentNode.removeChild(sp); }, 480);
}

function renderFatal(msg){
  var pb=document.getElementById('pagebar');
  if(pb) pb.innerHTML='<div class="pgtext"><h1>Startup Error</h1><div class="pgsub">CRM snapshot unavailable</div></div>';
  var tb=document.getElementById('tabbar');
  if(tb) tb.innerHTML='';
  var view=document.getElementById('view');
  if(view) view.innerHTML='<div class="page"><div class="errorbox"><h4>The CRM could not start</h4><p>'+esc(msg||'Unknown error')+'</p>'+
    '<button class="btn btn-dark btn-block" style="margin-top:14px" data-act="retry-boot">'+icon('refresh')+'Retry</button></div>'+
    '<div class="note" style="margin-top:14px">'+icon('info')+'<span>The demo snapshot is embedded in this file, so a retry normally recovers. Cached data is optional — the app also runs with empty or blocked localStorage.</span></div></div>';
}

function wireGlobalEvents(){
  document.addEventListener('click', function(e){
    var copyBtn=e.target.closest ? e.target.closest('[data-copy]') : null;
    if(copyBtn){
      e.preventDefault(); e.stopPropagation();
      var txt=copyBtn.getAttribute('data-copy');
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ toast('Copied to clipboard','copy'); }, function(){ toast('Copy unavailable','alert'); });
      } else toast('Copy unavailable on this browser','alert');
      return;
    }
    var nav=e.target.closest ? e.target.closest('[data-nav]') : null;
    if(nav){ e.preventDefault(); Sheets.close(); navigate(nav.getAttribute('data-nav')); return; }
    var link=e.target.closest ? e.target.closest('[data-act="nav-link"]') : null;
    if(link){ Sheets.close(); return; }

    var act=e.target.closest ? e.target.closest('[data-act]') : null;
    if(!act) return;
    var a=act.getAttribute('data-act'), v=act.getAttribute('data-val'), g=act.getAttribute('data-group');
    switch(a){
      case 'open-more': openMoreSheet(); break;
      case 'open-source-sheet': openSourceSheet(); break;
      case 'open-cadence': openCadenceSheet(); break;
      case 'close-sheet': Sheets.close(); break;
      case 'refresh': refreshData(); break;
      case 'refresh-close': Sheets.close(); refreshData(); break;
      case 'retry-boot': startApp(); break;
      case 'filter':
        UIState.filters[g]=v;
        if(g==='action'){ var w1=document.getElementById('actionsWrap'), f1=document.getElementById('actionFilters');
          if(w1) w1.innerHTML=safePage(Pages.actionsBody); if(f1) f1.innerHTML=safePage(Pages.actionFilters); }
        else if(g==='company'){ var w2=document.getElementById('companiesWrap'), f2=document.getElementById('companyFilters');
          if(w2) w2.innerHTML=safePage(Pages.companiesBody); if(f2) f2.innerHTML=safePage(Pages.companyFilters); }
        else if(g==='activity'){ var w3=document.getElementById('activityWrap'), f3=document.getElementById('activityFilters');
          if(w3) w3.innerHTML=safePage(Pages.activityBody); if(f3) f3.innerHTML=safePage(Pages.activityFilters); }
        else if(g==='contactCountry'){ var w4=document.getElementById('contactsWrap'), f4=document.getElementById('contactFilters');
          if(w4) w4.innerHTML=safePage(Pages.contactsBody); if(f4) f4.innerHTML=safePage(Pages.contactFilters); }
        break;
      case 'filter-actions': UIState.filters.action=v; navigate('#/actions'); break;
      case 'filter-activity': UIState.filters.activity=v; navigate('#/activity'); break;
      case 'clear-company-search': UIState.companyQuery=''; renderRoute(); break;
      case 'clear-contact-search': UIState.contactQuery=''; renderRoute(); break;
      case 'mk-view': UIState.marketingView=v; renderRoute(); break;
      case 'cal-nav': UIState.calOffset+=parseInt(v,10)||0; UIState.calSelected=null; renderRoute(); break;
      case 'cal-day': UIState.calSelected=v; renderRoute(); break;
      case 'anchor':
        var t=document.getElementById(act.getAttribute('data-target'));
        var view=document.getElementById('view');
        if(t && view) view.scrollTop = t.getBoundingClientRect().top - view.getBoundingClientRect().top + view.scrollTop - 92;
        break;
      case 'toggle-fail':
        CRM_CONFIG.simulateFailure=!CRM_CONFIG.simulateFailure;
        act.classList.toggle('on', CRM_CONFIG.simulateFailure);
        act.setAttribute('aria-checked', CRM_CONFIG.simulateFailure?'true':'false');
        toast(CRM_CONFIG.simulateFailure? 'API failure simulation ON':'API failure simulation OFF', CRM_CONFIG.simulateFailure?'alert':'checkCircle');
        break;
      case 'clear-cache':
        Cache.clear(CRM_CONFIG.cacheKey);
        toast('Local cache cleared','archive');
        refreshData(true);
        break;
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key==='Enter'){
      var t=e.target.closest ? e.target.closest('[data-nav]') : null;
      if(t){ e.preventDefault(); navigate(t.getAttribute('data-nav')); }
    }
    if(e.key==='Escape') Sheets.close();
  });

  window.addEventListener('hashchange', function(){
    var v=document.getElementById('view');
    if(v) UIState.scroll[UIState.route.name]=v.scrollTop;
    renderRoute();
  });

  /* pull-to-refresh */
  var view=document.getElementById('view'), ptr=document.getElementById('ptr'), lbl=document.getElementById('ptrLabel');
  if(view && ptr){
    var startY=null, dist=0, active=false, busy=false;
    view.addEventListener('touchstart', function(e){
      if(busy) return;
      var sr=document.getElementById('sheetroot');
      if(sr && sr.innerHTML) return;
      if(view.scrollTop<=2){ startY=e.touches[0].clientY; active=true; dist=0; }
    }, {passive:true});
    view.addEventListener('touchmove', function(e){
      if(!active || startY==null) return;
      dist=e.touches[0].clientY-startY;
      if(dist<=0){ ptr.classList.remove('on'); view.style.transform=''; return; }
      var pull=Math.min(dist*0.42, 76);
      ptr.classList.add('on');
      ptr.style.transform='translateY('+(pull-52)+'px)';
      view.style.transform='translateY('+pull+'px)';
      if(lbl) lbl.textContent = dist>120 ? 'Release to refresh' : 'Pull to refresh';
    }, {passive:true});
    function endPull(){
      if(!active) return;
      active=false;
      view.style.transition='transform .28s cubic-bezier(.22,.61,.36,1)';
      ptr.style.transition='transform .28s, opacity .2s';
      view.style.transform=''; ptr.style.transform=''; ptr.classList.remove('on');
      setTimeout(function(){ view.style.transition=''; ptr.style.transition='opacity .2s'; },300);
      if(dist>120 && !busy){ busy=true; if(lbl) lbl.textContent='Refreshing…'; refreshData().then(function(){ busy=false; }); }
      startY=null; dist=0;
    }
    view.addEventListener('touchend', endPull);
    view.addEventListener('touchcancel', endPull);
  }

  var rb=document.getElementById('refreshBtn'); if(rb) rb.innerHTML=icon('refresh');
  var pi=document.getElementById('ptrIcon'); if(pi) pi.innerHTML=icon('refresh');
}

/* ============================================================================
   13. BOOT — splash always hands over to the app (success OR error state)
   ============================================================================ */
function startApp(){
  var view=document.getElementById('view');
  if(view) view.innerHTML=skeleton();
  var pb=document.getElementById('pagebar');
  if(pb) pb.innerHTML='<div class="pgtext"><h1>Loading</h1><div class="pgsub">Reading CRM snapshot…</div></div>';
  renderTabbar();

  var minWait=wait(MIN_SPLASH_MS);

  return CRM.init().then(function(st){
    return minWait.then(function(){ return st; });
  }).catch(function(err){
    return minWait.then(function(){ return {ready:false, error:(err && err.message)||'Startup failure'}; });
  }).then(function(st){
    try{
      if(!st || !st.ready){
        renderFatal((st && st.error) || window.__SV_ERROR || 'The CRM snapshot could not be read.');
      }else{
        UIState.route=parseHash();
        renderRoute();
      }
    }catch(renderErr){
      console.error('[SHALVADZE CRM] initial render failed', renderErr);
      renderFatal((renderErr && renderErr.message) || 'Initial render failed.');
    }
  }).then(function(){
    window.__SV_BOOTED=true;
    if(window.__SV_FAILSAFE){ clearTimeout(window.__SV_FAILSAFE); window.__SV_FAILSAFE=null; }
    hideSplash();                       /* always runs — splash can never survive boot */
    CRM.onChange(updateSourcePill);
  });
}

function onReady(){
  try{ wireGlobalEvents(); }
  catch(e){ console.error('[SHALVADZE CRM] wiring failed', e); }
  startApp();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', onReady);
else onReady();

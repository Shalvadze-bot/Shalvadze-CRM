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
        'Sign in with an authorized SHALVADZE account, then reload the live snapshot. Cached data is optional — the app runs with empty or blocked localStorage.</p></div></div>';
    }
    var pb = document.getElementById('pagebar');
    if(pb && !pb.innerHTML.replace(/\s/g,'')){
      pb.innerHTML = '<div class="pgtext"><h1>SHALVADZE CRM</h1><div class="pgsub">Startup issue</div></div>';
    }
  }
  window.__SV_FAILSAFE = setTimeout(failsafe, FAILSAFE_MS);
})();

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
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
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
  3. CONFIG + DATA SOURCES (only layer that changes when Sheets goes live)
   ============================================================================ */
var CRM_CONFIG = {
  mode:'remote',
  endpoint:window.CRM_API_ENDPOINT || 'https://us-central1-shalvadze-crm.cloudfunctions.net/crmSnapshot',
  cacheKey:'shalvadze.crm.live-cache.v1',
  cacheTtlMs:60*60*1000,
  simulateFailure:false
};
var MIN_SPLASH_MS = 1100;

var RemoteApiSource = {
  label:'Authenticated live sources',
  load:function(){
    if(!window.auth || !window.auth.currentUser) return Promise.reject(new Error('Sign in is required to load CRM data.'));
    return window.auth.currentUser.getIdToken().then(function(token){
      return fetch(CRM_CONFIG.endpoint, {cache:'no-store', headers:{Authorization:'Bearer '+token}});
    }).then(function(res){
      if(!res.ok) throw new Error('API responded '+res.status);
      return res.json();
    });
  }
};

function wait(ms){ return new Promise(function(r){ setTimeout(r, ms||0); }); }
function deepCopy(o){
  return JSON.parse(JSON.stringify(o));
}
function isArr(v){ return Object.prototype.toString.call(v)==='[object Array]'; }
function isValidSnapshot(raw){
  return !!(raw && typeof raw==='object' && raw.meta && raw.meta.sourceType==='AUTHENTICATED_LIVE_SOURCES' &&
    isArr(raw.companies) && isArr(raw.contacts) && isArr(raw.actions) && isArr(raw.activities) &&
    isArr(raw.buyerIntelligence) && isArr(raw.opportunities) && isArr(raw.drafts) && isArr(raw.marketingCalendar));
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

/* Never reuse prototype or legacy local snapshots. */
try{ window.localStorage.removeItem('shalvadze.crm.cache.v1'); }catch(e){}

/* ============================================================================
   5. CRM DATA SERVICE — the single interface the UI is allowed to use.
      init()/refresh() never throw; they always resolve with state.
   ============================================================================ */
var CRM = {
  _snapshot:null, _byId:null, _loadedAt:null, _error:null, _fromCache:false, _loading:false,
  _listeners:[],

  onChange:function(fn){ if(typeof fn==='function') this._listeners.push(fn); },
  _emit:function(){ var s=this.state; this._listeners.forEach(function(fn){ try{ fn(s); }catch(e){} }); },

  get source(){ return RemoteApiSource; },
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
  // Get current authenticated user from Firebase (if available).
  // NOTE: `auth` is exposed as `window.auth` by the inline script in index.html.
  // That script runs inside an IIFE, so a bare `auth` reference here would
  // always be undefined and the logout section would never render.
  var fbAuth = (typeof window !== 'undefined' && window.auth) ? window.auth : null;
  var currentUser = null;
  var userEmailDisplay = 'Not signed in';
  var showLogout = false;

  // Check if Firebase auth object exists and user is signed in
  if (fbAuth && fbAuth.currentUser) {
    currentUser = fbAuth.currentUser;
    userEmailDisplay = currentUser.email;
    showLogout = true;
  }
  
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
    '</div>';
  
  // Add Account section if user is signed in
  if (showLogout) {
    html += '<div class="menu-group" style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08)">'+
      '<div class="micro" style="margin:2px 2px 6px">Account</div>'+
      '<div class="kv" style="margin-bottom:8px"><span class="k" style="flex:0 0 80px;font-size:12px;color:rgba(255,255,255,0.7)">Email</span><span class="v" style="font-size:12px;color:#EDE6D6;word-break:break-all">'+userEmailDisplay+'</span></div>'+
      '<button id="moreLogoutBtn" class="btn btn-block" style="background:rgba(220,38,38,0.15);border:1px solid rgba(220,38,38,0.3);color:#f87171;padding:8px;font-size:13px">'+icon('logout')+'Sign Out</button>'+
    '</div>';
  }
  
  html += '<div class="banner ink" style="margin-top:4px">'+icon('lock')+
    '<p><b style="color:#EDE6D6">Read-only live viewer.</b> The private CRM workbook and commercial calendar remain the sources of truth. No add, edit, delete, send or status change is possible from this app.</p></div>';
  Sheets.open(html, {title:'More'});
  
  // Attach logout event listener if button exists
  if (showLogout) {
    setTimeout(function() {
      var moreLogoutBtn = document.getElementById('moreLogoutBtn');
      if (moreLogoutBtn) {
        moreLogoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (fbAuth) {
            fbAuth.signOut().then(function() {
              console.log('User signed out from More menu');
              Sheets.close();
              // The auth-state listener in index.html fires on sign-out
              // and switches back to the login screen automatically.
            }).catch(function(error) {
              console.error('Sign out error:', error);
              alert('Error signing out: ' + error.message);
            });
          } else {
            console.warn('Firebase auth not available for sign-out');
          }
        });
      }
    }, 100);
  }
}

function openSourceSheet(){
  var st=CRM.state, meta=CRM.getMeta();
  var rows=[['Companies',CRM.getCompanies().length],['Contacts',CRM.getContacts().length],['Actions',CRM.getActions().length],
    ['Activities',CRM.getActivities().length],['Opportunities',CRM.getOpportunities().length],['Drafts',CRM.getDrafts().length],
    ['Marketing items',CRM.getMarketingCalendar().length]];
  var html=
    '<div class="card pad" style="margin-bottom:12px">'+
      '<div class="kv"><span class="k">Active source</span><span class="v">'+esc(st.source)+'</span></div>'+
      '<div class="kv"><span class="k">Mode</span><span class="v">authenticated remote API</span></div>'+
      '<div class="kv"><span class="k">Sources</span><span class="v" style="font-size:11.5px">'+esc(meta.sourceLabel||'Private CRM workbook + Master Commercial Calendar')+'</span></div>'+
      '<div class="kv"><span class="k">Endpoint</span><span class="v" style="font-size:11.5px">'+esc(st.endpoint||'Not configured')+'</span></div>'+
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
    var h='<div class="banner ink">'+icon('lock')+'<p><b style="color:#EDE6D6">Read-only live viewer.</b> Private CRM and marketing-calendar sources remain the source of truth. This app cannot add, edit, delete, approve, send or change status.</p></div>';

    h+='<div class="sechead" style="margin-top:14px"><h2 class="seclabel">Data Source</h2></div>';
    h+='<div class="card pad">'+
      '<div class="kv"><span class="k">Active source</span><span class="v">'+esc(st.source)+'</span></div>'+
      '<div class="kv"><span class="k">Mode</span><span class="v">'+esc(st.mode)+'</span></div>'+
      '<div class="kv"><span class="k">Private sources</span><span class="v" style="font-size:11.5px">'+esc(meta.sourceLabel||'Private CRM workbook + Master Commercial Calendar')+'</span></div>'+
      '<div class="kv"><span class="k">API endpoint</span><span class="v" style="font-size:11.5px;color:var(--muted)">'+esc(st.endpoint||'Not configured')+'</span></div>'+
      '<div class="kv"><span class="k">Schema version</span><span class="v">v'+esc(meta.schemaVersion||'1.0.0')+'</span></div>'+
      '<div class="kv"><span class="k">Last sync</span><span class="v">'+(st.loadedAt? esc(DateUtil.timeAgo(st.loadedAt)):'—')+'</span></div>'+
      '<div class="kv"><span class="k">Local cache</span><span class="v">'+(cache? 'saved '+esc(DateUtil.timeAgo(cache.savedAt)):'empty')+'</span></div>'+
      '<div class="kv"><span class="k">Storage</span><span class="v">'+(st.storage?'localStorage':'in-memory fallback')+'</span></div>'+
      '<div class="kv"><span class="k">Cache TTL</span><span class="v">'+Math.round(CRM_CONFIG.cacheTtlMs/60000)+' min</span></div>'+
      (st.error? '<div class="banner" style="margin-top:10px">'+icon('alert')+'<p>Last load error: '+esc(st.error)+'</p></div>':'')+
      (st.fromCache? '<div class="banner" style="margin-top:10px">'+icon('database')+'<p>Serving cached snapshot for offline resilience.</p></div>':'')+
    '</div>';
    h+='<div style="display:flex;gap:9px;margin-top:10px">'+
      '<button class="btn btn-dark" style="flex:1" data-act="refresh">'+icon('refresh')+'Refresh</button></div>';
    h+='<div class="note">'+icon('lock')+'<span>The backend verifies the Firebase ID token before reading either private source. The frontend receives one normalized snapshot and never receives a Drive file directly.</span></div>';

    var arch=[
      ['Private CRM sources','SHALVADZE_CRM supplies the current UI data; the separate Master Commercial Calendar supplies Marketing Calendar records.',false],
      ['Authenticated Firebase backend','Verifies the Firebase ID token and authorized email, then reads both private sources server-side with read-only scopes.',false],
      ['Normalized snapshot','Returns companies, contacts, actions, activities, buyer intelligence, opportunities, drafts and marketingCalendar in one payload.',false],
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

    h+='<div class="sechead"><h2 class="seclabel">Cache Controls</h2></div><div class="card pad">'+
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

function reloadAfterAuth(){
  return CRM.refresh().then(function(st){
    if(st.ready){
      UIState.route=parseHash();
      renderRoute();
    }else{
      renderFatal(st.error || 'The authenticated CRM snapshot could not be read.');
    }
    return st;
  });
}
window.reloadCRMData=reloadAfterAuth;

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
    '<div class="note" style="margin-top:14px">'+icon('info')+'<span>Sign in with an authorized SHALVADZE account and retry. The backend reads the private sources only after verifying the Firebase ID token.</span></div></div>';
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

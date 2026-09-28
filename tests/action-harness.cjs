'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');

function code(file, baseline) {
  return baseline ? execFileSync('git', ['show', 'HEAD:' + file], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
}

function backend(baseline = false) {
  const context = vm.createContext({
    process: { env: {} }, Buffer, Date, exports: {},
    require(name) {
      if (name === 'googleapis') return { google: {} };
      if (name === 'firebase-admin') return { initializeApp() {} };
      if (name === 'firebase-functions/v2/https') return { onRequest: (_, handler) => handler };
      if (name === 'firebase-functions/logger') return {};
      return require(path.join(root, 'functions', name === 'xlsx' ? 'node_modules/xlsx' : name));
    }
  });
  vm.runInContext(code('functions/index.js', baseline), context);
  return context;
}

function frontend(baseline = false, now = '2026-09-29T12:00:00+08:00') {
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return new Date(now).getTime(); }
  }
  const storage = new Map();
  const context = vm.createContext({
    Date: Clock, console: { warn() {}, error() {}, log() {} },
    setTimeout() {}, clearTimeout() {},
    location: { hash: '#/dashboard' },
    window: { addEventListener() {}, localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    } },
    document: { readyState: 'loading', addEventListener() {}, getElementById() { return null; } }
  });
  vm.runInContext(code('js/app.js', baseline), context);
  return context;
}

function emptySource() {
  return { companies: [], contacts: [], actions: [], activities: [], buyerIntelligence: [], opportunities: [], drafts: [], marketingCalendar: [] };
}

module.exports = { backend, frontend, emptySource, root };

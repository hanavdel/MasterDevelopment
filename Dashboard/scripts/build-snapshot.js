'use strict';

const fs = require('fs');
const path = require('path');
const { buildSnapshot } = require('../lib/snapshot-builder');
const { PROJECTS, WORK_OPPORTUNITIES, AGENDA_TOPICS, DOC_LINKS } = require('../lib/projects-registry');

const DASHBOARD_DIR = path.join(__dirname, '..');
const WEB_ROOT = path.join(DASHBOARD_DIR, '..', '..');
const MD_ROOT = path.join(WEB_ROOT, 'MasterDevelopment');
const DATA_DIR = path.join(DASHBOARD_DIR, 'data');
const OUT = path.join(DATA_DIR, 'snapshot.json');
const REG_OUT = path.join(DATA_DIR, 'registry.json');
const ICON_DIR = path.join(DASHBOARD_DIR, 'assets', 'projects');

function syncProjectIcons() {
  fs.mkdirSync(ICON_DIR, { recursive: true });
  for (const proj of PROJECTS) {
    if (!proj.iconSrc) continue;
    const ext = path.extname(proj.iconSrc) || '.svg';
    const src = path.join(WEB_ROOT, proj.iconSrc.replace(/\//g, path.sep));
    const dest = path.join(ICON_DIR, proj.id + ext);
    try {
      fs.copyFileSync(src, dest);
    } catch (err) {
      console.warn('Icon skip', proj.id, err.message);
    }
  }
}

function readText(key) {
  if (key === 'WORK_QUEUE.md') return fs.readFileSync(path.join(MD_ROOT, 'WORK_QUEUE.md'), 'utf8');
  if (key === 'SCAN_LOG.md') return fs.readFileSync(path.join(MD_ROOT, 'SCAN_LOG.md'), 'utf8');
  return fs.readFileSync(path.join(WEB_ROOT, key), 'utf8');
}

const snap = buildSnapshot((key) => {
  try {
    return readText(key);
  } catch {
    return null;
  }
});
snap.source = 'static-file';

fs.mkdirSync(DATA_DIR, { recursive: true });
syncProjectIcons();
fs.writeFileSync(OUT, JSON.stringify(snap, null, 2), 'utf8');
fs.writeFileSync(REG_OUT, JSON.stringify({ PROJECTS, WORK_OPPORTUNITIES, AGENDA_TOPICS, DOC_LINKS }, null, 2), 'utf8');
console.log('Wrote', OUT, '—', snap.summary.openWorkCount, 'open items');
console.log('Wrote', REG_OUT);
